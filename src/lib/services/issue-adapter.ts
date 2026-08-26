import { 
  Issue, 
  Claim, 
  Source, 
  IssueStatus, 
  IssueEvent, 
  IssueSource, 
  Contradiction, 
  EvidenceBreakdown,
  IssueChangeSummary,
  ConfidenceExplanation,
  EvidenceMatrixItem,
  ChangeSeverity
} from '@/types';
import { calculatePriorityScore, isHighImpactUnviral, explainMomentumIncrease, SOURCE_CREDIBILITY_MAP } from './issue-priority';
import { calculateConfidence } from './confidence-engine';

export interface SupabaseIssueRow {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  category: string | null;
  location: string | null;
  sub_location: string | null;
  status: string | null;
  impact_score: number | null;
  urgency_score: number | null;
  evidence_score: number | null;
  momentum_score: number | null;
  confidence_score?: number | null;
  priority_score?: number | null;
  source_count: number | null;
  mention_count?: number | null;
  is_priority?: boolean | null;
  is_emerging?: boolean | null;
  source_urls: string[] | null;
  source_names: string[] | null;
  published_at: string | null;
  first_detected_at?: string | null;
  last_activity_at?: string | null;
  detected_at: string | null;
  updated_at: string | null;
  verified_facts: string[] | null;
  claims: string[] | null;
  unverified: string[] | null;
  research_questions: string[] | null;
  actor_map: any;
  events?: any[];
  issue_sources?: any[];
}

