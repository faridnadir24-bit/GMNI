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
    points?: { title: string; desc: string; icon?: string; badge?: string }[];
    facts_vs_claims?: { fact: string; claim: string; unverified: string };
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

export function runAIAnalysis(issueId: string, actionType: string): AIAnalysisResult {
  const issue = mockIssues.find(i => i.id === issueId) || mockIssues[0];
  const claims = mockClaims.filter(c => c.issue_id === issue.id);
  const sources = mockSources.filter(s => s.issue_id === issue.id);
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
          overview: issue.summary_ai.what_happened,
          points: [
            {
              title: 'Mengapa Isu Ini Penting?',
              desc: issue.summary_ai.why_important,
              badge: 'Signifikansi Publik'
            },
            {
              title: 'Kelompok Masyarakat Terdampak Langsung',
              desc: issue.summary_ai.who_is_affected.join('; '),
              badge: 'Masyarakat & Pekerja'
            },
            {
              title: 'Aktor Kunci & Pemangku Kepentingan',
              desc: issue.summary_ai.key_stakeholders.map(k => `${k.category}: ${k.entities.join(', ')}`).join(' | '),
              badge: 'Pemetaan Aktor'
            },
            {
              title: 'Celah Informasi & Hal Belum Diketahui',
              desc: issue.summary_ai.unknown_gaps.join('; ') || 'Perlu verifikasi data pendukung lanjutan.',
              badge: 'Data Gap'
            }
          ],
          discrepancies: issue.summary_ai.data_discrepancies || [
            'Belum ditemukan kontradiksi data signifikan antar rilis resmi.'
          ]
        }
      };
    }

    case 'compare_sources': {
      const verifiedSources = sources.filter(s => s.credibility_score >= 80);
      const mediaSources = sources.filter(s => s.credibility_score < 80);
      return {
        action: 'compare_sources',
        issueId: issue.id,
        issueTitle: issue.title,
        timestamp,
        title: 'Komparasi Silang & Deteksi Kontradiksi Antar Sumber',
        badge: `${sources.length} Sumber Dianalisis`,
        content: {
          overview: `Sistem melakukan komparasi silang antara ${verifiedSources.length} sumber primer/resmi dengan ${mediaSources.length} laporan media dan sinyal publik guna mendeteksi deviasi narasi.`,
          points: [
            {
              title: 'Kesamaan Narasi Pokok',
              desc: 'Seluruh sumber sepakat bahwa eskalasi permasalahan telah mencapai ambang batas yang memerlukan intervensi kebijakan segera dari otoritas berwenang.',
              badge: 'Konsensus (100%)'
            },
            {
              title: 'Perbedaan Sudut Pandang (Framing)',
              desc: 'Sumber resmi otoritas cenderung menekankan aspek "penertiban hukum dan regulasi", sementara perwakilan masyarakat menekankan aspek "kelangsungan hidup ekonomi dan hak nafkah".',
              badge: 'Divergensi Framing'
            },
            {
              title: 'Indeks Keselarasan Data',
              desc: 'Tingkat kesesuaian angka dan kronologi antar dokumen resmi berada pada angka 88/100.',
              badge: 'Internal Reliability'
            }
          ],
          discrepancies: issue.summary_ai.data_discrepancies && issue.summary_ai.data_discrepancies.length > 0
            ? issue.summary_ai.data_discrepancies
            : ['Terdapat selisih estimasi jumlah subjek terdampak antara data paguyuban mandiri dan data sensus dinas terkait.']
        }
      };
    }

    case 'find_missing_data': {
      return {
        action: 'find_missing_data',
        issueId: issue.id,
        issueTitle: issue.title,
        timestamp,
        title: 'Identifikasi Celah Data & Kebutuhan Investigasi Lapangan',
        badge: 'Data Gap Analysis',
        content: {
          overview: 'AI menganalisis titik-titik data yang belum dirilis oleh otoritas publik atau masih bersifat spekulatif di media massa, sebagai panduan investigasi kader di lapangan.',
          missing_data: [
            ...issue.summary_ai.unknown_gaps,
            'Salinan resmi dokumen Analisis Mengenai Dampak Lingkungan (AMDAL) atau audit tata ruang terbaru.',
            'Laporan transparansi alokasi dana kompensasi / CSR bagi masyarakat terdampak langsung.',
            'Data disagregasi jumlah warga lokal berpenghasilan rendah vs pemodal luar daerah.'
          ],
          points: [
            {
              title: 'Tindakan Investigasi Kader GMNI',
              desc: 'Kader bidang SosPol disarankan melakukan verifikasi faktual door-to-door dan wawancara mendalam dengan tokoh masyarakat lokal.',
              badge: 'Rekomendasi Riset Lapangan'
            },
            {
              title: 'Permohonan Keterbukaan Informasi Publik (KIP)',
              desc: 'Mengirimkan surat permohonan data resmi ke Pejabat Pengelola Informasi dan Dokumentasi (PPID) instansi terkait.',
              badge: 'Advokasi Legal'
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
        title: 'Pemetaan Relasi Kuasa & Dinamika Aktor Pemangku Kepentingan',
        badge: `${actors.length} Aktor Utama`,
        content: {
          overview: 'Analisis posisi, kepentingan, dan relasi daya tawar antar lembaga pemerintah, korporasi, aparat keamanan, dan kelompok masyarakat terdampak.',
          points: actors.map(a => ({
            title: `${a.name} (${a.organization})`,
            desc: `Peran: ${a.role} | Sikap: [${a.stance}] | Pernyataan Kunci: ${a.statement}`,
            badge: `Pengaruh: ${a.influence_level}`
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
        title: '8 Dimensi Pertanyaan Kajian Kritis & Dialektis',
        badge: 'Dialectic Inquiry Matrix',
        content: {
          overview: 'Pertanyaan dirancang sistematis mencakup 8 dimensi untuk memandu diskusi komprehensif di forum kader dan tim riset advokasi.',
          research_questions: [
            { dimension: '1. Akar Masalah', question: `Apa faktor struktural dan regulasi masa lalu yang melandasi timbulnya polemik ${issue.title}?`, priority: 'Tinggi' },
            { dimension: '2. Kelompok Terdampak', question: `Siapa kelompok masyarakat berpenghasilan rendah yang paling rentan mengalami kerugian ekonomi dan sosial akibat kebijakan ini?`, priority: 'Tinggi' },
            { dimension: '3. Respons Kebijakan', question: `Bagaimana efektivitas dan keberpihakan respons instansi pemerintah daerah dalam menangani aduan warga?`, priority: 'Tinggi' },
            { dimension: '4. Kesenjangan Implementasi', question: `Apakah terdapat perbedaan nyata antara aturan di atas kertas (de jure) dengan praktik aparat di lapangan (de facto)?`, priority: 'Tinggi' },
            { dimension: '5. Kondisi Lapangan', question: `Bagaimana suara otentik dan keluhan riil yang dirasakan langsung oleh masyarakat akar rumput?`, priority: 'Sedang' },
            { dimension: '6. Celah Data', question: `Informasi dan dokumen publik apa yang sengaja ditutup atau belum tersedia bagi pengawasan publik?`, priority: 'Tinggi' },
            { dimension: '7. Dampak Jangka Panjang', question: `Apa konsekuensi ekologis, sosial, dan ekonomi 5 hingga 10 tahun mendatang jika isu ini diabaikan?`, priority: 'Sedang' },
            { dimension: '8. Alternatif Kebijakan', question: `Solusi konkret dan regulasi alternatif apa yang dapat diusulkan GMNI kepada pembuat kebijakan?`, priority: 'Tinggi' }
          ]
        }
      };
    }

    case 'recommend_research': {
      const rec = issue.research_recommendation;
      return {
        action: 'recommend_research',
        issueId: issue.id,
        issueTitle: issue.title,
        timestamp,
        title: 'Rekomendasi Kelayakan Riset & Kajian Strategis',
        badge: `Status: ${rec.verdict} (${rec.score}/100)`,
        content: {
          overview: `Berdasarkan kalkulasi 6 indikator internal (Relevansi, Dampak Kerakyatan, Urgensi, Ketersediaan Data, Potensi Kebijakan, dan Lokus Teritorial), isu ini dinilai "${rec.verdict}".`,
          recommendation: {
            verdict: rec.verdict,
            score: rec.score,
            reasoning: [
              `Relevansi Isu: ${rec.relevance_notes}`,
              `Urgensi Waktu: ${rec.urgency_notes}`,
              `Ketersediaan Data: ${rec.data_availability}`,
              `Dampak Rakyat Marhaen: ${rec.grassroots_impact}`,
              `Potensi Kebijakan: ${rec.policy_potential}`
            ],
            action_items: [
              `Sudut Pandang yang Disarankan: ${rec.suggested_angle}`,
              'Segera bentuk Tim Khusus Kajian Isu di bawah koordinasi Bidang SosPol.',
              'Jadwalkan Focus Group Discussion (FGD) internal komisariat dalam minggu ini.',
              'Susun Policy Brief ringkas untuk diserahkan ke fraksi legislatif dan pemda.'
            ]
          }
        }
      };
    }

    case 'marhaenism_framework': {
      const m = issue.marhaenism_analysis;
      return {
        action: 'marhaenism_framework',
        issueId: issue.id,
        issueTitle: issue.title,
        timestamp,
        title: 'Analisis Perspektif GMNI & Pisau Analisis Marhaenisme',
        badge: 'Kerangka Ideologis Marhaenisme',
        content: {
          overview: 'Pisau analisis Marhaenisme membedah relasi kuasa kapital, birokrasi, dan perlindungan terhadap kaum Marhaen (petani gurem, buruh rentan, nelayan tradisional, dan rakyat kecil).',
          marhaenism: {
            sosio_nasionalisme: m.sosio_nasionalisme,
            sosio_demokrasi: m.sosio_demokrasi,
            trisakti: m.trisakti_perspective,
            pro_poor_defense: m.pro_poor_advocacy_notes,
            dialectical_questions: m.critical_questions
          }
        }
      };
    }

    case 'generate_kajian_outline': {
      return {
        action: 'generate_kajian_outline',
        issueId: issue.id,
        issueTitle: issue.title,
        timestamp,
        title: 'Draf Dokumen Bahan Kajian & Policy Brief Siap Terbit',
        badge: 'Generator Bahan Kajian Otomatis',
        content: {
          overview: 'Struktur naskah kajian akademik-advokasi lengkap yang mengintegrasikan fakta terkonfirmasi, analisis dialektis Marhaenis, dan rekomendasi aksi konkret.',
          kajian_draft: {
            title: `Kajian Kebijakan: Penanganan Strategis ${issue.title}`,
            subtitle: `Naskah Advokasi dan Kajian Sosial Politik GMNI Komisariat Wastukancana Purwakarta`,
            author: 'Bidang Sosial Politik GMNI Wastukancana',
            komisariat: 'GMNI Komisariat Wastukancana – Purwakarta',
            status: 'Draft',
            sections: {
              latar_belakang: issue.summary_ai.what_happened + ' ' + issue.summary_ai.why_important,
              rumusan_masalah: [
                `Bagaimana dampak langsung ${issue.title} terhadap kehidupan sosial ekonomi masyarakat?`,
                `Sejauh mana kebijakan pemerintah daerah dan pusat telah memenuhi rasa keadilan rakyat?`,
                `Apa rekomendasi langkah taktis dan strategis yang harus diperjuangkan GMNI?`
              ],
              data_dan_fakta: claims.filter(c => c.type === 'fact').map(c => `${c.content} (Sumber: ${c.source_name})`),
              kronologi_singkat: [
                `Isu terdeteksi pertama kali: ${issue.first_detected_at.slice(0, 10)}`,
                `Pembaruan bukti dan data sumber: ${issue.last_updated_at.slice(0, 10)}`
              ],
              pihak_terkait: actors.map(a => ({ nama: a.name, peran: a.role, posisi: a.stance })),
              analisis_sosial_politik: issue.marhaenism_analysis.sosio_demokrasi,
              perspektif_marhaenisme: issue.marhaenism_analysis.sosio_nasionalisme,
              dampak_masyarakat: issue.summary_ai.who_is_affected.join(', '),
              alternatif_kebijakan: [
                'Moratorium kebijakan sepihak dan pembukaan ruang dengar pendapat publik secara partisipatif.',
                'Audit investigasi terbuka terhadap pihak-pihak yang mengambil keuntungan sepihak.',
                'Penyusunan regulasi perlindungan afirmatif bagi kelompok rentan dan masyarakat lokal.'
              ],
              rekomendasi_advokasi: [
                'Penerbitan Policy Paper resmi GMNI ke DPRD dan Bupati/Gubernur.',
                'Penggalangan solidaritas antar-elemen gerakan mahasiswa dan serikat rakyat.',
                'Audiensi dan advokasi lapangan secara konsisten hingga tuntutan rakyat dipenuhi.'
              ],
              daftar_pustaka: sources.map(s => ({ title: s.title, source: s.source_name, year: s.published_at.slice(0, 4) }))
            }
          }
        }
      };
    }

    default:
      return runAIAnalysis(issueId, 'summarize');
  }
}
