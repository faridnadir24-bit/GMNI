export type RegionScope = 'all' | 'purwakarta' | 'jabar' | 'nasional';

export type IssueStatus = 'Emerging' | 'Monitoring' | 'Developing' | 'Confirmed' | 'Archived';

export type PriorityLevel = 'Tinggi' | 'Sedang' | 'Rendah';

export type ClaimType = 'fact' | 'claim' | 'unverified';

export type SourceType = 
  | 'Official Source' 
  | 'Established Media' 
  | 'Local Media' 
  | 'Social Media' 
  | 'Public Signal';

export type NormalizedSourceType = 
  | 'official' 
  | 'national_media' 
  | 'local_media' 
  | 'social' 
  | 'public_signal' 
  | 'unknown';

export type UserRole = 'admin' | 'researcher' | 'member' | 'public';

export interface IssueAISummary {
  what_happened: string;
  why_important: string;
  who_is_affected: string[];
  key_stakeholders: {
    category: string;
    entities: string[];
  }[];
  unknown_gaps: string[];
  data_discrepancies?: string[];
}

export interface MarhaenismAnalysis {
  sosio_nasionalisme: string;
  sosio_demokrasi: string;
  trisakti_perspective: string;
  pro_poor_advocacy_notes: string;
  critical_questions: string[];
}

export interface ResearchRecommendation {
  verdict: 'Sangat Layak' | 'Layak' | 'Perlu Pemantauan' | 'Belum Cukup Data';
  score: number;
  relevance_notes: string;
  urgency_notes: string;
  data_availability: string;
  grassroots_impact: string;
  policy_potential: string;
  suggested_angle: string;
}

export interface EvidenceBreakdown {
  official: number;
  national_media: number;
  local_media: number;
  social: number;
  public_signal: number;
  total: number;
}

export interface IssueEvent {
  id: string;
  issue_id: string;
  event_type: 
    | 'source_added' 
    | 'official_statement' 
    | 'public_signal' 
    | 'issue_updated' 
    | 'status_changed' 
    | 'score_changed' 
    | 'claim_added' 
    | 'fact_added';
  title: string;
  description?: string;
  source_id?: string;
  source_name?: string;
  event_at: string;
  created_at?: string;
}

export interface Article {
  id: string;
  url: string;
  canonical_url?: string;
  title: string;
  summary: string;
  content: string;
  source_name: string;
  source_type: NormalizedSourceType;
  published_at: string;
  fetched_at: string;
  hash?: string;
  language?: string;
  category?: string;
  location?: string;
  sub_location?: string | null;
  relevance_score?: number;
  processed?: boolean;
  issue_id?: string | null;
  issue_title?: string;
  issue_slug?: string;
}

export interface IssueSource {
  id: string;
  issue_id: string;
  article_id?: string | null;
  source_url: string;
  source_name: string;
  source_type: NormalizedSourceType;
  published_at: string;
  added_at: string;
  relevance_score: number;
  is_primary?: boolean;
  credibility_score: number;
}

export interface Contradiction {
  id: string;
  issue_id: string;
  topic: string;
  source_a: {
    source_name: string;
    statement: string;
    published_at: string;
  };
  source_b: {
    source_name: string;
    statement: string;
    published_at: string;
  };
  discrepancy_explanation: string;
}

export type ChangeSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ChangeType = 
  | 'NEW_FACT' 
  | 'NEW_CLAIM' 
  | 'NEW_OFFICIAL_STATEMENT' 
  | 'NEW_ACTOR' 
  | 'NEW_LOCATION' 
  | 'NEW_EVENT' 
  | 'NEW_POLICY_RESPONSE' 
  | 'NEW_DATA' 
  | 'CONTRADICTION' 
  | 'STATUS_CHANGE' 
  | 'MOMENTUM_CHANGE';

export interface IssueChangeSummary {
  has_changes: boolean;
  last_changed_at: string;
  change_severity: ChangeSeverity;
  new_sources_count: number;
  new_official_statements: number;
  new_facts_count: number;
  new_claims_count: number;
  confidence_delta?: { before: number; after: number };
  momentum_delta?: { before: number; after: number };
  priority_delta?: { before: number; after: number };
  change_highlights: string[];
}

export interface ConfidenceExplanation {
  score: number;
  level: 'Tinggi' | 'Sedang' | 'Awal';
  explanation: string;
  factors: { label: string; value: string; positive: boolean }[];
  source_diversity_count: number;
  official_sources_count: number;
  independent_sources_count: number;
  contradictions_count: number;
  freshness_status: 'Sangat Baru' | 'Terbaru' | 'Perlu Pembaruan' | 'Stale';
}

