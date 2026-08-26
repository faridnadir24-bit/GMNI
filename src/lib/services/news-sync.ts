import crypto from 'crypto';
import { supabase, isSupabaseConfigured } from './supabase';
import { fetchRawRSSFeeds, RawRSSItem, storeRawSourcesInDatabase } from './rss-fetcher';
import { classifyArticleWithAI, AIClassificationOutput } from './ai-classifier';
import { matchArticleToIssue, generateNeutralIssueTitle, generateIssueSlug, CandidateIssue } from './issue-cluster';
import { calculatePriorityScore, calculateConfidenceScore, SOURCE_CREDIBILITY_MAP } from './issue-priority';
import { NormalizedSourceType } from '@/types';

export interface NewsSyncResult {
  success: boolean;
  message: string;
  duration: string;
  summary: {
    totalRssFetched: number;
    newArticlesInserted: number;
    processedByAI: number;
    newIssuesCreated: number;
    existingIssuesUpdated: number;
    totalIssuesInDatabase: number;
  };
  details: {
    articleId?: string;
    title: string;
    source: string;
    action: 'created_issue' | 'attached_to_existing' | 'skipped_irrelevant';
    issueId?: string | null;
    issueTitle?: string;
  }[];
}

function determineSourceType(sourceName: string, url: string): NormalizedSourceType {
  const s = sourceName.toLowerCase();
  const u = url.toLowerCase();

  if (s.includes('antara') || s.includes('kemen') || s.includes('pemkab') || s.includes('dinas') || s.includes('polres') || s.includes('kejaksaan')) {
    return 'official';
  }
  if (s.includes('radar') || s.includes('purwakarta') || s.includes('jabar') || u.includes('jabar') || u.includes('purwakarta')) {
    return 'local_media';
  }
  if (s.includes('tempo') || s.includes('cnn') || s.includes('republika') || s.includes('kompas') || s.includes('detik')) {
    return 'national_media';
  }
  return 'national_media';
}

function generateArticleHash(title: string, url: string): string {
  return crypto.createHash('sha256').update(`${title.trim().toLowerCase()}_${url.trim()}`).digest('hex');
}

// Concurrency lock to prevent overlapping sync executions
let isSyncRunning = false;
let lastSyncStartTime = 0;

/**
 * UNIFIED NEWS SYNC ENGINE
 * Transforms raw news articles into structured policy intelligence issues.
 * Pipeline: BERITA → SUMBER → VALIDASI → CLUSTERING → ISU → UPDATE ISU → EVIDENCE → EVENTS
 */