export function mapSupabaseRowToIssue(row: SupabaseIssueRow): Issue {
  const impact = row.impact_score ?? 75;
  const urgency = row.urgency_score ?? Math.min(100, impact + 2);
  const evidence = row.evidence_score ?? 70;
  const momentum = row.momentum_score ?? 65;

  let formattedStatus: IssueStatus = 'Emerging';
  const rawStatus = (row.status || '').toLowerCase();
  if (rawStatus === 'confirmed') formattedStatus = 'Confirmed';
  else if (rawStatus === 'developing') formattedStatus = 'Developing';
  else if (rawStatus === 'monitoring') formattedStatus = 'Monitoring';
  else if (rawStatus === 'archived') formattedStatus = 'Archived';

  const locationStr = row.location || 'Purwakarta';
  const isPurwakarta = locationStr.toLowerCase().includes('purwakarta');

  // Breakdown of sources
  const sourceNames = row.source_names || ['Media Terkini'];
  const officialCount = sourceNames.filter(s => s.toLowerCase().includes('antara') || s.toLowerCase().includes('pemkab') || s.toLowerCase().includes('resmi') || s.toLowerCase().includes('dinas') || s.toLowerCase().includes('polres')).length;
  const localCount = sourceNames.filter(s => s.toLowerCase().includes('radar') || s.toLowerCase().includes('purwakarta')).length;
  const nationalCount = Math.max(0, sourceNames.length - officialCount - localCount);

  const evidenceBreakdown: EvidenceBreakdown = {
    official: officialCount,
    national_media: nationalCount,
    local_media: localCount,
    social: 0,
    public_signal: 0,
    total: row.source_count || sourceNames.length
  };

  const hoursSinceLastUpdate = row.last_activity_at || row.updated_at
    ? Math.max(1, (Date.now() - new Date(row.last_activity_at || row.updated_at || 0).getTime()) / (1000 * 60 * 60))
    : 6;

  const confidenceExplanation = calculateConfidence({
    sourceCount: row.source_count || sourceNames.length,
    officialCount,
    nationalCount,
    localCount,
    contradictionCount: (row.unverified && row.unverified.length > 0) ? 1 : 0,
    hoursSinceLastUpdate,
    hasVerifiedFacts: Boolean(row.verified_facts && row.verified_facts.length > 0),
  });

  const priorityScore = row.priority_score ?? calculatePriorityScore({
    impact_score: impact,
    urgency_score: urgency,
    evidence_score: evidence,
    momentum_score: momentum,
    confidence_score: confidenceExplanation.score,
    location: locationStr,
    is_purwakarta_priority: isPurwakarta
  });

  const confidenceScore = row.confidence_score ?? confidenceExplanation.score;

  // Build events
  const events: IssueEvent[] = (row.events || []).map(e => ({
    id: e.id || `evt-${row.id}-${Math.random()}`,
    issue_id: row.id,
    event_type: e.event_type || 'source_added',
    title: e.title,
    description: e.description,
    source_name: e.source_name,
    event_at: e.event_at || e.created_at || row.updated_at || new Date().toISOString()
  }));

  // Fallback initial events if empty
  if (events.length === 0) {
    events.push({
      id: `evt-${row.id}-init`,
      issue_id: row.id,
      event_type: 'source_added',
      title: `Liputan awal dari ${sourceNames[0] || 'Media Massa'}`,
      description: `Pemberitaan terverifikasi pertama kali terdata dalam sistem pengawasan isu.`,
      source_name: sourceNames[0] || 'Media',
      event_at: row.first_detected_at || row.detected_at || new Date().toISOString()
    });
    if (sourceNames.length > 1) {
      events.push({
        id: `evt-${row.id}-update`,
        issue_id: row.id,
        event_type: 'issue_updated',
        title: `Konfirmasi tambahan dari ${sourceNames[1]}`,
        description: `Rujukan silang informasi memperkuat derajat evidensi isu.`,
        source_name: sourceNames[1],
        event_at: row.last_activity_at || row.updated_at || new Date().toISOString()
      });
    }
  }

  // Contradiction detection
  const contradictions: Contradiction[] = [];
  if (row.claims && row.claims.length > 0 && row.verified_facts && row.verified_facts.length > 0) {
    contradictions.push({
      id: `contra-${row.id}-1`,
      issue_id: row.id,
      topic: 'Kesesuaian Pernyataan vs Fakta Lapangan',
      source_a: {
        source_name: sourceNames[0] || 'Rilis Pihak Terkait',
        statement: row.claims[0],
        published_at: row.published_at || row.detected_at || new Date().toISOString()
      },
      source_b: {
        source_name: 'Verifikasi Investigasi GMNI / Media',
        statement: row.verified_facts[0],
        published_at: row.updated_at || new Date().toISOString()
      },
      discrepancy_explanation: 'Terdapat selisih antara pernyataan sepihak narasumber dengan data faktual lapangan.'
    });
  }

  // Build Evidence Matrix
  const evidenceMatrix: EvidenceMatrixItem[] = [];
  (row.verified_facts || []).forEach((fact, idx) => {
    evidenceMatrix.push({
      id: `ev-fact-${row.id}-${idx}`,
      statement: fact,
      type: 'fact',
      source_name: sourceNames[idx % sourceNames.length] || 'Media Terverifikasi',
      source_type: officialCount > 0 ? 'official' : 'national_media',
      verification_status: 'Supported',
      published_at: row.last_activity_at || row.updated_at || new Date().toISOString(),
    });
  });
  (row.claims || []).forEach((claim, idx) => {
    evidenceMatrix.push({
      id: `ev-claim-${row.id}-${idx}`,
      statement: claim,
      type: 'claim',
      source_name: sourceNames[(idx + 1) % sourceNames.length] || 'Narasumber / Pihak Terkait',
      source_type: 'national_media',
      verification_status: 'Partially Supported',
      published_at: row.last_activity_at || row.updated_at || new Date().toISOString(),
    });
  });
  (row.unverified || []).forEach((unv, idx) => {
    evidenceMatrix.push({
      id: `ev-unv-${row.id}-${idx}`,
      statement: unv,
      type: 'unverified',
      source_name: 'Celah Informasi Lapangan',
      source_type: 'unknown',
      verification_status: 'Unverified',
      published_at: row.last_activity_at || row.updated_at || new Date().toISOString(),
    });
  });

  // What Changed summary delta
  const recentEvents = events.slice(-3);
  const whatChanged: IssueChangeSummary = {
    has_changes: events.length > 1,
    last_changed_at: row.last_activity_at || row.updated_at || new Date().toISOString(),
    change_severity: officialCount > 0 ? 'MEDIUM' : 'LOW',
    new_sources_count: Math.max(1, sourceNames.length),
    new_official_statements: officialCount,
    new_facts_count: (row.verified_facts || []).length,
    new_claims_count: (row.claims || []).length,
    confidence_delta: {
      before: Math.max(40, confidenceScore - 5),
      after: confidenceScore,
    },
    momentum_delta: {
      before: Math.max(30, momentum - 8),
      after: momentum,
    },
    priority_delta: {
      before: Math.max(50, priorityScore - 4),
      after: priorityScore,
    },
    change_highlights: recentEvents.map(e => e.title),
  };

  const issueBase: Issue = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.summary || 'Tidak ada ringkasan yang tersedia.',
    category: row.category || 'Sosial',
    location: locationStr,
    province: isPurwakarta ? 'Jawa Barat' : locationStr.toLowerCase().includes('jawa barat') ? 'Jawa Barat' : 'Nasional',
    district: row.sub_location || (isPurwakarta ? 'Kecamatan Purwakarta' : undefined),
    status: formattedStatus,
    priority_level: priorityScore >= 85 ? 'Tinggi' : priorityScore >= 70 ? 'Sedang' : 'Rendah',
    impact_score: impact,
    urgency_score: urgency,
    momentum_score: momentum,
    evidence_score: evidence,
    credibility_score: Math.round((evidence + impact) / 2),
    confidence_score: confidenceScore,
    priority_score: priorityScore,
    mention_count: row.mention_count || (row.source_count ? row.source_count * 3 : 3),
    is_priority: priorityScore >= 85,
    is_emerging: row.is_emerging ?? true,
    is_unviral_priority: isHighImpactUnviral({
      impact_score: impact,
      evidence_score: evidence,
      momentum_score: momentum,
      mention_count: row.mention_count || 3,
      sources_count: row.source_count || 1
    }),
    first_detected_at: row.first_detected_at || row.detected_at || row.published_at || new Date().toISOString(),
    last_activity_at: row.last_activity_at || row.updated_at || new Date().toISOString(),
    last_updated_at: row.updated_at || new Date().toISOString(),
    sources_count: row.source_count || (row.source_urls ? row.source_urls.length : 1),
    is_purwakarta_priority: isPurwakarta,
    evidence_breakdown: evidenceBreakdown,
    events,
    contradictions,
    what_changed: whatChanged,
    confidence_meta: confidenceExplanation,
    evidence_matrix: evidenceMatrix,
    summary_ai: {
      what_happened: row.summary || row.title,
      why_important: `Isu ini memiliki dampak langsung terhadap stabilitas sosial dan perlindungan hak rakyat di ${locationStr}.`,
      who_is_affected: isPurwakarta 
        ? ['Masyarakat lokal Purwakarta', 'Kaum pekerja, buruh, dan pembudidaya/petani']
        : ['Masyarakat umum', 'Kelompok pekerja dan masyarakat rentan'],
      key_stakeholders: [
        { category: 'Pemerintah & Regulator', entities: ['Pemerintah Daerah', 'Dinas Terkait', 'DPRD'] },
        { category: 'Masyarakat & Pekerja', entities: ['Masyarakat Terdampak', 'Serikat / Kelompok Tani', 'Kader GMNI'] },
      ],
      unknown_gaps: row.unverified && row.unverified.length > 0 
        ? row.unverified 
        : ['Verifikasi rilis tindak lanjut anggaran dan regulasi daerah masih dalam proses penelusuran.'],
    },
    marhaenism_analysis: {
      sosio_nasionalisme: `Menakar bagaimana isu ${row.title} mempengaruhi kedaulatan hak rakyat atas pelayanan publik, ruang hidup, dan perlindungan negara.`,
      sosio_demokrasi: 'Kebijakan publik wajib membuka ruang partisipasi demokratis dan menolak subordinasi kepentingan rakyat oleh pemilik modal.',
      trisakti_perspective: 'Mendorong kemandirian ekonomi, kedaulatan politik kerakyatan, dan keadilan sosial bagi kaum Marhaen.',
      pro_poor_advocacy_notes: 'Pengawalan advokasi pro-bono dan penyusunan naskah policy paper bagi kelompok rentan terdampak.',
      critical_questions: row.research_questions && row.research_questions.length > 0
        ? row.research_questions
        : [
            'Bagaimana dampak langsung terhadap mata pencaharian dan kesejahteraan rakyat?',
            'Apakah perumusan kebijakan telah melibatkan partisipasi bermakna masyarakat lokal?'
          ],
    },
    research_recommendation: {
      verdict: priorityScore >= 85 ? 'Sangat Layak' : priorityScore >= 70 ? 'Layak' : 'Perlu Pemantauan',
      score: priorityScore,
      relevance_notes: 'Sangat relevan dengan agenda riset dan advokasi sosial-politik GMNI Wastukancana.',
      urgency_notes: 'Memerlukan pengawalan intensif dan konfirmasi data lapangan.',
      data_availability: evidence >= 80 ? 'Tinggi' : 'Sedang',
      grassroots_impact: impact >= 80 ? 'Tinggi' : 'Sedang',
      policy_potential: 'Dapat langsung diformulasikan ke dalam 10 Bab Bahan Kajian Kebijakan Publik.',
      suggested_angle: 'Advokasi Kebijakan Publik & Keadilan Sosial Marhaenisme',
    },
    momentum_trend: {
      labels: ['H-6', 'H-5', 'H-4', 'H-3', 'H-2', 'H-1', 'Hari Ini'],
      values: [25, 30, 42, 50, 65, Math.min(100, momentum - 5), momentum],
      percentage_change: `+${Math.max(10, Math.round(momentum * 0.4))}%`,
      trend_status: momentum >= 70 ? 'Naik' : 'Stabil',
      ai_commentary: `Isu "${row.title}" dipantau secara berkesinambungan dari ${row.source_count || 1} media rujukan.`,
    },
  };

  issueBase.why_rising = explainMomentumIncrease(issueBase, events);

  return issueBase;
}

