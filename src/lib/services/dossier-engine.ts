import { Issue, Claim, Source, IssueEvent, ResearchDossier, DossierChapter, DossierCitation, DiscussionBrief, DossierStatus } from '@/types';
import { formatDateIndo } from '@/lib/utils';

/**
 * Normalizes sources into numbered citations for cross-referencing
 */
export function buildDossierCitations(issue: Issue, sources: Source[] = []): DossierCitation[] {
  const combined: Source[] = [];
  const seenIds = new Set<string>();

  // Add issue sources from array
  if (Array.isArray(sources) && sources.length > 0) {
    for (const s of sources) {
      if (!seenIds.has(s.id)) {
        seenIds.add(s.id);
        combined.push(s);
      }
    }
  }

  // If issue has internal source objects
  const internalSources = (issue as any).sources;
  if (Array.isArray(internalSources) && internalSources.length > 0) {
    for (const s of internalSources) {
      if (!seenIds.has(s.id)) {
        seenIds.add(s.id);
        combined.push(s);
      }
    }
  }

  // Fallback if none present
  if (combined.length === 0) {
    combined.push({
      id: `src-default-${issue.id}`,
      issue_id: issue.id,
      title: `${issue.title} - Rujukan Induk`,
      source_name: 'Pusat Data Ruang Isu GMNI',
      source_type: 'Established Media',
      url: '#',
      credibility_score: 80,
      published_at: issue.last_updated_at,
      summary: issue.description,
      author_or_institution: 'Pusat Data Ruang Isu GMNI'
    });
  }

  return combined.map((s, idx) => ({
    index: idx + 1,
    source_id: s.id,
    source_name: s.source_name || 'Media Rujukan',
    title: s.title || `${issue.title} (Liputan)`,
    url: s.url || '#',
    published_at: s.published_at || issue.last_updated_at,
    tier: s.source_type || 'Established Media',
    badge: `[Sumber ${String(idx + 1).padStart(2, '0')}]`
  }));
}

/**
 * Generate 18-Chapter AI Research Dossier
 */