export interface EvidenceMatrixItem {
  id: string;
  statement: string;
  type: 'fact' | 'claim' | 'unverified';
  source_name: string;
  source_type: NormalizedSourceType;
  verification_status: 'Supported' | 'Partially Supported' | 'Conflicting' | 'Unverified';
  published_at: string;
}

export interface RadarKecamatan {
  name: string;
  issuesCount: number;
  priorityCount: number;
  newLast24h?: number;
  dominantCategory: string;
  topIssueTitle: string;
  topIssueSlug: string;
  momentumGrowth: string;
  latestUpdate?: string;
  status: 'Kritis' | 'Tinggi' | 'Sedang' | 'Stabil';
}

export interface Issue {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  location: string;
  province: string;
  district?: string;
  status: IssueStatus;
  priority_level: PriorityLevel;
  impact_score: number; // 0-100
  urgency_score: number; // 0-100
  momentum_score: number; // 0-100
  evidence_score: number; // 0-100
  credibility_score: number; // 0-100
  confidence_score?: number; // 0-100
  priority_score?: number; // 0-100
  mention_count?: number;
  is_priority?: boolean;
  is_emerging?: boolean;
  is_unviral_priority?: boolean; // Belum Viral · Dampak Tinggi
  first_detected_at: string;
  last_activity_at?: string;
  last_updated_at: string;
  sources_count: number;
  is_purwakarta_priority?: boolean;
  evidence_breakdown?: EvidenceBreakdown;
  events?: IssueEvent[];
  sources_list?: IssueSource[];
  contradictions?: Contradiction[];
  why_rising?: {
    percentage_24h: string;
    factors: string[];
    has_sufficient_data: boolean;
  };
  summary_ai: IssueAISummary;
  marhaenism_analysis: MarhaenismAnalysis;
  research_recommendation: ResearchRecommendation;
  momentum_trend: {
    labels: string[];
    values: number[];
    percentage_change: string;
    trend_status: 'Naik' | 'Stabil' | 'Menurun';
    ai_commentary: string;
  };
  what_changed?: IssueChangeSummary;
  confidence_meta?: ConfidenceExplanation;
  evidence_matrix?: EvidenceMatrixItem[];
}

export interface Claim {
  id: string;
  issue_id: string;
  content: string;
  type: ClaimType;
  source_name: string;
  source_type: 'Official' | 'Media' | 'Social' | 'Field Report';
  source_url?: string;
  verification_notes?: string;
  confidence_score: number; // 0-100
}

export interface Source {
  id: string;
  issue_id: string;
  title: string;
  url: string;
  source_name: string;
  source_type: SourceType;
  credibility_score: number;
  published_at: string;
  summary: string;
  author_or_institution: string;
}

export interface Actor {
  id: string;
  issue_id: string;
  name: string;
  organization: string;
  role: string;
  stance: 'Proaktif' | 'Reaktif' | 'Kritis' | 'Netral' | 'Terdampak';
  statement: string;
  influence_level: 'Tinggi' | 'Sedang' | 'Rendah';
}

export interface TimelineEvent {
  id: string;
  issue_id: string;
  date: string;
  title: string;
  description: string;
  event_type: 'discovery' | 'official_statement' | 'media_surge' | 'public_protest' | 'policy_action';
  source_ref: string;
}

export interface Signal {
  id: string;
  issue_id?: string;
  platform: 'Instagram' | 'TikTok' | 'X' | 'YouTube' | 'Forum Warga';
  content: string;
  timestamp: string;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  sentiment: 'Positif' | 'Netral' | 'Kritis / Resah' | 'Marah / Protes';
  growth_rate: string;
  keywords: string[];
  location_tag: string;
  is_verified_fact?: boolean;
}

export interface BahanKajianDocument {
  id: string;
  issue_id: string;
  issue_title: string;
  title: string;
  subtitle: string;
  author: string;
  komisariat: string;
  date_created: string;
  status: 'Draft' | 'Final' | 'Disahkan' | 'Policy Brief' | 'Final Kajian';
  sections: {
    latar_belakang: string;
    rumusan_masalah: string[];
    data_dan_fakta: string[];
    kronologi_singkat: string[];
    pihak_terkait: { nama: string; peran: string; posisi: string }[];
    analisis_sosial_politik: string;
    perspektif_marhaenisme: string;
    dampak_masyarakat: string;
    alternatif_kebijakan: string[];
    rekomendasi_advokasi: string[];
    daftar_pustaka: { title: string; source: string; year: string }[];
  };
}
