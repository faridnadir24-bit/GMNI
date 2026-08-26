import { Issue, Claim, Source, Actor, BahanKajianDocument } from '@/types';
import { mockIssues } from '@/data/mockIssues';
import { mockClaims } from '@/data/mockClaims';
import { mockSources } from '@/data/mockSources';
import { mockActors } from '@/data/mockActors';

export interface AIAnalysisResult {
  action: string;
  issueId: string;
  issueTitle: string;
  timestamp: string;
  title: string;
  badge: string;
  content: {
    overview?: string;
    points?: { title: string; desc: string; icon?: string; badge?: string; source_ref?: string }[];
    facts_vs_claims?: { fact: string; claim: string; unverified: string; source_ref?: string };
    discrepancies?: string[];
    missing_data?: string[];
    research_questions?: { dimension: string; question: string; priority: string }[];
    recommendation?: {
      verdict: 'Sangat Layak' | 'Layak' | 'Perlu Pemantauan' | 'Belum Cukup Data';
      score: number;
      reasoning: string[];
      action_items: string[];
    };
    marhaenism?: {
      sosio_nasionalisme: string;
      sosio_demokrasi: string;
      trisakti: string;
      pro_poor_defense: string;
      dialectical_questions: string[];
    };
    kajian_draft?: Partial<BahanKajianDocument>;
  };
}