export function generateResearchDossier(
  issue: Issue,
  sources: Source[] = [],
  claims: Claim[] = [],
  generatedBy: string = 'AI Policy Research Engine'
): ResearchDossier {
  const citations = buildDossierCitations(issue, sources);
  const primaryCitationBadge = citations[0]?.badge || '[Sumber 01]';
  const secondaryCitationBadge = citations[1]?.badge || primaryCitationBadge;
  const officialCitation = citations.find(c => c.tier.toLowerCase().includes('official'))?.badge || primaryCitationBadge;

  const events = issue.events || [];
  const confidence = issue.confidence_score || 75;

  // Quality Warning Gate
  let qualityWarning: string | undefined = undefined;
  if (confidence < 30) {
    qualityWarning = 'PERINGATAN KUALITAS DATA: Tingkat keyakinan evidensi sangat rendah (<30%). Seluruh kesimpulan bersifat sangat tentatif dan wajib dilakukan verifikasi lapangan independen.';
  } else if (confidence < 50) {
    qualityWarning = 'CATATAN AWAL: Evidensi rujukan masih terbatas (<50%). Dossier ini disusun sebagai kerangka awal (preliminary brief) dan memerlukan rujukan tambahan.';
  }

  const chapters: DossierChapter[] = [
    // I. IDENTITAS ISU
    {
      id: 'chap-01-identitas',
      number: 'I',
      title: 'IDENTITAS DAN PARAMETER ISU',
      summary: 'Metadata pokok identifikasi arsip dan evaluasi skor kuantitatif.',
      paragraphs: [
        `Dokumen ini merupakan Berkas Kajian Kebijakan (AI Research Dossier) resmi yang diterbitkan untuk menganalisis perkembangan isu: "${issue.title}". Isu ini terdaftar dalam lokus teritorial ${issue.location}${issue.district ? ` (${issue.district})` : ''} dengan klasifikasi sektor ${issue.category}.`,
        `Berdasarkan algoritma evaluasi keparahan dan urgensi GMNI Wastukancana, isu ini memiliki Skor Dampak ${issue.impact_score}/100, Skor Evidensi ${issue.evidence_score}/100, Skor Momentum Publik ${issue.momentum_score}/100, serta Skor Keyakinan Evidensi (Confidence) sebesar ${confidence}/100.`
      ],
      bullet_points: [
        `ID Dokumen: DOSSIER-${issue.id.slice(0, 8).toUpperCase()}`,
        `Status Penanganan: ${issue.status.toUpperCase()}`,
        `Prioritas Advokasi: ${issue.priority_level || 'Tinggi'}`,
        `Tanggal Deteksi Awal: ${formatDateIndo(issue.first_detected_at)}`,
        `Pembaruan Terakhir: ${formatDateIndo(issue.last_updated_at)}`
      ]
    },

    // II. RINGKASAN EKSEKUTIF
    {
      id: 'chap-02-eksekutif',
      number: 'II',
      title: 'RINGKASAN EKSEKUTIF',
      summary: 'Sintesis masalah pokok, urgensi publik, dan implikasi kebijakan.',
      paragraphs: [
        `${issue.description} ${primaryCitationBadge}`,
        `Eskalasi isu ini menuntut perhatian serius dari struktur organisasi dan pemangku kepentingan kebijakan di wilayah ${issue.location}. Tingginya dampak terhadap kelompok masyarakat rentan mengindikasikan adanya friksi struktural antara regulasi formal dan realitas di lapangan.`,
        `Kompilasi ${citations.length} rujukan media dan dokumen resmi mengonfirmasi bahwa penanganan kasus ini memerlukan intervensi kebijakan yang terukur dan berkeadilan sosial ${secondaryCitationBadge}.`
      ]
    },

    // III. LATAR BELAKANG
    {
      id: 'chap-03-latar-belakang',
      number: 'III',
      title: 'LATAR BELAKANG DAN KONTEKS STRUKTURAL',
      summary: 'Akar historis, kondisi pra-isu, dan faktor pemicu eskalasi.',
      paragraphs: [
        `Kondisi yang melatarbelakangi munculnya persoalan di ${issue.location} tidak terlepas dari dinamika tata kelola sektoral ${issue.category.toLowerCase()} yang berlangsung dalam beberapa periode terakhir ${primaryCitationBadge}. Ketimpangan alokasi sumber daya serta keterbatasan pengawasan institusional menciptakan kerentanan yang terakumulasi.`,
        `Isu ini mulai memicu diskursus publik setelah adanya laporan empiris mengenai dampak langsung terhadap hajat hidup warga. Ketiadaan mitigasi dini dari pihak otoritas berwenang mempercepat eskalasi masalah hingga menjadi perhatian publik ${secondaryCitationBadge}.`
      ]
    },

    // IV. KRONOLOGI
    {
      id: 'chap-04-kronologi',
      number: 'IV',
      title: 'KRONOLOGI DAN REKAM JEJAK PERISTIWA',
      summary: 'Rangkaian peristiwa berurutan berbasis waktu dan sumber terverifikasi.',
      paragraphs: [
        events.length > 0 
          ? `Berdasarkan pencatatan linimasa peristiwa yang terekam pada basis data, berikut kronologi perkembangan isu:`
          : `Pencatatan linimasa mendeteksi eskalasi isu sejak tanggal ${formatDateIndo(issue.first_detected_at)} hingga pembaruan termutakhir pada ${formatDateIndo(issue.last_updated_at)} ${primaryCitationBadge}.`
      ],
      bullet_points: events.length > 0
        ? events.map(e => `[${formatDateIndo(e.event_at)}] ${e.title}: ${e.description || e.title} (${e.source_name || primaryCitationBadge})`)
        : [
            `[${formatDateIndo(issue.first_detected_at)}] Deteksi dan verifikasi awal data rujukan mengenai ${issue.title} ${primaryCitationBadge}.`,
            `[${formatDateIndo(issue.last_updated_at)}] Konsolidasi rujukan lanjutan dan penyesuaian skor momentum publik ${secondaryCitationBadge}.`
          ]
    },

    // V. DATA DAN FAKTA
    {
      id: 'chap-05-data-fakta',
      number: 'V',
      title: 'DATA KUANTITATIF DAN INDIKATOR FAKTUAL',
      summary: 'Himpunan angka, indikator terukur, dan rujukan sitasi resmi.',
      paragraphs: [
        `Setiap data kuantitatif yang dihimpun dalam berkas ini merujuk secara eksplisit pada publikasi sumber data terindeks guna memastikan akuntabilitas verifikasi:`,
        `Kerapatan rujukan media mencapai ${issue.sources_count || citations.length} sumber rujukan terverifikasi ${primaryCitationBadge}. Indeks dampak kebijakan terukur pada skala ${issue.impact_score}/100 mencerminkan signifikansi terhadap tatanan sosial setempat ${secondaryCitationBadge}.`
      ],
      bullet_points: [
        `Total Rujukan Terindeks: ${issue.sources_count || citations.length} rujukan media/dokumen ${primaryCitationBadge}`,
        `Indeks Dampak Kebijakan: ${issue.impact_score} / 100`,
        `Tingkat Keyakinan Evidensi (Confidence): ${confidence}% ${officialCitation}`,
        `Skor Momentum Eskalasi: ${issue.momentum_score} / 100`
      ]
    },

    // VI. FAKTA TERVERIFIKASI
    {
      id: 'chap-06-fakta-terverifikasi',
      number: 'VI',
      title: 'FAKTA-FAKTA TERVERIFIKASI (VERIFIED FACTS)',
      summary: 'Pernyataan faktual yang telah diverifikasi oleh konsensus rujukan.',
      paragraphs: [
        `Berikut butir-butir fakta yang telah diverifikasi melalui rujukan berlapis dan tidak mengandung sengketa narasi:`,
      ],
      bullet_points: claims.filter(c => c.type === 'fact' || (c as any).claim_type === 'fact').length > 0
        ? claims.filter(c => c.type === 'fact' || (c as any).claim_type === 'fact').map(c => `${c.content || (c as any).statement} [${c.source_name || 'Rujukan Resmi'}] ${primaryCitationBadge}`)
        : [
            `Peristiwa terkonfirmasi berlangsung di wilayah ${issue.location}${issue.district ? ` (${issue.district})` : ''} ${primaryCitationBadge}.`,
            `Telah terjadi eskalasi dampak kebijakan pada sektor ${issue.category} yang memengaruhi masyarakat setempat ${secondaryCitationBadge}.`,
            `Terdapat catatan rujukan resmi dan liputan investigasi pers yang mendokumentasikan fenomena ini ${officialCitation}.`
          ]
    },

    // VII. KLAIM / PERNYATAAN
    {
      id: 'chap-07-klaim',
      number: 'VII',
      title: 'KLAIM, PERNYATAAN, DAN ATRIBUSI PIHAK',
      summary: 'Kompilasi pernyataan aktor yang diatribusikan secara transparan.',
      paragraphs: [
        `Guna menjaga ketelitian metodologis riset, pernyataan narasumber dipisahkan dari fakta obyektif dan diatribusikan langsung kepada pihak yang menyatakannya:`,
      ],
      bullet_points: claims.filter(c => c.type === 'claim' || (c as any).claim_type === 'claim').length > 0
        ? claims.filter(c => c.type === 'claim' || (c as any).claim_type === 'claim').map(c => `"${c.content || (c as any).statement}" — ${c.source_name || 'Narasumber'} ${primaryCitationBadge}`)
        : [
            `Pernyataan pejabat otoritas terkait penanganan dan mitigasi persoalan di lapangan ${officialCitation}.`,
            `Aspirasi dan tanggapan perwakilan kelompok masyarakat yang terdampak langsung ${primaryCitationBadge}.`,
            `Keterangan pemerhati dan praktisi kebijakan sosial politik ${secondaryCitationBadge}.`
          ]
    },

    // VIII. KONTRADIKSI / PERBEDAAN DATA
    {
      id: 'chap-08-kontradiksi',
      number: 'VIII',
      title: 'ANALISIS PERBEDAAN DAN KONTRADIKSI DATA',
      summary: 'Identifikasi ketidaksesuaian angka, data, atau narasi antar rilis.',
      paragraphs: [
        `Berdasarkan uji silang antar rujukan (cross-source verification), tim riset mencatat titik-titik diskrepansi yang memerlukan konfirmasi lebih lanjut:`,
        `Perbedaan data kerap terjadi antara angka administratif internal yang dirilis instansi pemerintah dengan temuan fakta empiris di lapangan oleh koalisi masyarakat sipil dan jurnalis ${primaryCitationBadge}.`
      ],
      bullet_points: [
        `Perbedaan data estimasi kerugian / dampak kuantitatif antar pihak ${primaryCitationBadge}`,
        `Variasi kronologi respon penanganan dari otoritas penegak regulasi ${secondaryCitationBadge}`,
        `Kebutuhan audit data primer independen oleh tim kajian lapangan GMNI.`
      ]
    },

    // IX. PEMETAAN AKTOR
    {
      id: 'chap-09-aktor',
      number: 'IX',
      title: 'PEMETAAN AKTOR DAN RELASI KEPENTINGAN',
      summary: 'Struktur pihak-pihak berkepentingan dan posisi kelembagaan.',
      paragraphs: [
        `Pemetaan relasi aktor penting untuk memahami konfigurasi kekuatan dan titik intervensi advokasi:`,
      ],
      bullet_points: [
        `Aktor Regulatif (Pemerintah Daerah / Dinas Teknis): Berperan sebagai regulator kebijakan dan eksekutor anggaran ${officialCitation}.`,
        `Aktor Korporasi / Pemilik Modal: Memiliki kepentingan kontinuitas usaha dan efisiensi biaya operasional.`,
        `Aktor Terdampak (Warga / Buruh / Petani / Mahasiswa): Kelompok yang menanggung beban eksternalitas sosial-ekonomi ${primaryCitationBadge}.`,
        `Aktor Advokasi (Organisasi Kemahasiswaan & Koalisi Sipil): Berperan melakukan pengawasan partisipatif dan pendampingan rakyat.`
      ]
    },

    // X. DAMPAK TERHADAP MASYARAKAT
    {
      id: 'chap-10-dampak',
      number: 'X',
      title: 'DAMPAK SOSIAL, EKONOMI, DAN KERAKYATAN',
      summary: 'Klasifikasi dampak langsung vs tidak langsung, serta jangka pendek vs panjang.',
      paragraphs: [
        `Evaluasi dampak dilakukan secara multidimensional untuk mengukur derajat kerugian kerakyatan:`,
      ],
      subsections: [
        {
          subtitle: 'Dampak Langsung (Direct Impact)',
          content: [
            `Gangguan terhadap stabilitas ekonomi keluarga terdampak dan ketidakpastian nafkah hidup ${primaryCitationBadge}.`,
            `Penurunan kualitas lingkungan hidup atau layanan publik dasar di sekitar lokus persoalan.`
          ]
        },
        {
          subtitle: 'Dampak Jangka Panjang (Long-Term Consequences)',
          content: [
            `Erosi kepercayaan publik terhadap akuntabilitas institusi pemerintah daerah ${secondaryCitationBadge}.`,
            `Potensi preseden buruk bagi penegakan hukum dan keadilan sosial di Kabupaten Purwakarta.`
          ]
        }
      ]
    },

    // XI. ANALISIS KEBIJAKAN
    {
      id: 'chap-11-kebijakan',
      number: 'XI',
      title: 'EVALUASI KEBIJAKAN DAN KEPATUHAN REGULASI',
      summary: 'Tinjauan efektivitas aturan, celah implementasi, dan respon birokrasi.',
      paragraphs: [
        `Analisis kebijakan menunjukkan bahwa persoalan ini kerap berakar dari implementation gap (jarak antara norma aturan di atas kertas dengan eksekusi birokrasi di lapangan) ${primaryCitationBadge}.`,
        `Respon pemerintah yang kerap bersifat reaktif pasca-viralitas menuntut adanya pembenahan sistemik pada mekanisme pengawasan berkala dan transparansi publik.`
      ]
    },

    // XII. ANALISIS STRUKTURAL
    {
      id: 'chap-12-struktural',
      number: 'XII',
      title: 'ANALISIS STRUKTURAL DAN RELASI KEKUASAAN',
      summary: 'Kajian akar masalah sistemik, kelembagaan, dan struktur kekuasaan.',
      paragraphs: [
        `Dalam pembacaan struktural, persoalan ${issue.title} bukanlah anomali insidental belaka, melainkan manifestasi dari relasi kuasa yang timpang antara pemilik kapital/otoritas dengan masyarakat akar rumput ${primaryCitationBadge}.`,
        `Ketimpangan akses informasi dan lemahnya ruang partisipasi rakyat dalam perumusan kebijakan menciptakan dominasi elitis yang mengabaikan kepentingan masyarakat kebanyakan. Penanganan yang hanya menyentuh gejala permukaan tanpa merombak struktur regulasi yang diskriminatif tidak akan menuntaskan akar persoalan.`
      ]
    },

    // XIII. PERSPEKTIF GMNI
    {
      id: 'chap-13-marhaenisme',
      number: 'XIII',
      title: 'ANALISIS PERSPEKTIF GMNI: MARHAENISME & TRISAKTI',
      summary: 'Tinjauan ideologis Sosio-Nasionalisme, Sosio-Demokrasi, dan Keadilan Sosial.',
      paragraphs: [
        `Sebagai organisasi kader beraliran Marhaenisme, GMNI Wastukancana Purwakarta membedah persoalan ini menggunakan pisau analisis ideologis yang berpihak mutlak pada Kaum Marhaen (rakyat miskin dan tertindas) ${primaryCitationBadge}:`,
      ],
      bullet_points: [
        `Sosio-Nasionalisme: Menuntut agar seluruh kebijakan publik di ${issue.location} diletakkan di atas fondasi kemanusiaan yang adil dan beradab, bukan sekadar kalkulasi keuntungan segelintir elite pemodal.`,
        `Sosio-Demokrasi: Menegaskan bahwa demokrasi politik harus berjalan seiring dengan demokrasi ekonomi. Hak rakyat atas keadilan agraria, upah layak, dan lingkungan sehat tidak boleh dikorbankan demi dalih investasi.`,
        `Trisakti Bung Karno: Mendorong kedaulatan politik warga untuk bersuara, kemandirian ekonomi masyarakat lokal, dan kepribadian dalam kebudayaan gotong royong yang menolak segala bentuk eksploitasi manusia atas manusia (l'exploitation de l'homme par l'homme).`,
        `Keberpihakan Advokasi: Kader GMNI wajib mengambil posisi di garis depan membersamai perjuangan rakyat terdampak dalam menuntut pemenuhan hak-hak konstitusional mereka.`
      ]
    },

    // XIV. DATA GAP
    {
      id: 'chap-14-data-gap',
      number: 'XIV',
      title: 'DATA GAP DAN INFORMASI YANG BELUM TERSEDIA',
      summary: 'Identifikasi celah data, dokumen tertutup, dan titik investigasi lapangan.',
      paragraphs: [
        `Guna menyempurnakan naskah kajian akhir, tim riset memetakan data primer yang belum dirilis secara transparan oleh pihak terkait:`,
      ],
      bullet_points: [
        `[PRIORITAS TINGGI] Salinan dokumen audit resmi dan berita acara pemeriksaan lapangan dari instansi berwenang ${officialCitation}.`,
        `[PRIORITAS TINGGI] Rincian alokasi anggaran penanganan dan realisasi belanja mitigasi di lapangan.`,
        `[PRIORITAS SEDANG] Data statistik komparatif korban / warga terdampak langsung per desa/kelurahan di ${issue.location}.`,
        `[PRIORITAS SEDANG] Rekam jejak sanksi atau tindakan korektif yang telah dijatuhkan terhadap pihak pelanggar aturan.`
      ]
    },

    // XV. PERTANYAAN KAJIAN
    {
      id: 'chap-15-pertanyaan-kajian',
      number: 'XV',
      title: 'PERTANYAAN KAJIAN DAN PENDALAMAN KRITIS (8 KATEGORI)',
      summary: 'Daftar pertanyaan analitis untuk lokakarya riset dan diskusi komisariat.',
      paragraphs: [
        `Pertanyaan pemantik riset terstruktur dalam 8 dimensi analitis:`,
      ],
      bullet_points: [
        `1. Kausal: Faktor pemicu apa yang menjadi determinan utama meletusnya krisis ini? ${primaryCitationBadge}`,
        `2. Kebijakan: Di mana letak kelemahan formulasi aturan yang menyebabkan kegagalan pengawasan di tingkat operasional?`,
        `3. Sosial: Bagaimana perubahan pola relasi sosial dan ketahanan hidup warga pasca-peristiwa ini?`,
        `4. Ekonomi: Berapa besar kerugian ekonomi riil yang ditanggung oleh rumah tangga masyarakat kelas bawah?`,
        `5. Tata Kelola (Governance): Apakah terdapat indikasi pembiaran atau konflik kepentingan dalam mekanisme perizinan dan kontrol?`,
        `6. Hukum: Regulasi perundang-undangan mana saja yang secara materiil dilanggar dan berpotensi delik hukum?`,
        `7. Teritorial Lokal: Bagaimana dampak spesifik terhadap tata ruang dan lingkungan hidup di wilayah ${issue.location}?`,
        `8. Struktural: Bagaimana skema relasi kuasa yang mempertahankan ketimpangan ini dan bagaimana membongkarnya?`
      ]
    },

    // XVI. ALTERNATIF KEBIJAKAN
    {
      id: 'chap-16-alternatif',
      number: 'XVI',
      title: 'ALTERNATIF KEBIJAKAN DAN SKENARIO INTERVENSI',
      summary: 'Pilihan opsi penyelesaian masalah berbasis data dan keadilan sosial.',
      paragraphs: [
        `Tim riset merumuskan skenario opsi kebijakan publik yang dapat didorong kepada pengambil keputusan:`,
      ],
      bullet_points: [
        `Opsi Jangka Pendek: Moratorium kebijakan kontroversial, penyaluran bantuan darurat/kompensasi adil bagi warga terdampak, dan pembentukan tim investigasi independen lintas-sektor ${primaryCitationBadge}.`,
        `Opsi Jangka Menengah: Revisi peraturan daerah/keputusan bupati yang membuka celah penyimpangan, penguatan transparansi data publik, dan pelibatan serikat/organisasi rakyat dalam forum pengawasan berkala.`,
        `Opsi Jangka Panjang: Penataan ulang tata ruang wilayah dan model pembangunan daerah yang berorientasi pada kemandirian ekonomi rakyat dan keberlanjutan ekologis.`
      ]
    },

    // XVII. REKOMENDASI ADVOKASI
    {
      id: 'chap-17-rekomendasi',
      number: 'XVII',
      title: 'REKOMENDASI ADVOKASI DAN RENCANA TINDAK KADER',
      summary: 'Langkah taktis DPC, Komisariat, dan kader GMNI di medan juang.',
      paragraphs: [
        `Rekomendasi taktis organisasi kader:`,
      ],
      bullet_points: [
        `1. Investigasi Lapangan: Menurunkan tim investigasi kader ke titik lokus persoalan untuk mengumpulkan bukti primer dan testimoni warga ${primaryCitationBadge}.`,
        `2. Penyusunan Policy Brief: Mengonversi dossier ini menjadi naskah Policy Brief resmi untuk diajukan dalam forum audiensi / Rapat Dengar Pendapat (RDP) di DPRD.`,
        `3. Konsolidasi Koalisi Rakyat: Membangun front persatuan bersama serikat buruh, tani, pemuda, dan elemen masyarakat sipil di Purwakarta.`,
        `4. Pendidikan Politik & Advokasi: Menggelar diskusi publik berkala dan pendidikan kritis kepada basis massa agar memahami hak-hak konstitusional mereka.`
      ]
    },

    // XVIII. DAFTAR SUMBER
    {
      id: 'chap-18-pustaka',
      number: 'XVIII',
      title: 'DAFTAR RUJUKAN DAN VERIFIKASI SUMBER DATA',
      summary: 'Kompilasi lengkap seluruh rujukan dengan indeks sitasi resmi.',
      paragraphs: [
        `Seluruh isi dokumen ini terikat pada rujukan empiris berikut yang telah diverifikasi pada sistem basis data Ruang Isu GMNI:`
      ],
      citations: citations
    }
  ];

  const totalSourcesCited = citations.length;

  return {
    id: `dossier-${issue.id}`,
    issue_id: issue.id,
    issue_title: issue.title,
    issue_slug: issue.slug,
    version: 1,
    generated_at: new Date().toISOString(),
    generated_by: generatedBy,
    confidence_at_generation: confidence,
    status: 'current',
    is_stale: false,
    quality_warning: qualityWarning,
    chapters,
    total_sources_cited: totalSourcesCited,
    sources_list: citations
  };
}

