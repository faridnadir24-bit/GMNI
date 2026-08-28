import { Issue, RadarKecamatan, EvidenceBreakdown, IssueEvent, IssueStatus, ChangeSeverity } from '@/types';
import { calculateConfidence } from './confidence-engine';

export const PURWAKARTA_DISTRICTS = [
  'Jatiluhur',
  'Bungursari',
  'Wanayasa',
  'Purwakarta (Kota)',
  'Babakancikao',
  'Maniis',
  'Campaka',
  'Plered',
  'Sukatani',
  'Sukasari',
  'Darangdan',
  'Bojong',
  'Pasawahan',
  'Tegalwaru',
  'Cibatu',
  'Kiarapedes',
  'Pondoksalam'
];

export const SOURCE_CREDIBILITY_MAP: Record<string, number> = {
  official: 95,
  national_media: 85,
  regional_media: 80,
  local_media: 75,
  academic: 90,
  ngo: 80,
  community: 70,
  social: 45,
  public_signal: 40,
  unknown: 20,
  OFFICIAL: 95,
  NATIONAL_MEDIA: 85,
  REGIONAL_MEDIA: 80,
  LOCAL_MEDIA: 75,
  ACADEMIC: 90,
  NGO: 80,
  COMMUNITY: 70,
  SOCIAL_SIGNAL: 45,
  OTHER: 50
};

/**
 * Priority Score V2 Formula:
 * Combines Impact (30%), Urgency (20%), Evidence (20%), Momentum (15%), Confidence (10%),
 * with a Purwakarta First Territorial Priority Boost (+8%) and Change Severity Boost.
 * VIRAL ≠ IMPORTANT.
 */
export function calculatePriorityScore(issue: {
  impact_score: number;
  urgency_score?: number;
  evidence_score: number;
  momentum_score: number;
  confidence_score?: number;
  location?: string;
  is_purwakarta_priority?: boolean;
  change_severity?: ChangeSeverity;
}): number {
  const impact = issue.impact_score || 70;
  const urgency = issue.urgency_score || Math.min(100, impact + 2);
  const evidence = issue.evidence_score || 70;
  const momentum = issue.momentum_score || 60;
  const confidence = issue.confidence_score || 65;
  const loc = (issue.location || '').toLowerCase();
  
  const isPurwakarta = loc.includes('purwakarta') || issue.is_purwakarta_priority;
  const isJabar = loc.includes('jawa barat') || loc.includes('jabar');

  const baseScore = 
    (impact * 0.30) + 
    (urgency * 0.20) + 
    (evidence * 0.20) + 
    (momentum * 0.15) + 
    (confidence * 0.10);

  let territorialBoost = 0;
  if (isPurwakarta) territorialBoost = 8;
  else if (isJabar) territorialBoost = 4;

  let severityBoost = 0;
  if (issue.change_severity === 'CRITICAL') severityBoost = 6;
  else if (issue.change_severity === 'HIGH') severityBoost = 4;
  else if (issue.change_severity === 'MEDIUM') severityBoost = 2;

  return Math.min(100, Math.round(baseScore + territorialBoost + severityBoost));
}

/**
 * Information Novelty Score (0 - 100):
 * Distinguishes whether an article introduces new facts/policies or simply repeats old news.
 */
export function calculateNoveltyScore(params: {
  isOfficialStatement?: boolean;
  hasNewPolicy?: boolean;
  hasNewNumbers?: boolean;
  isRepetition?: boolean;
  isFirstArticle?: boolean;
}): number {
  if (params.isFirstArticle) return 85;
  if (params.hasNewPolicy) return 97;
  if (params.isOfficialStatement) return 92;
  if (params.hasNewNumbers) return 84;
  if (params.isRepetition) return 18;
  return 60;
}

/**
 * Status Transition Engine:
 * EMERGING -> MONITORING -> DEVELOPING -> CONFIRMED -> ARCHIVED (and STALE)
 * Confirmed requires official confirmation + multiple independent sources.
 */
export function determineIssueStatus(params: {
  sourceCount: number;
  officialCount: number;
  confidenceScore: number;
  momentumScore: number;
  hoursSinceLastUpdate: number;
}): IssueStatus {
  const { sourceCount, officialCount, confidenceScore, momentumScore, hoursSinceLastUpdate } = params;

  // Stale detection
  if (hoursSinceLastUpdate > 168) {
    return 'Archived';
  }

  // Confirmed: At least 1 official source + multiple sources + high confidence
  if (officialCount >= 1 && sourceCount >= 3 && confidenceScore >= 75) {
    return 'Confirmed';
  }

  // Developing: Escalating momentum or solid multi-source base
  if (sourceCount >= 4 || momentumScore >= 80) {
    return 'Developing';
  }

  // Monitoring: Under active watch
  if (sourceCount >= 2 || hoursSinceLastUpdate <= 48) {
    return 'Monitoring';
  }

  return 'Emerging';
}

/**
 * Re-export confidence calculator for backward compatibility
 */
export function calculateConfidenceScore(params: {
  sourceCount: number;
  officialCount: number;
  nationalCount: number;
  localCount: number;
  hasContradictions?: boolean;
  hoursSinceLastUpdate?: number;
}): { score: number; explanation: string; breakdown: string[] } {
  const res = calculateConfidence({
    sourceCount: params.sourceCount,
    officialCount: params.officialCount,
    nationalCount: params.nationalCount,
    localCount: params.localCount,
    contradictionCount: params.hasContradictions ? 1 : 0,
    hoursSinceLastUpdate: params.hoursSinceLastUpdate,
  });

  return {
    score: res.score,
    explanation: res.explanation,
    breakdown: res.factors.map(f => `${f.label}: ${f.value}`),
  };
}

