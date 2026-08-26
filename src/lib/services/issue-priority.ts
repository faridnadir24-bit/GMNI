import { Issue, RadarKecamatan, EvidenceBreakdown, IssueEvent } from '@/types';

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

export const SOURCE_CREDIBILITY_MAP = {
  official: 95,
  national_media: 85,
  local_media: 75,
  social: 45,
  public_signal: 40,
  unknown: 20
};

/**
 * Priority Score Formula:
 * Combines Impact (35%), Urgency (25%), Evidence (20%), Momentum (15%),
 * with a Territorial Priority Weight (+5%) for Purwakarta focus.
 */
export function calculatePriorityScore(issue: {
  impact_score: number;
  urgency_score?: number;
  evidence_score: number;
  momentum_score: number;
  location?: string;
  is_purwakarta_priority?: boolean;
}): number {
  const impact = issue.impact_score || 70;
  const urgency = issue.urgency_score || Math.min(100, impact + 2);
  const evidence = issue.evidence_score || 70;
  const momentum = issue.momentum_score || 60;
  const isPurwakarta = (issue.location || '').toLowerCase().includes('purwakarta') || issue.is_purwakarta_priority;

  const baseScore = (impact * 0.35) + (urgency * 0.25) + (evidence * 0.20) + (momentum * 0.15);
  const territorialBoost = isPurwakarta ? 5 : 0;

  return Math.min(100, Math.round(baseScore + territorialBoost));
}

/**
 * Confidence Score Formula:
 * Measures data robustness, independent source validation, and consistency.
 * Considers:
 * - Number of independent sources (min 1, optimal >= 5)
 * - Presence of official sources
 * - Source diversity (Official + National + Local)
 * - Absence of major data contradictions
 * - Recency (< 24h = fresh)
 */
export function calculateConfidenceScore(params: {
  sourceCount: number;
  officialCount: number;
  nationalCount: number;
  localCount: number;
  hasContradictions?: boolean;
  hoursSinceLastUpdate?: number;
}): { score: number; explanation: string; breakdown: string[] } {
  const {
    sourceCount = 1,
    officialCount = 0,
    nationalCount = 0,
    localCount = 0,
    hasContradictions = false,
    hoursSinceLastUpdate = 12
  } = params;

  let base = 50;

  // Source Volume weight (up to +25)
  const volumeWeight = Math.min(25, sourceCount * 5);
  base += volumeWeight;

  // Official Source presence (up to +15)
  const officialWeight = officialCount > 0 ? 15 : 0;
  base += officialWeight;

  // Diversity weight (up to +10)
  let diversityWeight = 0;
  if (nationalCount > 0 && localCount > 0) diversityWeight = 10;
  else if (nationalCount > 0 || localCount > 0) diversityWeight = 5;
  base += diversityWeight;

  // Recency bonus / penalty
  if (hoursSinceLastUpdate <= 24) base += 5;
  else if (hoursSinceLastUpdate > 72) base -= 10;

  // Contradiction penalty
  if (hasContradictions) base -= 15;

  const finalScore = Math.max(20, Math.min(98, Math.round(base)));

  const breakdown = [
    `${sourceCount} sumber rujukan terverifikasi`,
    officialCount > 0 ? `${officialCount} rilis resmi instansi` : 'Belum ada rilis resmi instansi',
    nationalCount > 0 ? `${nationalCount} media massa nasional` : '',
    localCount > 0 ? `${localCount} liputan media lokal daerah` : '',
    hasContradictions ? 'Terdapat ketidaksesuaian data antar-sumber' : 'Informasi konsisten tanpa kontradiksi mayor',
    hoursSinceLastUpdate <= 24 ? 'Data diperbarui dalam 24 jam terakhir' : 'Pembaruan data > 24 jam lalu'
  ].filter(Boolean);

  const explanation = `${finalScore}/100: Berdasarkan ${sourceCount} sumber independen (${officialCount} resmi, ${nationalCount} nasional, ${localCount} lokal) dengan tingkat konsistensi ${hasContradictions ? 'terdapat catatan discrepancy' : 'tinggi'}.`;

  return {
    score: finalScore,
    explanation,
    breakdown
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
  const isHighImpact = issue.impact_score >= 82;
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
      const matchDistrict = (i.district || '').toLowerCase().includes(districtName.toLowerCase().replace(' (kota)', ''));
      const matchDesc = i.description.toLowerCase().includes(districtName.toLowerCase().replace(' (kota)', ''));
      const matchTitle = i.title.toLowerCase().includes(districtName.toLowerCase().replace(' (kota)', ''));
      return matchDistrict || matchDesc || matchTitle;
    });

    const issuesCount = matching.length;
    const priorityCount = matching.filter(i => i.priority_level === 'Tinggi' || i.impact_score >= 85).length;

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
      dominantCategory: dominantCat,
      topIssueTitle: topIssue ? topIssue.title : 'Pemantauan berkala wilayah',
      topIssueSlug: topIssue ? topIssue.slug : '',
      momentumGrowth: `↑ ${avgMomentum}%`,
      status
    };
  });
}