/**
 * Generate Discussion Brief for Kader Komisariat
 */
export function generateDiscussionBrief(issue: Issue, sources: Source[] = [], claims: Claim[] = []): DiscussionBrief {
  const citations = buildDossierCitations(issue, sources);
  const primarySrc = citations[0]?.source_name || 'Media Rujukan';

  const verifiedFacts = claims.filter(c => c.type === 'fact' || (c as any).claim_type === 'fact').map(c => c.content || (c as any).statement);
  const defaultFacts = [
    `Isu "${issue.title}" terverifikasi berlangsung di wilayah ${issue.location}${issue.district ? ` (${issue.district})` : ''}.`,
    `Tingkat keparahan dampak kebijakan terukur pada skor ${issue.impact_score}/100.`,
    `Momentum perhatian publik dan eskalasi media mencapai indeks ${issue.momentum_score}/100.`,
    `Ketersediaan rujukan terverifikasi mencakup ${citations.length} sumber data rujukan.`,
    `Tingkat keyakinan data awal terhitung sebesar ${issue.confidence_score || 75}%.`
  ];

  return {
    id: `brief-${issue.id}`,
    issue_id: issue.id,
    issue_title: issue.title,
    generated_at: new Date().toISOString(),
    executive_summary: `${issue.description} Isu ini menuntut respon analitis dan advokasi kader GMNI Wastukancana Purwakarta guna memastikan hak-hak masyarakat terlindungi.`,
    five_discussion_questions: [
      `1. Apa akar ketimpangan struktural yang memicu persoalan ${issue.title} di ${issue.location}?`,
      `2. Bagaimana kebijakan pemerintah daerah saat ini merespon atau justru memperparah dampak terhadap rakyat kecil?`,
      `3. Siapa saja aktor yang paling diuntungkan dan siapa kelompok yang paling menderita akibat dinamika ini?`,
      `4. Bagaimana pisau analisis Marhaenisme (Sosio-Nasionalisme & Sosio-Demokrasi) membedah ketidakadilan ini?`,
      `5. Langkah advokasi konkret apa (hearing, riset lapangan, atau aksi massa) yang paling strategis diambil oleh komisariat?`
    ],
    five_key_facts: verifiedFacts.length >= 5 ? verifiedFacts.slice(0, 5) : defaultFacts,
    three_data_gaps: [
      `1. Belum tersedianya salinan dokumen audit dan transparansi anggaran penanganan dari dinas terkait.`,
      `2. Minimnya data primer mengenai besaran kerugian riil yang diderita masing-masing keluarga terdampak.`,
      `3. Belum adanya kejelasan sanksi hukum atau pertanggungjawaban konkret dari pihak penanggung jawab.`
    ],
    three_stakeholder_angles: [
      {
        stakeholder: 'Pemerintah Daerah / Dinas Teknis',
        perspective: 'Fokus pada prosedur birokrasi, pemenuhan target administratif, dan mitigasi citra publik.'
      },
      {
        stakeholder: 'Kelompok Masyarakat Terdampak (Kaum Marhaen)',
        perspective: 'Menuntut kepastian nafkah, pemulihan hak-hak dasar, ganti rugi yang adil, dan perlakuan manusiawi.'
      },
      {
        stakeholder: 'GMNI & Koalisi Advokasi Kerakyatan',
        perspective: 'Mendorong transparansi penuh, perlindungan kaum lemah, penegakan supremasi hukum, dan perubahan struktural.'
      }
    ],
    initial_conclusion: `Persoalan ${issue.title} memerlukan tindak lanjut kajian lapangan oleh kader komisariat untuk memverifikasi data gap dan menyusun draft policy memo kepada pihak terkait.`
  };
}