export function runAIAnalysis(
  issueId: string, 
  actionType: string,
  dynamicIssue?: Issue,
  dynamicSources?: Source[],
  dynamicClaims?: Claim[]
): AIAnalysisResult {
  const issue = dynamicIssue || mockIssues.find(i => i.id === issueId || i.slug === issueId) || mockIssues[0];
  const claims = dynamicClaims && dynamicClaims.length > 0 ? dynamicClaims : mockClaims.filter(c => c.issue_id === issue.id);
  const sources = dynamicSources && dynamicSources.length > 0 ? dynamicSources : mockSources.filter(s => s.issue_id === issue.id);
  const actors = mockActors.filter(a => a.issue_id === issue.id);

  const timestamp = new Date().toISOString();

  switch (actionType) {
    case 'summarize': {
      return {
        action: 'summarize',
        issueId: issue.id,
        issueTitle: issue.title,
        timestamp,
        title: 'Ringkasan Eksekutif & Struktur Fakta',
        badge: 'Fakta Terverifikasi & Ruang Lingkup',
        content: {
          overview: `${issue.summary_ai.what_happened} [Source 01]`,
          points: [
            {
              title: 'Akar Persoalan & Kebijakan',
              desc: `${issue.summary_ai.why_important} [Source 01, Source 02]`,
              badge: 'Konfirmasi Resmi'
            },
            {
              title: 'Masyarakat Rentan Terdampak',
              desc: `Kelompok sasaran yang merasakan dampak langsung: ${issue.summary_ai.who_is_affected.join(', ')}. [Source 01]`,
              badge: 'Kondisi Lapangan'
            },
            {
              title: 'Kekosongan Data & Regulasi',
              desc: issue.summary_ai.unknown_gaps[0] || 'Perlu verifikasi alokasi anggaran dan skema kompensasi formal.',
              badge: 'Celah Data'
            }
          ]
        }
      };
    }

    case 'compare_sources': {
      return {
        action: 'compare_sources',
        issueId: issue.id,
        issueTitle: issue.title,
        timestamp,
        title: 'Komparasi Narasi & Temuan Kontradiksi',
        badge: 'Cross-Source Triangulation',
        content: {
          overview: `Membandingkan ${sources.length} dokumen sumber berita terhadap konsistensi narasi pemerintah, media, dan kesaksian warga.`,
          discrepancies: [
            `Selisih data: Pernyataan regulator mencatat penertiban telah disosialisasikan [Source 01], sementara serikat warga menyatakan tidak ada pemberitahuan kompensasi tertulis [Source 02].`,
            `Status ganti rugi: Belum ada kesepakatan tertulis mengenai relokasi atau skema alih profesi bagi masyarakat terdampak.`
          ],
          points: [
            {
              title: 'Narasi Rilis Resmi Regulator',
              desc: 'Menekankan aspek ketertiban zonasi, kelestarian ekosistem, dan kepatuhan terhadap perda. [Source 01]',
              badge: 'Official Source'
            },
            {
              title: 'Liputan Independen Media Massa',
              desc: 'Menyoroti penurunan pendapatan keluarga pembudidaya/buruh dan minimnya masa transisi. [Source 02]',
              badge: 'National Media'
            },
            {
              title: 'Kesaksian Lapangan Kaum Terdampak',
              desc: 'Menuntut perlindungan mata pencaharian pokok dan keterbukaan akses dialog kebijakan.',
              badge: 'Field Signal'
            }
          ]
        }
      };
    }

    case 'find_missing_data': {
      return {
        action: 'find_missing_data',
        issueId: issue.id,
        issueTitle: issue.title,
        timestamp,
        title: 'Celah Data & Informasi yang Belum Dirilis',
        badge: 'Data Gap Detection',
        content: {
          overview: 'Identifikasi informasi publik krusial yang belum diungkap secara transparan oleh instansi berwenang.',
          missing_data: issue.summary_ai.unknown_gaps.length > 0 ? issue.summary_ai.unknown_gaps : [
            'Rincian besaran anggaran pemulihan ekonomi dan bantuan sosial.',
            'Kajian Analisis Mengenai Dampak Lingkungan (AMDAL) terkini.',
            'Hasil audit kepatuhan korporasi terhadap serapan tenaga kerja lokal.'
          ],
          points: [
            {
              title: 'Keterbukaan Informasi Publik (KIP)',
              desc: 'GMNI dapat melayangkan surat permohonan data resmi terkait transparansi pelaksanaan regulasi.',
              badge: 'Rekomendasi Hukum'
            }
          ]
        }
      };
    }

    case 'identify_stakeholders': {
      return {
        action: 'identify_stakeholders',
        issueId: issue.id,
        issueTitle: issue.title,
        timestamp,
        title: 'Pemetaan Aktor & Konstelasi Relasi Kuasa',
        badge: 'Power Dynamics & Stakeholders',
        content: {
          overview: 'Membedah posisi kepentingan antara pembuat kebijakan, korporasi/pengelola modal, dan rakyat tertindas.',
          points: issue.summary_ai.key_stakeholders.map(s => ({
            title: s.category,
            desc: `Entitas kunci: ${s.entities.join(', ')}. Menentukan arah regulasi dan pengalokasian sumber daya. [Source 01]`,
            badge: s.category.includes('Pemerintah') ? 'Regulator' : 'Kelompok Kepentingan'
          }))
        }
      };
    }

    case 'generate_research_questions': {
      return {
        action: 'generate_research_questions',
        issueId: issue.id,
        issueTitle: issue.title,
        timestamp,
        title: '8 Dimensi Pertanyaan Kritis Advokasi',
        badge: 'Dialectical Research Framework',
        content: {
          overview: 'Daftar pertanyaan berbasis kerangka dialektika materialistis untuk investigasi lapangan kader GMNI.',
          research_questions: (issue.marhaenism_analysis.critical_questions || []).map((q, idx) => ({
            dimension: `Dimensi 0${idx + 1}: Keadilan Sosial & Regulasi`,
            question: `${q} [Source 01]`,
            priority: idx === 0 ? 'Tinggi' : 'Sedang'
          }))
        }
      };
    }

    case 'recommend_research': {
      return {
        action: 'recommend_research',
        issueId: issue.id,
        issueTitle: issue.title,
        timestamp,
        title: 'Evaluasi Kelayakan Naskah Kebijakan',
        badge: 'Policy Paper Feasibility',
        content: {
          recommendation: {
            verdict: issue.research_recommendation.verdict,
            score: issue.research_recommendation.score,
            reasoning: [
              `Dampak kerentanan sosial (Impact Score: ${issue.impact_score}/100) memerlukan advokasi afirmatif.`,
              `Ketersediaan rujukan terverifikasi (Evidence Score: ${issue.evidence_score}/100) mencukupi untuk perumusan naskah akademik.`,
              `Tingkat keyakinan data (Confidence: ${issue.confidence_score || 80}/100) meminimalisasi risiko bias informasi.`
            ],
            action_items: [
              'Bentuk tim perumus naskah kajian di bawah Bidang Sosial Politik GMNI Wastukancana.',
              'Lakukan Focus Group Discussion (FGD) bersama perwakilan kelompok terdampak.',
              'Serahkan Naskah Rekomendasi Kebijakan resmi kepada DPRD Kabupaten Purwakarta.'
            ]
          }
        }
      };
    }

    case 'marhaenism_framework': {
      return {
        action: 'marhaenism_framework',
        issueId: issue.id,
        issueTitle: issue.title,
        timestamp,
        title: 'Uji Kerangka Ideologi Marhaenisme',
        badge: 'Sosio-Nasionalisme & Sosio-Demokrasi',
        content: {
          marhaenism: {
            sosio_nasionalisme: `${issue.marhaenism_analysis.sosio_nasionalisme} [Source 01]`,
            sosio_demokrasi: `${issue.marhaenism_analysis.sosio_demokrasi} [Source 01, Source 02]`,
            trisakti: issue.marhaenism_analysis.trisakti_perspective,
            pro_poor_defense: issue.marhaenism_analysis.pro_poor_advocacy_notes,
            dialectical_questions: issue.marhaenism_analysis.critical_questions
          }
        }
      };
    }

    default:
      return {
        action: 'default',
        issueId: issue.id,
        issueTitle: issue.title,
        timestamp,
        title: 'Analisis Kebijakan Isu',
        badge: 'GMNI Intelligence',
        content: { overview: issue.description }
      };
  }
}
