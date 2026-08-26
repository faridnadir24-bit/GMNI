import { Issue, IssueEvent, IssueChangeSummary, ChangeSeverity, ChangeType, NormalizedSourceType } from '@/types';
import { extractEntities, ExtractedEntities } from './semantic-cluster';
import { detectContradictions, DetectedContradiction } from './contradiction-engine';

export interface IncomingArticleForChangeDetection {
  url: string;
  title: string;
  summary: string;
  content?: string;
  sourceName: string;
  sourceType: NormalizedSourceType;
  publishedAt: string;
  verifiedFacts?: string[];
  claims?: string[];
  unverified?: string[];
}

export interface ChangeDetectionResult {
  hasChanges: boolean;
  severity: ChangeSeverity;
  changeSummary: IssueChangeSummary;
  newEvents: IssueEvent[];
  newContradictions: DetectedContradiction[];
  updatedFacts: string[];
  updatedClaims: string[];
  updatedUnverified: string[];
}

/**
 * Detects new information, statements, actors, facts, and contradictions
 * when a new article is attached to an existing issue.
 */
export function detectIssueChanges(
  existingIssue: {
    id: string;
    title: string;
    source_count?: number;
    source_names?: string[];
    source_urls?: string[];
    verified_facts?: string[];
    claims?: string[];
    unverified?: string[];
    confidence_score?: number;
    momentum_score?: number;
    priority_score?: number;
    events?: IssueEvent[];
  },
  newArticle: IncomingArticleForChangeDetection,
  newConfidenceScore: number,
  newMomentumScore: number,
  newPriorityScore: number
): ChangeDetectionResult {
  const newEvents: IssueEvent[] = [];
  const changeHighlights: string[] = [];
  let highestSeverity: ChangeSeverity = 'LOW';

  const existingFacts = new Set(existingIssue.verified_facts || []);
  const existingClaims = new Set(existingIssue.claims || []);
  const existingUrls = new Set(existingIssue.source_urls || []);

  const isNewSourceUrl = !existingUrls.has(newArticle.url);
  const isOfficial = newArticle.sourceType === 'official';

  // 1. Check for New Official Statement
  if (isOfficial) {
    highestSeverity = 'MEDIUM';
    changeHighlights.push(`+1 pernyataan resmi dari ${newArticle.sourceName}`);
    newEvents.push({
      id: `evt-${existingIssue.id}-${Date.now()}-official`,
      issue_id: existingIssue.id,
      event_type: 'official_statement',
      title: `Pernyataan Resmi dari ${newArticle.sourceName}`,
      description: newArticle.title,
      source_name: newArticle.sourceName,
      event_at: newArticle.publishedAt,
    });
  } else if (isNewSourceUrl) {
    newEvents.push({
      id: `evt-${existingIssue.id}-${Date.now()}-source`,
      issue_id: existingIssue.id,
      event_type: 'source_added',
      title: `Rujukan Baru dari ${newArticle.sourceName}`,
      description: newArticle.title,
      source_name: newArticle.sourceName,
      event_at: newArticle.publishedAt,
    });
  }

  // 2. Fact & Claim Deltas
  const newFactsList: string[] = [];
  (newArticle.verifiedFacts || []).forEach(f => {
    if (!existingFacts.has(f)) {
      newFactsList.push(f);
    }
  });

  const newClaimsList: string[] = [];
  (newArticle.claims || []).forEach(c => {
    if (!existingClaims.has(c)) {
      newClaimsList.push(c);
    }
  });

  if (newFactsList.length > 0) {
    changeHighlights.push(`+${newFactsList.length} fakta terkonfirmasi baru`);
    if (highestSeverity === 'LOW') highestSeverity = 'MEDIUM';
  }

  if (newClaimsList.length > 0) {
    changeHighlights.push(`+${newClaimsList.length} klaim/pernyataan baru`);
  }

  // 3. Contradiction Detection
  const existingSourcesForContradiction = (existingIssue.verified_facts || []).map(f => ({
    sourceName: 'Liputan Terdahulu',
    content: f,
    publishedAt: newArticle.publishedAt,
  }));

  const detectedContradictions = detectContradictions(
    `${newArticle.title} ${newArticle.summary} ${newArticle.content || ''}`,
    newArticle.sourceName,
    newArticle.publishedAt,
    existingSourcesForContradiction
  );

  if (detectedContradictions.length > 0) {
    highestSeverity = 'HIGH';
    changeHighlights.push(`${detectedContradictions.length} selisih data numerik terdeteksi`);
  }

  // 4. Momentum / Priority Spike
  const currentPriority = existingIssue.priority_score || 70;
  const currentConfidence = existingIssue.confidence_score || 50;
  const currentMomentum = existingIssue.momentum_score || 60;

  if (newPriorityScore - currentPriority >= 10) {
    highestSeverity = 'HIGH';
    changeHighlights.push(`Eskalasi prioritas kajian (+${newPriorityScore - currentPriority} poin)`);
  }

  // Combine lists
  const updatedFacts = Array.from(new Set([...(existingIssue.verified_facts || []), ...(newArticle.verifiedFacts || [])]));
  const updatedClaims = Array.from(new Set([...(existingIssue.claims || []), ...(newArticle.claims || [])]));
  const updatedUnverified = Array.from(new Set([...(existingIssue.unverified || []), ...(newArticle.unverified || [])]));

  const changeSummary: IssueChangeSummary = {
    has_changes: true,
    last_changed_at: new Date().toISOString(),
    change_severity: highestSeverity,
    new_sources_count: isNewSourceUrl ? 1 : 0,
    new_official_statements: isOfficial ? 1 : 0,
    new_facts_count: newFactsList.length,
    new_claims_count: newClaimsList.length,
    confidence_delta: {
      before: currentConfidence,
      after: newConfidenceScore,
    },
    momentum_delta: {
      before: currentMomentum,
      after: newMomentumScore,
    },
    priority_delta: {
      before: currentPriority,
      after: newPriorityScore,
    },
    change_highlights: changeHighlights.length > 0 ? changeHighlights : ['Pembaruan rujukan media dan data aktivitas isu.'],
  };

  return {
    hasChanges: true,
    severity: highestSeverity,
    changeSummary,
    newEvents,
    newContradictions: detectedContradictions,
    updatedFacts,
    updatedClaims,
    updatedUnverified,
  };
}