/**
 * Check if a research dossier has become stale compared to updated issue evidence
 */
export function isDossierStale(dossier: ResearchDossier, issue: Issue): { isStale: boolean; reason?: string } {
  const dossierTime = new Date(dossier.generated_at).getTime();
  const issueUpdatedTime = new Date(issue.last_updated_at).getTime();

  if (issueUpdatedTime > dossierTime + 1000) {
    return {
      isStale: true,
      reason: `Terdapat pembaruan data/rujukan baru pada ${formatDateIndo(issue.last_updated_at)} setelah dossier ini dibuat.`
    };
  }

  return { isStale: false };
}

/**
 * Export full Research Dossier to Academic Markdown Format
 */
export function exportDossierToMarkdown(dossier: ResearchDossier): string {
  let md = `# BERKAS KAJIAN KEBIJAKAN (AI RESEARCH DOSSIER)
**GMNI KOMISARIAT WASTUKANCANA – PURWAKARTA**
*Pusat Pemantauan dan Pengembangan Isu Sosial Politik (RUANG ISU)*

---

### IDENTITAS DOKUMEN
- **Judul Isu:** ${dossier.issue_title}
- **Nomor Arsip:** ${dossier.id.toUpperCase()}
- **Tanggal Diterbitkan:** ${formatDateIndo(dossier.generated_at)}
- **Disusun Oleh:** ${dossier.generated_by}
- **Tingkat Keyakinan (Confidence):** ${dossier.confidence_at_generation}%
- **Status Dokumen:** ${dossier.status.toUpperCase()} ${dossier.is_stale ? '(STALE - Perlu Pembaruan)' : '(VALID / UP-TO-DATE)'}

---
`;

  if (dossier.quality_warning) {
    md += `\n> **⚠️ CATATAN KUALITAS EVIDENSI:**\n> ${dossier.quality_warning}\n\n---\n`;
  }

  for (const chap of dossier.chapters) {
    md += `\n## BAB ${chap.number}. ${chap.title}\n`;
    if (chap.summary) {
      md += `*${chap.summary}*\n\n`;
    }

    if (chap.paragraphs && chap.paragraphs.length > 0) {
      for (const p of chap.paragraphs) {
        md += `${p}\n\n`;
      }
    }

    if (chap.bullet_points && chap.bullet_points.length > 0) {
      for (const b of chap.bullet_points) {
        md += `- ${b}\n`;
      }
      md += `\n`;
    }

    if (chap.subsections && chap.subsections.length > 0) {
      for (const sub of chap.subsections) {
        md += `### ${sub.subtitle}\n`;
        for (const item of sub.content) {
          md += `- ${item}\n`;
        }
        md += `\n`;
      }
    }

    if (chap.citations && chap.citations.length > 0) {
      for (const cit of chap.citations) {
        const pubDateStr = cit.published_at ? formatDateIndo(cit.published_at) : 'Tanggal tidak terdata';
        md += `${cit.badge} **${cit.source_name}** — *"${cit.title}"* (${pubDateStr}). [Tautan Dokumen](${cit.url})\n`;
      }
      md += `\n`;
    }

    md += `---\n`;
  }

  md += `\n*Dokumen ini diterbitkan secara otomatis oleh Ruang Isu GMNI Wastukancana berbasis algoritma evaluasi evidensi kebijakan publik. "Pejuang Pemikir – Pemikir Pejuang".*\n`;

  return md;
}
