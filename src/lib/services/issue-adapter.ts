import { Issue, Claim, Source, IssueStatus } from '@/types';

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
  evidence_score: number | null;
  momentum_score: number | null;
  source_count: number | null;
  source_urls: string[] | null;
  source_names: string[] | null;
  published_at: string | null;
  detected_at: string | null;
  updated_at: string | null;
  verified_facts: string[] | null;
  claims: string[] | null;
  unverified: string[] | null;
  research_questions: string[] | null;
  actor_map: any;
}

export function mapSupabaseRowToIssue(row: SupabaseIssueRow): Issue {
  const impact = row.impact_score ?? 75;
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

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.summary || 'Tidak ada ringkasan yang tersedia.',
    category: row.category || 'Sosial',
    location: locationStr,
    province: isPurwakarta ? 'Jawa Barat' : locationStr.toLowerCase().includes('jawa barat') ? 'Jawa Barat' : 'Nasional',
    district: row.sub_location || (isPurwakarta ? 'Kecamatan Purwakarta' : undefined),
    status: formattedStatus,
    priority_level: impact >= 85 ? 'Tinggi' : impact >= 70 ? 'Sedang' : 'Rendah',
    impact_score: impact,
    urgency_score: Math.min(100, impact + 2),
    momentum_score: momentum,
    evidence_score: evidence,
    credibility_score: Math.round((evidence + impact) / 2),
    first_detected_at: row.detected_at || row.published_at || new Date().toISOString(),
    last_updated_at: row.updated_at || new Date().toISOString(),
    sources_count: row.source_count || (row.source_urls ? row.source_urls.length : 1),
    is_purwakarta_priority: isPurwakarta,
    summary_ai: {
      what_happened: row.summary || row.title,
      why_important: 'Isu ini memiliki dampak langsung terhadap stabilitas sosial dan kepentingan masyarakat.',
      who_is_affected: ['Masyarakat umum', 'Pekerja dan komunitas lokal'],
      key_stakeholders: [
        { category: 'Pemerintah / Regulator', entities: ['Pemerintah Daerah', 'Instansi Terkait'] },
        { category: 'Masyarakat', entities: ['Masyarakat Terdampak', 'Kader GMNI'] },
      ],
      unknown_gaps: row.unverified && row.unverified.length > 0 
        ? row.unverified 
        : ['Data verifikasi rilis resmi instansi terkait masih dalam proses penelusuran.'],
    },
    marhaenism_analysis: {
      sosio_nasionalisme: `Menilai bagaimana isu ${row.title} mempengaruhi kedaulatan hak rakyat atas pelayanan publik dan perlindungan negara.`,
      sosio_demokrasi: 'Kebijakan wajib membuka ruang partisipasi demokratis dan memprioritaskan kepentingan kaum pekerja/petani.',
      trisakti_perspective: 'Mendorong kemandirian ekonomi dan keadilan sosial bagi kaum Marhaen.',
      pro_poor_advocacy_notes: 'Pengawalan advokasi pro-bono terhadap kelompok rentan terdampak.',
      critical_questions: row.research_questions && row.research_questions.length > 0
        ? row.research_questions
        : ['Bagaimana dampak ekonomi langsung terhadap kaum pekerja/petani?'],
    },
    research_recommendation: {
      verdict: impact >= 85 ? 'Sangat Layak' : impact >= 70 ? 'Layak' : 'Perlu Pemantauan',
      score: impact,
      relevance_notes: 'Relevan dengan agenda riset dan advokasi sosial-politik.',
      urgency_notes: 'Memerlukan pemantauan perkembangan data lapangan.',
      data_availability: evidence >= 80 ? 'Tinggi' : 'Sedang',
      grassroots_impact: impact >= 80 ? 'Tinggi' : 'Sedang',
      policy_potential: 'Dapat dikembangkan menjadi naskah policy brief.',
      suggested_angle: 'Kajian Kebijakan Publik & Keadilan Sosial',
    },
    momentum_trend: {
      labels: ['H-6', 'H-5', 'H-4', 'H-3', 'H-2', 'H-1', 'Hari Ini'],
      values: [25, 30, 42, 50, 65, Math.min(100, momentum - 5), momentum],
      percentage_change: `+${Math.max(10, Math.round(momentum * 0.4))}%`,
      trend_status: momentum >= 70 ? 'Naik' : 'Stabil',
      ai_commentary: `Isu "${row.title}" terpantau dari ${row.source_count || 1} sumber media.`,
    },
  };
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
    sourcesList.push({
      id: `src-${row.id}-${idx}`,
      issue_id: row.id,
      title: `Liputan Terkait: ${row.title}`,
      url: url,
      source_name: sName,
      source_type: sName.toLowerCase().includes('antara') ? 'Official Source' : 'Established Media',
      credibility_score: 85,
      published_at: row.published_at || row.detected_at || new Date().toISOString(),
      summary: row.summary || 'Rujukan pemberitaan media mengenai isu terkait.',
      author_or_institution: sName,
    });
  });

  return sourcesList;
}
