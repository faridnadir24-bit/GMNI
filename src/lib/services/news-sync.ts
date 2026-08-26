import crypto from 'crypto';
import { supabase, isSupabaseConfigured } from './supabase';
import { fetchRawRSSFeeds, RawRSSItem, storeRawSourcesInDatabase } from './rss-fetcher';
import { classifyArticleWithAI, AIClassificationOutput } from './ai-classifier';
import { matchArticleToIssue, generateNeutralIssueTitle, generateIssueSlug, CandidateIssue, extractEntities } from './semantic-cluster';
import { calculatePriorityScore, calculateNoveltyScore, determineIssueStatus, SOURCE_CREDIBILITY_MAP } from './issue-priority';
import { calculateConfidence } from './confidence-engine';
import { detectIssueChanges } from './issue-change-detector';
import { NormalizedSourceType, ChangeSeverity } from '@/types';

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
    matchScore?: number;
    severity?: ChangeSeverity;
    highlights?: string[];
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
 * UNIFIED NEWS SYNC ENGINE (FASE 5)
 * Transforms raw news articles into structured policy intelligence issues.
 * Pipeline: BERITA → SUMBER → VALIDASI → SEMANTIC CLUSTERING → ATTACH/CREATE → CHANGE DETECTION → CONFIDENCE → EVENTS
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
      // Table articles graceful fallback
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
      .select('id, title, category, location, sub_location, summary, last_activity_at, detected_at, source_count, source_urls, source_names, verified_facts, claims, unverified, research_questions, evidence_score, momentum_score, priority_score, confidence_score');

    const existingCandidateIssues: CandidateIssue[] = (dbIssues || []).map(i => ({
      id: i.id,
      title: i.title,
      category: i.category,
      location: i.location,
      sub_location: i.sub_location,
      summary: i.summary,
      last_activity_at: i.last_activity_at,
      detected_at: i.detected_at,
      entities: extractEntities(`${i.title} ${i.summary || ''}`),
    }));

    let newIssuesCreated = 0;
    let existingIssuesUpdated = 0;
    const processDetails: NewsSyncResult['details'] = [];

    // 6. Process each item through Clustering & Change Detection Engine
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

        // Run Semantic Clustering Engine: ARTIKEL BARU ≠ ISU BARU
        const clusterMatch = matchArticleToIssue(
          {
            title: classification.title,
            summary: classification.summary,
            content: item.content,
            category: classification.category,
            location: classification.location,
            sub_location: classification.sub_location,
            published_at: item.published_at,
          },
          existingCandidateIssues
        );

        let targetIssueId: string | null = null;
        let targetIssueTitle: string = '';
        let targetIssueSlug: string = '';
        const sourceType = determineSourceType(item.source_name || 'Media', item.url);

        if (clusterMatch.isMatch && clusterMatch.matchedIssueId) {
          // ==========================================
          // A. ATTACH TO EXISTING ISSUE (MERGE / UPDATE)
          // ==========================================
          targetIssueId = clusterMatch.matchedIssueId;
          const existingIssue = dbIssues?.find(i => i.id === targetIssueId);
          targetIssueTitle = existingIssue?.title || clusterMatch.matchedIssueTitle || classification.title;

          const updatedSourceUrls = Array.from(new Set([...(existingIssue?.source_urls || []), item.url]));
          const updatedSourceNames = Array.from(new Set([...(existingIssue?.source_names || []), item.source_name || 'Media Terkini']));

          const officialCount = updatedSourceNames.filter(s => s.toLowerCase().includes('antara') || s.toLowerCase().includes('pemkab') || s.toLowerCase().includes('dinas') || s.toLowerCase().includes('polres')).length;
          const nationalCount = updatedSourceNames.filter(s => s.toLowerCase().includes('tempo') || s.toLowerCase().includes('cnn') || s.toLowerCase().includes('republika') || s.toLowerCase().includes('kompas') || s.toLowerCase().includes('detik')).length;
          const localCount = updatedSourceNames.filter(s => s.toLowerCase().includes('radar') || s.toLowerCase().includes('purwakarta')).length;

          // Confidence calculation
          const confidenceMeta = calculateConfidence({
            sourceCount: updatedSourceUrls.length,
            officialCount,
            nationalCount,
            localCount,
            contradictionCount: 0,
            hoursSinceLastUpdate: 1,
            hasVerifiedFacts: true,
          });

          // Momentum calculation
          const newMomentum = Math.min(100, Math.max(existingIssue?.momentum_score || 65, classification.momentum_score + 6));

          // Priority V2 calculation
          const priorityScore = calculatePriorityScore({
            impact_score: classification.impact_score,
            evidence_score: Math.max(existingIssue?.evidence_score || 70, classification.evidence_score),
            momentum_score: newMomentum,
            confidence_score: confidenceMeta.score,
            location: classification.location,
            is_purwakarta_priority: classification.location.toLowerCase().includes('purwakarta'),
            change_severity: sourceType === 'official' ? 'MEDIUM' : 'LOW',
          });

          // Change Detection Engine
          const changeResult = detectIssueChanges(
            {
              id: targetIssueId,
              title: targetIssueTitle,
              source_count: updatedSourceUrls.length,
              source_names: updatedSourceNames,
              source_urls: updatedSourceUrls,
              verified_facts: existingIssue?.verified_facts || [],
              claims: existingIssue?.claims || [],
              unverified: existingIssue?.unverified || [],
              confidence_score: existingIssue?.confidence_score || 60,
              momentum_score: existingIssue?.momentum_score || 60,
              priority_score: existingIssue?.priority_score || 70,
            },
            {
              url: item.url,
              title: item.title,
              summary: classification.summary,
              content: item.content,
              sourceName: item.source_name || 'Media Massa',
              sourceType,
              publishedAt: item.published_at || new Date().toISOString(),
              verifiedFacts: classification.verified_facts,
              claims: classification.claims,
              unverified: classification.unverified,
            },
            confidenceMeta.score,
            newMomentum,
            priorityScore
          );

          // Status Engine transition
          const updatedStatus = determineIssueStatus({
            sourceCount: updatedSourceUrls.length,
            officialCount,
            confidenceScore: confidenceMeta.score,
            momentumScore: newMomentum,
            hoursSinceLastUpdate: 1,
          });

          // Update existing issue in Supabase
          await supabase
            .from('issues')
            .update({
              source_urls: updatedSourceUrls,
              source_names: updatedSourceNames,
              source_count: updatedSourceUrls.length,
              verified_facts: changeResult.updatedFacts,
              claims: changeResult.updatedClaims,
              unverified: changeResult.updatedUnverified,
              momentum_score: newMomentum,
              confidence_score: confidenceMeta.score,
              priority_score: priorityScore,
              status: updatedStatus.toLowerCase(),
              last_activity_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', targetIssueId);

          // Insert generated change events into issue_events
          for (const ev of changeResult.newEvents) {
            try {
              await supabase.from('issue_events').insert({
                issue_id: targetIssueId,
                event_type: ev.event_type,
                title: ev.title,
                description: ev.description,
                source_name: ev.source_name,
                event_at: ev.event_at || new Date().toISOString(),
              });
            } catch (e) {}
          }

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
            matchScore: clusterMatch.matchScore,
            severity: changeResult.severity,
            highlights: changeResult.changeSummary.change_highlights,
          });

        } else {
          // ==========================================
          // B. CREATE NEW CANONICAL ISSUE
          // ==========================================
          const neutralTitle = generateNeutralIssueTitle(
            classification.title,
            classification.category,
            classification.location,
            classification.sub_location
          );
          const slug = generateIssueSlug(neutralTitle);
          targetIssueTitle = neutralTitle;
          targetIssueSlug = slug;

          const confidenceMeta = calculateConfidence({
            sourceCount: 1,
            officialCount: sourceType === 'official' ? 1 : 0,
            nationalCount: sourceType === 'national_media' ? 1 : 0,
            localCount: sourceType === 'local_media' ? 1 : 0,
            contradictionCount: 0,
            hoursSinceLastUpdate: 1,
            hasVerifiedFacts: true,
          });

          const priorityScore = calculatePriorityScore({
            impact_score: classification.impact_score,
            evidence_score: classification.evidence_score,
            momentum_score: classification.momentum_score,
            confidence_score: confidenceMeta.score,
            location: classification.location,
            is_purwakarta_priority: classification.location.toLowerCase().includes('purwakarta'),
            change_severity: 'LOW',
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
            momentum_score: classification.momentum_score,
            evidence_score: classification.evidence_score,
            credibility_score: SOURCE_CREDIBILITY_MAP[sourceType] || 80,
            confidence_score: confidenceMeta.score,
            priority_score: priorityScore,
            mention_count: 1,
            source_count: 1,
            source_urls: [item.url],
            source_names: [item.source_name || 'Media Terkini'],
            verified_facts: classification.verified_facts || [item.title],
            claims: classification.claims || [],
            unverified: classification.unverified || [],
            research_questions: classification.research_questions || [],
            detected_at: new Date().toISOString(),
            last_activity_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const { data: createdIssue, error: insertError } = await supabase
            .from('issues')
            .insert(newIssuePayload)
            .select('id, title, slug')
            .single();

          if (!insertError && createdIssue) {
            targetIssueId = createdIssue.id;
            targetIssueSlug = createdIssue.slug;

            // Add newly created issue to in-memory candidate list for subsequent items in the batch
            existingCandidateIssues.push({
              id: createdIssue.id,
              title: createdIssue.title,
              category: classification.category,
              location: classification.location,
              sub_location: classification.sub_location,
              summary: classification.summary,
              last_activity_at: new Date().toISOString(),
              detected_at: new Date().toISOString(),
              entities: extractEntities(`${neutralTitle} ${classification.summary}`),
            });

            // Insert initial timeline event
            try {
              await supabase.from('issue_events').insert({
                issue_id: targetIssueId,
                event_type: sourceType === 'official' ? 'official_statement' : 'source_added',
                title: `Liputan awal dari ${item.source_name || 'Media Nasional / Daerah'}`,
                description: `Pemberitaan terverifikasi pertama kali terdata dalam sistem pengawasan isu.`,
                source_name: item.source_name || 'Media',
                event_at: item.published_at || new Date().toISOString(),
              });
            } catch (e) {}

            // Insert into issue_sources
            try {
              await supabase.from('issue_sources').insert({
                issue_id: targetIssueId,
                article_id: item.id,
                source_url: item.url,
                source_name: item.source_name || 'Media Rujukan',
                source_type: sourceType,
                published_at: item.published_at || new Date().toISOString(),
                relevance_score: 90,
                credibility_score: SOURCE_CREDIBILITY_MAP[sourceType] || 80,
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
              issueTitle: neutralTitle,
              matchScore: clusterMatch.matchScore,
              severity: 'LOW',
              highlights: ['Inisialisasi pemantauan isu baru berbasis rujukan terverifikasi.'],
            });
          }
        }

        // 7. Update article record with issue association
        if (targetIssueId) {
          try {
            await supabase.from('articles').update({
              processed: true,
              issue_id: targetIssueId,
              issue_title: targetIssueTitle,
              issue_slug: targetIssueSlug || undefined,
              relevance_score: 85,
              category: classification.category,
              location: classification.location,
              sub_location: classification.sub_location,
            }).eq('id', item.id);
          } catch (e) {}
        }

        // Mark raw_source as processed
        try {
          await supabase.from('raw_sources').update({ processed: true }).eq('url', item.url);
        } catch (e) {}

      } catch (err) {
        console.error(`[NewsSync] Error processing item "${item.title}":`, err);
      }
    }

    // 8. Final Count
    const { count: finalIssueCount } = await supabase
      .from('issues')
      .select('*', { count: 'exact', head: true });

    const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
    isSyncRunning = false;

    return {
      success: true,
      message: `Sinkronisasi selesai dalam ${durationSec}s. ${newArticlesCount} artikel baru terindeks, ${existingIssuesUpdated} isu diperbarui dengan bukti baru, ${newIssuesCreated} isu baru teridentifikasi.`,
      duration: `${durationSec}s`,
      summary: {
        totalRssFetched: rawItems.length,
        newArticlesInserted: newArticlesCount,
        processedByAI: pendingItems.length,
        newIssuesCreated,
        existingIssuesUpdated,
        totalIssuesInDatabase: finalIssueCount || 0,
      },
      details: processDetails,
    };

  } catch (error: any) {
    isSyncRunning = false;
    console.error('[NewsSync] Engine error:', error);
    return {
      success: false,
      message: error?.message || 'Terjadi kesalahan sistem saat sinkronisasi.',
      duration: `${((Date.now() - startTime) / 1000).toFixed(2)}s`,
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
}
