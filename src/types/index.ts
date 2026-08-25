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
  first_detected_at: string;
  last_updated_at: string;
  sources_count: number;
  is_purwakarta_priority?: boolean;
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
  credibility_score: number; // e.g. 95, 85, 75, 45, 20
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
  is_verified_fact: boolean;
  location_tag: string;
}

export interface ResearchQuestion {
  id: string;
  issue_id: string;
  question: string;
  dimension: 
    | 'Akar Masalah'
    | 'Kelompok Terdampak'
    | 'Respons Pemerintah'
    | 'Kesenjangan Implementasi'
    | 'Kondisi Lapangan'
    | 'Celah Data'
    | 'Dampak Jangka Panjang'
    | 'Alternatif Kebijakan';
  priority: 'Tinggi' | 'Sedang';
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
  status: 'Draft' | 'Final Kajian' | 'Policy Brief';
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
