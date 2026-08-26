import { Issue, Claim, Source, IssueStatus, IssueEvent, IssueSource, Contradiction, EvidenceBreakdown } from '@/types';
import { calculatePriorityScore, calculateConfidenceScore, isHighImpactUnviral, explainMomentumIncrease, SOURCE_CREDIBILITY_MAP } from './issue-priority';

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
  const officialCount = sourceNames.filter(s => s.toLowerCase().includes('antara') || s.toLowerCase().includes('pemkab') || s.toLowerCase().includes('resmi')).length;
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

  const confidenceCalc = calculateConfidenceScore({
    sourceCount: row.source_count || sourceNames.length,
    officialCount,
    nationalCount,
    localCount,
    hasContradictions: Boolean(row.unverified && row.unverified.length > 0),
    hoursSinceLastUpdate: 6
  });

  const priorityScore = row.priority_score ?? calculatePriorityScore({
    impact_score: impact,
    urgency_score: urgency,
    evidence_score: evidence,
    momentum_score: momentum,
    location: locationStr,
    is_purwakarta_priority: isPurwakarta
  });

  const confidenceScore = row.confidence_score ?? confidenceCalc.score;

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
      confidence_score: 95,
      verification_notes: 'Terkonfirmasi melalui rilis berita terverifikasi.',
    });
  });

  (row.claims || []).forEach((claim, idx) => {
    claimsList.push({
      id: `claim-${row.id}-${idx}`,
      issue_id: row.id,
      content: claim,
      type: 'claim',
      source_name: primarySource,
      source_type: 'Media',
      confidence_score: 65,
      verification_notes: 'Pernyataan sepihak narasumber/korporasi, butuh konfirmasi lanjutan.',
    });
  });

  (row.unverified || []).forEach((unver, idx) => {
    claimsList.push({
      id: `unver-${row.id}-${idx}`,
      issue_id: row.id,
      content: unver,
      type: 'unverified',
      source_name: primarySource,
      source_type: 'Social',
      confidence_score: 35,
      verification_notes: 'Informasi awal belum terverifikasi secara formal.',
    });
  });

  return claimsList;
}

export function extractSourcesFromRow(row: SupabaseIssueRow): Source[] {
  const sourcesList: Source[] = [];
  const urls = row.source_urls || [];
  const names = row.source_names || [];

  urls.forEach((url, idx) => {
    const sName = names[idx] || `Media Rujukan ${idx + 1}`;
    const sType = sName.toLowerCase().includes('antara') || sName.toLowerCase().includes('pemkab') ? 'Official Source' : 'Established Media';
    sourcesList.push({
      id: `src-${row.id}-${idx}`,
      issue_id: row.id,
      title: `Liputan Terkait: ${row.title}`,
      url: url,
      source_name: sName,
      source_type: sType,
      credibility_score: sType === 'Official Source' ? 95 : 85,
      published_at: row.published_at || row.detected_at || new Date().toISOString(),
      summary: row.summary || 'Rujukan pemberitaan media mengenai isu terkait.',
      author_or_institution: sName,
    });
  });

  return sourcesList;
}