export async function runNewsSyncEngine(options: { batchLimit?: number } = {}): Promise<NewsSyncResult> {
  const startTime = Date.now();
  const batchLimit = options.batchLimit || 15;

  if (isSyncRunning && (Date.now() - lastSyncStartTime < 50000)) {
    return {
      success: true,
      message: 'Proses sinkronisasi berita sedang aktif berjalan di thread lain. Menghindari duplikasi antrean.',
      duration: '0.00s',
      summary: {
        totalRssFetched: 0,
        newArticlesInserted: 0,
        processedByAI: 0,
        newIssuesCreated: 0,
        existingIssuesUpdated: 0,
        totalIssuesInDatabase: 0,
      },
      details: [],
    };
  }

  isSyncRunning = true;
  lastSyncStartTime = Date.now();

  if (!isSupabaseConfigured()) {
    isSyncRunning = false;
    return {
      success: false,
      message: 'Supabase belum dikonfigurasi. Periksa kredensial di .env.local atau Vercel Settings.',
      duration: '0.00s',
      summary: {
        totalRssFetched: 0,
        newArticlesInserted: 0,
        processedByAI: 0,
        newIssuesCreated: 0,
        existingIssuesUpdated: 0,
        totalIssuesInDatabase: 0,
      },
      details: [],
    };
  }

  try {
    // 1. Fetch raw feeds from all active RSS endpoints
    const rawItems = await fetchRawRSSFeeds();
    let newArticlesCount = 0;

    // 2. Store to raw_sources (ingestion log)
    await storeRawSourcesInDatabase(rawItems);

    // 3. Normalize & Store into `articles` table in batches
    const articlesBatch = rawItems.slice(0, 50).map(item => {
      const sourceType = determineSourceType(item.source_name || 'Media', item.url);
      const articleHash = generateArticleHash(item.title, item.url);
      return {
        url: item.url,
        canonical_url: item.url.split('?')[0],
        title: item.title,
        summary: item.content.slice(0, 300),
        content: item.content,
        source_name: item.source_name || 'Media Massa',
        source_type: sourceType,
        published_at: item.published_at || new Date().toISOString(),
        fetched_at: new Date().toISOString(),
        hash: articleHash,
        language: 'id',
        processed: false,
      };
    });

    try {
      const { data: insertedArt } = await supabase
        .from('articles')
        .upsert(articlesBatch, { onConflict: 'url', ignoreDuplicates: true })
        .select('id');

      if (insertedArt) {
        newArticlesCount = insertedArt.length;
      }
    } catch (e) {
      // Table articles might still be migrating; raw_sources handles fallback
    }

    // 4. Query candidate pending articles / raw sources to process
    let pendingItems: { id: string; url: string; title: string; content: string; source_name?: string; published_at?: string }[] = [];

    // Try fetching from `articles` table first
    const { data: pendingArticles } = await supabase
      .from('articles')
      .select('id, url, title, content, source_name, published_at')
      .eq('processed', false)
      .limit(batchLimit);

    if (pendingArticles && pendingArticles.length > 0) {
      pendingItems = pendingArticles;
    } else {
      // Fallback to raw_sources if articles table empty/migrating
      const { data: pendingRaw } = await supabase
        .from('raw_sources')
        .select('id, url, title, content')
        .eq('processed', false)
        .limit(batchLimit);

      if (pendingRaw && pendingRaw.length > 0) {
        pendingItems = pendingRaw.map(r => ({
          ...r,
          source_name: 'Media Nasional / Daerah',
          published_at: new Date().toISOString(),
        }));
      }
    }

    // If queue is empty, take latest items from freshly fetched RSS feeds
    if (pendingItems.length === 0 && rawItems.length > 0) {
      pendingItems = rawItems.slice(0, batchLimit).map(r => ({
        id: `raw-${Date.now()}-${Math.random().toString().slice(2, 6)}`,
        url: r.url,
        title: r.title,
        content: r.content,
        source_name: r.source_name,
        published_at: r.published_at,
      }));
    }

    // 5. Fetch all candidate issues for clustering
    const { data: dbIssues } = await supabase
      .from('issues')
      .select('id, title, category, location, sub_location, summary, last_activity_at, detected_at, source_count, source_urls, source_names, verified_facts, claims, unverified, research_questions, evidence_score, momentum_score');

    const existingCandidateIssues: CandidateIssue[] = (dbIssues || []).map(i => ({
      id: i.id,
      title: i.title,
      category: i.category,
      location: i.location,
      sub_location: i.sub_location,
      summary: i.summary,
      last_activity_at: i.last_activity_at,
      detected_at: i.detected_at,
    }));

    let newIssuesCreated = 0;
    let existingIssuesUpdated = 0;
    const processDetails: NewsSyncResult['details'] = [];

    // 6. Process each item through Clustering & Deduplication Engine
    for (const item of pendingItems) {
      try {
        const classification = await classifyArticleWithAI(item.title, item.content);
        if (!classification) continue;

        if (!classification.relevant) {
          // Mark article as processed without creating issue
          await supabase.from('articles').update({ processed: true, relevance_score: 20 }).eq('id', item.id);
          await supabase.from('raw_sources').update({ processed: true }).eq('url', item.url);

          processDetails.push({
            articleId: item.id,
            title: item.title,
            source: item.source_name || 'Media',
            action: 'skipped_irrelevant',
          });
          continue;
        }

        // Run Issue Clustering Engine: BERITA ≠ ISU
        const clusterMatch = matchArticleToIssue(
          {
            title: classification.title,
            summary: classification.summary,
            category: classification.category,
            location: classification.location,
            sub_location: classification.sub_location,
            published_at: item.published_at,
          },
          existingCandidateIssues
        );

        let targetIssueId: string | null = null;
        let targetIssueTitle: string = '';
        const sourceType = determineSourceType(item.source_name || 'Media', item.url);

        if (clusterMatch.isMatch && clusterMatch.matchedIssueId) {
          // ATTACH TO EXISTING ISSUE (Cluster into 1 Issue)
          targetIssueId = clusterMatch.matchedIssueId;
          const existingIssue = dbIssues?.find(i => i.id === targetIssueId);
          targetIssueTitle = existingIssue?.title || clusterMatch.matchedIssueTitle || classification.title;

          const updatedSourceUrls = Array.from(new Set([...(existingIssue?.source_urls || []), item.url]));
          const updatedSourceNames = Array.from(new Set([...(existingIssue?.source_names || []), item.source_name || 'Media Terkini']));
          const updatedFacts = Array.from(new Set([...(existingIssue?.verified_facts || []), ...(classification.verified_facts || [])]));
          const updatedClaims = Array.from(new Set([...(existingIssue?.claims || []), ...(classification.claims || [])]));
          const updatedUnverified = Array.from(new Set([...(existingIssue?.unverified || []), ...(classification.unverified || [])]));
          const updatedQuestions = Array.from(new Set([...(existingIssue?.research_questions || []), ...(classification.research_questions || [])]));

          const confidenceMeta = calculateConfidenceScore({
            sourceCount: updatedSourceUrls.length,
            officialCount: updatedSourceNames.filter(s => s.toLowerCase().includes('antara') || s.toLowerCase().includes('pemkab')).length,
            nationalCount: updatedSourceNames.filter(s => s.toLowerCase().includes('tempo') || s.toLowerCase().includes('cnn') || s.toLowerCase().includes('republika')).length,
            localCount: updatedSourceNames.filter(s => s.toLowerCase().includes('radar') || s.toLowerCase().includes('purwakarta')).length,
            hasContradictions: false,
            hoursSinceLastUpdate: 1,
          });

          const priorityScore = calculatePriorityScore({
            impact_score: classification.impact_score,
            evidence_score: Math.max(existingIssue?.evidence_score || 70, classification.evidence_score),
            momentum_score: Math.min(100, Math.max(existingIssue?.momentum_score || 65, classification.momentum_score + 8)),
            location: classification.location,
            is_purwakarta_priority: classification.location.toLowerCase().includes('purwakarta'),
          });

          // Update Issue in database (V2 with graceful V1 fallback)
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
              momentum_score: Math.min(100, (existingIssue?.momentum_score || 60) + 5),
              confidence_score: confidenceMeta.score,
              priority_score: priorityScore,
              last_activity_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', targetIssueId);

          if (updateError) {
            await supabase
              .from('issues')
              .update({
                source_urls: updatedSourceUrls,
                source_names: updatedSourceNames,
                source_count: updatedSourceUrls.length,
                verified_facts: updatedFacts,
                claims: updatedClaims,
                unverified: updatedUnverified,
                research_questions: updatedQuestions,
                momentum_score: Math.min(100, (existingIssue?.momentum_score || 60) + 5),
                updated_at: new Date().toISOString(),
              })
              .eq('id', targetIssueId);
          }

          // Record timeline event
          try {
            await supabase.from('issue_events').insert({
              issue_id: targetIssueId,
              event_type: 'source_added',
              title: `Rujukan baru dari ${item.source_name || 'Media Massa'}`,
              description: `Liputan terkait "${item.title}" ditambahkan ke dalam basis bukti isu.`,
              source_name: item.source_name || 'Media',
              event_at: new Date().toISOString(),
            });
          } catch (e) {}

          // Record in issue_sources junction table
          try {
            await supabase.from('issue_sources').insert({
              issue_id: targetIssueId,
              article_id: item.id,
              source_url: item.url,
              source_name: item.source_name || 'Media Rujukan',
              source_type: sourceType,
              published_at: item.published_at || new Date().toISOString(),
              relevance_score: 85,
              credibility_score: SOURCE_CREDIBILITY_MAP[sourceType] || 80,
              is_primary: false,
            });
          } catch (e) {}

          existingIssuesUpdated++;
          processDetails.push({
            articleId: item.id,
            title: item.title,
            source: item.source_name || 'Media',
            action: 'attached_to_existing',
            issueId: targetIssueId,
            issueTitle: targetIssueTitle,
          });

        } else {
          // CREATE NEW ISSUE WITH NEUTRAL EDITORIAL TITLE
          const neutralTitle = generateNeutralIssueTitle(
            classification.title,
            classification.category,
            classification.location,
            classification.sub_location
          );
          const slug = generateIssueSlug(neutralTitle);
          targetIssueTitle = neutralTitle;

          const priorityScore = calculatePriorityScore({
            impact_score: classification.impact_score,
            evidence_score: classification.evidence_score,
            momentum_score: classification.momentum_score,
            location: classification.location,
            is_purwakarta_priority: classification.location.toLowerCase().includes('purwakarta'),
          });

          const confidenceMeta = calculateConfidenceScore({
            sourceCount: 1,
            officialCount: sourceType === 'official' ? 1 : 0,
            nationalCount: sourceType === 'national_media' ? 1 : 0,
            localCount: sourceType === 'local_media' ? 1 : 0,
            hasContradictions: false,
            hoursSinceLastUpdate: 1,
          });

          const newIssuePayload = {
            slug,
            title: neutralTitle,
            summary: classification.summary,
            category: classification.category,
            location: classification.location,
            sub_location: classification.sub_location,
            status: classification.status || 'emerging',
            impact_score: classification.impact_score,
            urgency_score: Math.min(100, classification.impact_score + 2),
            evidence_score: classification.evidence_score,
            momentum_score: classification.momentum_score,
            confidence_score: confidenceMeta.score,
            priority_score: priorityScore,
            source_count: 1,
            mention_count: 1,
            is_priority: priorityScore >= 85,
            is_emerging: true,
            source_urls: [item.url],
            source_names: [item.source_name || 'Media Terkini'],
            published_at: item.published_at || new Date().toISOString(),
            first_detected_at: new Date().toISOString(),
            last_activity_at: new Date().toISOString(),
            detected_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            verified_facts: classification.verified_facts || [],
            claims: classification.claims || [],
            unverified: classification.unverified || [],
            research_questions: classification.research_questions || [],
            actor_map: [],
          };

          let insertedIssueId: string | null = null;
          const { data: insertedV2, error: insertIssueErr } = await supabase
            .from('issues')
            .insert(newIssuePayload)
            .select('id')
            .single();

          if (insertedV2) {
            insertedIssueId = insertedV2.id;
          } else {
            // Fallback to V1 columns
            const v1Payload = {
              slug,
              title: neutralTitle,
              summary: classification.summary,
              category: classification.category,
              location: classification.location,
              sub_location: classification.sub_location,
              status: classification.status || 'emerging',
              impact_score: classification.impact_score,
              evidence_score: classification.evidence_score,
              momentum_score: classification.momentum_score,
              source_count: 1,
              source_urls: [item.url],
              source_names: [item.source_name || 'Media Terkini'],
              published_at: item.published_at || new Date().toISOString(),
              detected_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              verified_facts: classification.verified_facts || [],
              claims: classification.claims || [],
              unverified: classification.unverified || [],
              research_questions: classification.research_questions || [],
              actor_map: [],
            };
            const { data: insertedV1 } = await supabase
              .from('issues')
              .insert(v1Payload)
              .select('id')
              .single();

            if (insertedV1) {
              insertedIssueId = insertedV1.id;
            }
          }

          if (insertedIssueId) {
            targetIssueId = insertedIssueId;

            // Register in existingCandidateIssues so subsequent articles in same batch can cluster into it
            existingCandidateIssues.push({
              id: targetIssueId,
              title: neutralTitle,
              category: classification.category,
              location: classification.location,
              sub_location: classification.sub_location,
              summary: classification.summary,
              last_activity_at: new Date().toISOString(),
            });

            // Insert initial timeline event
            try {
              await supabase.from('issue_events').insert({
                issue_id: targetIssueId,
                event_type: 'source_added',
                title: `Isu pertama kali terdeteksi dari ${item.source_name || 'Media'}`,
                description: `Pemberitaan awal terbit mengenai "${item.title}".`,
                source_name: item.source_name || 'Media',
                event_at: new Date().toISOString(),
              });
            } catch (e) {}

            // Insert in issue_sources
            try {
              await supabase.from('issue_sources').insert({
                issue_id: targetIssueId,
                article_id: item.id,
                source_url: item.url,
                source_name: item.source_name || 'Media Utama',
                source_type: sourceType,
                published_at: item.published_at || new Date().toISOString(),
                relevance_score: 90,
                credibility_score: SOURCE_CREDIBILITY_MAP[sourceType] || 85,
                is_primary: true,
              });
            } catch (e) {}

            newIssuesCreated++;
            processDetails.push({
              articleId: item.id,
              title: item.title,
              source: item.source_name || 'Media',
              action: 'created_issue',
              issueId: targetIssueId,
              issueTitle: targetIssueTitle,
            });
          }
        }

        // 7. Mark article and raw_source as processed and link to issue_id
        try {
          await supabase
            .from('articles')
            .update({
              processed: true,
              issue_id: targetIssueId,
              category: classification.category,
              location: classification.location,
              sub_location: classification.sub_location,
              relevance_score: 90,
              updated_at: new Date().toISOString(),
            })
            .eq('id', item.id);
        } catch (e) {}

        await supabase
          .from('raw_sources')
          .update({
            processed: true,
            issue_id: targetIssueId,
          })
          .eq('url', item.url);

      } catch (itemErr: any) {
        console.error(`[News Sync Engine] Error processing item ${item.title}:`, itemErr?.message || itemErr);
      }
    }

    // Get final count of issues in database
    const { count: totalIssuesCount } = await supabase
      .from('issues')
      .select('*', { count: 'exact', head: true });

    const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);

    return {
      success: true,
      message: `Sinkronisasi intelligence engine selesai dalam ${durationSec}s. (${newIssuesCreated} isu baru dibuat, ${existingIssuesUpdated} isu diperbarui).`,
      duration: `${durationSec}s`,
      summary: {
        totalRssFetched: rawItems.length,
        newArticlesInserted: newArticlesCount,
        processedByAI: processDetails.length,
        newIssuesCreated,
        existingIssuesUpdated,
        totalIssuesInDatabase: totalIssuesCount || 0,
      },
      details: processDetails,
    };
  } catch (error: any) {
    console.error('[News Sync Engine] Fatal Pipeline Error:', error);
    return {
      success: false,
      message: `Gagal menjalankan pipeline sinkronisasi: ${error?.message || 'Unknown error'}`,
      duration: '0.00s',
      summary: {
        totalRssFetched: 0,
        newArticlesInserted: 0,
        processedByAI: 0,
        newIssuesCreated: 0,
        existingIssuesUpdated: 0,
        totalIssuesInDatabase: 0,
      },
      details: [],
    };
  } finally {
    isSyncRunning = false;
  }
}