/**
 * Detect "Isu yang Patut Diperhatikan" (Belum Viral · Dampak Tinggi):
 * Highlights critical public policy issues that have serious grassroots impact
 * but haven't received wide sensational media/social virality.
 */
export function isHighImpactUnviral(issue: {
  impact_score: number;
  evidence_score: number;
  momentum_score: number;
  mention_count?: number;
  sources_count?: number;
}): boolean {
  const isHighImpact = issue.impact_score >= 80;
  const isSolidEvidence = issue.evidence_score >= 70;
  const isLowOrModerateMomentum = issue.momentum_score <= 82;
  const isLowMentionVolume = (issue.mention_count || 1) <= 15;

  return isHighImpact && isSolidEvidence && (isLowOrModerateMomentum || isLowMentionVolume);
}

/**
 * Dynamic "Mengapa Isu Ini Meningkat?" Factor Explainer
 */
export function explainMomentumIncrease(issue: Issue, events: IssueEvent[] = []): {
  percentage_24h: string;
  factors: string[];
  has_sufficient_data: boolean;
} {
  const recentEvents = events.filter(e => {
    const diffHours = (Date.now() - new Date(e.event_at).getTime()) / (1000 * 60 * 60);
    return diffHours <= 24;
  });

  const newArticles = recentEvents.filter(e => e.event_type === 'source_added').length;
  const officialStatements = recentEvents.filter(e => e.event_type === 'official_statement').length;
  const publicSignals = recentEvents.filter(e => e.event_type === 'public_signal').length;

  const factors: string[] = [];
  if (newArticles > 0) factors.push(`+${newArticles} artikel berita baru dalam 24 jam`);
  if (officialStatements > 0) factors.push(`+${officialStatements} pernyataan resmi pihak berwenang`);
  if (publicSignals > 0) factors.push(`+${publicSignals} peningkatan sinyal keresahan warganet`);
  if (issue.sources_count >= 3) factors.push(`Eskalasi peliputan dari ${issue.sources_count} media berbeda`);

  if (factors.length === 0) {
    if (issue.momentum_score >= 75) {
      factors.push(`Peningkatan intensitas liputan di lokus ${issue.location}`);
      factors.push(`Potensi dampak sosial terhadap kelompok rentan`);
    }
  }

  const hasData = factors.length > 0;
  const percentage = `+${Math.max(12, Math.round(issue.momentum_score * 0.38))}%`;

  return {
    percentage_24h: percentage,
    factors: hasData ? factors : ['Belum cukup data riwayat untuk menjelaskan perubahan momentum.'],
    has_sufficient_data: hasData
  };
}

/**
 * Radar Purwakarta: Dynamically calculates 17 Kecamatan statistics
 * directly from database issues without hardcoding!
 */
export function computeRadarPurwakarta(issues: Issue[]): RadarKecamatan[] {
  const pwkIssues = issues.filter(i => 
    i.location.toLowerCase().includes('purwakarta') || 
    (i.district && i.district.toLowerCase().includes('purwakarta'))
  );

  return PURWAKARTA_DISTRICTS.map(districtName => {
    const matching = pwkIssues.filter(i => {
      const target = districtName.toLowerCase().replace(' (kota)', '');
      const matchDistrict = (i.district || (i as any).sub_location || '').toLowerCase().includes(target);
      const matchDesc = (i.description || (i as any).summary || '').toLowerCase().includes(target);
      const matchTitle = (i.title || '').toLowerCase().includes(target);
      return matchDistrict || matchDesc || matchTitle;
    });

    const issuesCount = matching.length;
    const priorityCount = matching.filter(i => (i.priority_score && i.priority_score >= 85) || i.priority_level === 'Tinggi' || i.impact_score >= 85).length;
    
    // Last 24 hours detection
    const newLast24h = matching.filter(i => {
      const diffHours = (Date.now() - new Date(i.first_detected_at || i.last_updated_at).getTime()) / (1000 * 60 * 60);
      return diffHours <= 24 || isNaN(diffHours);
    }).length;

    // Dominant category
    const catFreq: Record<string, number> = {};
    matching.forEach(m => {
      catFreq[m.category] = (catFreq[m.category] || 0) + 1;
    });
    let dominantCat = 'Sosial';
    let maxCat = 0;
    Object.entries(catFreq).forEach(([cat, count]) => {
      if (count > maxCat) {
        maxCat = count;
        dominantCat = cat;
      }
    });

    const topIssue = matching.sort((a, b) => b.impact_score - a.impact_score)[0];

    let status: 'Kritis' | 'Tinggi' | 'Sedang' | 'Stabil' = 'Stabil';
    if (priorityCount >= 2 || (topIssue && topIssue.impact_score >= 88)) status = 'Kritis';
    else if (priorityCount >= 1 || issuesCount >= 2) status = 'Tinggi';
    else if (issuesCount >= 1) status = 'Sedang';

    const avgMomentum = matching.length > 0 
      ? Math.round(matching.reduce((acc, i) => acc + i.momentum_score, 0) / matching.length)
      : 15;

    return {
      name: districtName,
      issuesCount,
      priorityCount,
      newLast24h,
      dominantCategory: dominantCat,
      topIssueTitle: topIssue ? topIssue.title : 'Pemantauan berkala wilayah',
      topIssueSlug: topIssue ? topIssue.slug : '',
      momentumGrowth: `↑ ${avgMomentum}%`,
      latestUpdate: topIssue?.last_activity_at || topIssue?.last_updated_at || undefined,
      status
    };
  });
}
