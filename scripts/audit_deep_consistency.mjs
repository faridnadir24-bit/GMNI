import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { mapSupabaseRowToIssue, extractClaimsFromRow, extractSourcesFromRow } from '../src/lib/services/issue-adapter.ts';
import { 
  generateResearchDossier, 
  generateMediaBrief, 
  generatePolicyBrief, 
  generatePresentationDeck, 
  generateMeetingNotes, 
  generateSocialMediaContent,
  explainConfidenceScore
} from '../src/lib/services/dossier-engine.ts';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
}

const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['NEXT_PUBLIC_SUPABASE_ANON_KEY']);

async function auditDeepConsistency() {
  console.log('====================================================');
  console.log('DEEP CONSISTENCY & QUALITY AUDIT (5 SAMPLE ISSUES)');
  console.log('====================================================\n');

  const { data: rows } = await supabase.from('issues').select('*').limit(5);
  
  let issueIdx = 1;
  for (const row of rows || []) {
    const issue = mapSupabaseRowToIssue(row);
    const sources = extractSourcesFromRow(row);
    const claims = extractClaimsFromRow(row);
    const dossier = generateResearchDossier(issue, sources, claims);
    const social = generateSocialMediaContent(issue, sources, claims);
    const policyBrief = generatePolicyBrief(issue, sources, claims);
    const presDeck = generatePresentationDeck(issue, sources, claims);
    const meetingNotes = generateMeetingNotes(issue, sources, claims);
    const mediaBrief = generateMediaBrief(issue, sources, claims);

    console.log(`--- [ISSUE ${issueIdx}]: "${issue.title}" ---`);
    console.log(`- Slug: ${issue.slug}`);
    console.log(`- Lokus: ${issue.location}${issue.district ? ` (${issue.district})` : ''} | Kategori: ${issue.category}`);
    console.log(`- Status: ${issue.status} | Impact: ${issue.impact_score}/100 | Momentum: ${issue.momentum_score}/100 | Confidence: ${issue.confidence_score}%`);
    console.log(`- Tanggal Deteksi: ${issue.first_detected_at} | Pembaruan: ${issue.last_updated_at}`);
    console.log(`- Jumlah Sumber Terverifikasi: ${dossier.total_sources_cited} (${sources.map(s => s.source_name).join(', ')})`);
    
    // Check Source URLs
    for (const src of dossier.sources_list) {
      const isValidHttps = src.url.startsWith('https://') && !src.url.includes('localhost') && !src.url.includes('placeholder');
      console.log(`  * ${src.badge} [${src.tier}] ${src.source_name} -> ${src.url} (${isValidHttps ? 'VALID HTTPS' : 'INTERNAL/FALLBACK'})`);
    }

    // Check Facts vs Claims vs Interpretations
    const factsChap = dossier.chapters.find(c => c.id === 'chap-08-fakta-terdokumentasi');
    const claimsChap = dossier.chapters.find(c => c.id === 'chap-09-klaim-pernyataan');
    console.log(`- Fakta Terdokumentasi [Fxx]: ${factsChap?.bullet_points?.length || 0} butir`);
    console.log(`- Klaim & Pernyataan [Cxx]: ${claimsChap?.bullet_points?.length || 0} butir`);
    console.log(`- Benang Merah [Interpretasi]: "${dossier.pattern_interpretation.slice(0, 80)}..."`);
    console.log(`- Apa Arti Perkembangan Ini: "${dossier.what_this_means.slice(0, 80)}..."`);

    // Check Executive Summary Word Count
    const wordCount = dossier.executive_summary.split(/\s+/).length;
    console.log(`- Ringkasan Eksekutif: ${wordCount} kata (Target 500-800 kata)`);

    // Check Multi-Format Writer
    console.log(`- Multi-Format Outputs:`);
    console.log(`  * Naskah Kajian: ${dossier.chapters.length} Bab (Cakupan Sitasi: ${dossier.citation_coverage}%)`);
    console.log(`  * Policy Brief: "${policyBrief.title}" (${policyBrief.key_findings.length} temuan kunci)`);
    console.log(`  * Slide Deck: ${presDeck.slides.length} slides (dengan speaker notes)`);
    console.log(`  * Naskah Rapat Sospol: ${meetingNotes.critical_questions.length} pertanyaan kritis, ${meetingNotes.action_plan_items.length} rencana aksi`);
    console.log(`  * Media Brief: ${mediaBrief.five_key_facts.length} fakta pers, ${mediaBrief.three_key_data.length} data kuantitatif, 1 caveat`);
    console.log(`  * Konten Sosial Media: ${social.instagram_carousel.length} slide IG, ${social.twitter_thread.length} tweet X, 1 video script`);

    console.log(`- Status Kesiapan Publikasi: ${dossier.publication_readiness}\n`);
    issueIdx++;
  }
}

auditDeepConsistency().catch(console.error);
