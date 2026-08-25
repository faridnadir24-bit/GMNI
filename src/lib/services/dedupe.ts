import slugify from 'slugify';
import { supabase, isSupabaseConfigured } from './supabase';
import { AIClassificationOutput } from './ai-classifier';

export interface DedupeAndSaveParams {
  url: string;
  sourceName?: string;
  classification: AIClassificationOutput;
}

export async function dedupeAndSaveIssue(params: DedupeAndSaveParams): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    console.warn('[Dedupe Service] Supabase belum dikonfigurasi.');
    return null;
  }

  const { url, sourceName = 'Media Terkini', classification } = params;

  try {
    // 1. Cek apakah URL sudah pernah ditambahkan ke salah satu issue
    const { data: existingByUrl, error: urlCheckError } = await supabase
      .from('issues')
      .select('id, source_urls, source_names, source_count, verified_facts, claims, unverified, research_questions')
      .contains('source_urls', [url])
      .maybeSingle();

    if (urlCheckError) {
      console.error('[Dedupe Service] Error checking URL contains:', urlCheckError);
    }

    if (existingByUrl) {
      // URL sudah ada, cukup update timestamp
      await supabase
        .from('issues')
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingByUrl.id);

      return existingByUrl.id;
    }

    // 2. Cek apakah ada issue serupa berdasarkan judul atau kemiripan (title exact/substring match)
    const normalizedTitle = classification.title.trim();
    const { data: existingByTitle } = await supabase
      .from('issues')
      .select('id, source_urls, source_names, source_count, verified_facts, claims, unverified, research_questions')
      .ilike('title', `%${normalizedTitle.slice(0, 40)}%`)
      .maybeSingle();

    if (existingByTitle) {
      // Update issue yang ada dengan menambahkan rujukan sumber baru
      const updatedSourceUrls = Array.from(new Set([...(existingByTitle.source_urls || []), url]));
      const updatedSourceNames = Array.from(new Set([...(existingByTitle.source_names || []), sourceName]));
      const updatedFacts = Array.from(new Set([...(existingByTitle.verified_facts || []), ...(classification.verified_facts || [])]));
      const updatedClaims = Array.from(new Set([...(existingByTitle.claims || []), ...(classification.claims || [])]));
      const updatedUnverified = Array.from(new Set([...(existingByTitle.unverified || []), ...(classification.unverified || [])]));
      const updatedQuestions = Array.from(new Set([...(existingByTitle.research_questions || []), ...(classification.research_questions || [])]));

      const { error: updateError } = await supabase
        .from('issues')
        .update({
          source_urls: updatedSourceUrls,
          source_names: updatedSourceNames,
          source_count: updatedSourceUrls.length,
          verified_facts: updatedFacts,
          claims: updatedClaims,
          unverified: updatedUnverified,
          research_questions: updatedQuestions,
          updated_at: new Date().toISOString(),
          momentum_score: Math.min(100, Math.max(classification.momentum_score, 80)),
        })
        .eq('id', existingByTitle.id);

      if (updateError) {
        console.error('[Dedupe Service] Error updating existing issue:', updateError);
      }

      return existingByTitle.id;
    }

    // 3. Jika belum ada, buat slug baru dan insert ke tabel issues
    const baseSlug = slugify(classification.title, {
      lower: true,
      strict: true,
      trim: true,
    });
    const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const newIssuePayload = {
      slug: uniqueSlug,
      title: classification.title,
      summary: classification.summary,
      category: classification.category,
      location: classification.location,
      sub_location: classification.sub_location,
      status: classification.status || 'emerging',
      impact_score: classification.impact_score,
      evidence_score: classification.evidence_score,
      momentum_score: classification.momentum_score,
      source_count: 1,
      source_urls: [url],
      source_names: [sourceName],
      published_at: new Date().toISOString(),
      detected_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      verified_facts: classification.verified_facts || [],
      claims: classification.claims || [],
      unverified: classification.unverified || [],
      research_questions: classification.research_questions || [],
      actor_map: [],
    };

    const { data: insertedData, error: insertError } = await supabase
      .from('issues')
      .insert(newIssuePayload)
      .select('id')
      .single();

    if (insertError) {
      console.error('[Dedupe Service] Error inserting new issue:', insertError);
      return null;
    }

    return insertedData?.id || null;
  } catch (err) {
    console.error('[Dedupe Service] Unexpected error during dedupe:', err);
    return null;
  }
}