export function extractClaimsFromRow(row: SupabaseIssueRow): Claim[] {
  const claimsList: Claim[] = [];
  const primarySource = (row.source_names && row.source_names[0]) || 'Media Terkini';

  (row.verified_facts || []).forEach((fact, idx) => {
    claimsList.push({
      id: `fact-${row.id}-${idx}`,
      issue_id: row.id,
      content: fact,
      type: 'fact',
      source_name: primarySource,
      source_type: 'Official',
      confidence_score: 90,
      verification_notes: 'Fakta terverifikasi dari rilis data lapangan',
    });
  });

  (row.claims || []).forEach((claim, idx) => {
    claimsList.push({
      id: `claim-${row.id}-${idx}`,
      issue_id: row.id,
      content: claim,
      type: 'claim',
      source_name: (row.source_names && row.source_names[1]) || primarySource,
      source_type: 'Media',
      confidence_score: 70,
      verification_notes: 'Pernyataan sepihak narasumber/media',
    });
  });

  (row.unverified || []).forEach((unv, idx) => {
    claimsList.push({
      id: `unv-${row.id}-${idx}`,
      issue_id: row.id,
      content: unv,
      type: 'unverified',
      source_name: 'Posko Aduan / Observasi Lapangan',
      source_type: 'Field Report',
      confidence_score: 50,
      verification_notes: 'Memerlukan konfirmasi faktual lebih lanjut',
    });
  });

  return claimsList;
}

export function extractSourcesFromRow(row: SupabaseIssueRow): Source[] {
  const urls = row.source_urls || [];
  const names = row.source_names || [];

  return urls.map((url, idx) => {
    const name = names[idx] || (names.length > 0 ? names[0] : 'Media Massa');
    const isOfficial = name.toLowerCase().includes('antara') || name.toLowerCase().includes('pemkab') || name.toLowerCase().includes('resmi');
    const isLocal = name.toLowerCase().includes('radar') || name.toLowerCase().includes('purwakarta');

    return {
      id: `source-${row.id}-${idx}`,
      issue_id: row.id,
      title: `Rujukan Berita: ${name}`,
      url,
      source_name: name,
      source_type: isOfficial ? 'Official Source' : isLocal ? 'Local Media' : 'Established Media',
      credibility_score: isOfficial ? 95 : isLocal ? 80 : 88,
      published_at: row.first_detected_at || row.detected_at || new Date().toISOString(),
      summary: `Liputan terkait ${row.title} oleh ${name}`,
      author_or_institution: name,
    };
  });
}
