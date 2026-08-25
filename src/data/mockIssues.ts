import { Issue } from '@/types';

export const mockIssues: Issue[] = [
  {
    id: 'issue-pwk-01',
    title: 'Keamanan, Zonasi KJA, dan Pengawasan Kawasan Objek Vital Waduk Jatiluhur',
    slug: 'keamanan-pengawasan-kawasan-waduk-jatiluhur',
    description: 'Peningkatan eskalasi penataan Keramba Jaring Apung (KJA), pengelolaan limbah air, serta pengamanan bendungan utama sebagai Objek Vital Nasional (Obvitnas) strategis di Kabupaten Purwakarta.',
    category: 'Keamanan Publik & Tata Kelola Air',
    location: 'Purwakarta',
    province: 'Jawa Barat',
    district: 'Kec. Jatiluhur',
    status: 'Developing',
    priority_level: 'Tinggi',
    impact_score: 88,
    urgency_score: 84,
    momentum_score: 79,
    evidence_score: 86,
    credibility_score: 92,
    first_detected_at: '2026-07-24T08:00:00Z',
    last_updated_at: '2026-08-24T14:30:00Z',
    sources_count: 24,
    is_purwakarta_priority: true,
    summary_ai: {
      what_happened: 'Perum Jasa Tirta II bersama Satpol PP dan Polres Purwakarta mengintensifkan patroli terpadu dan penertiban kuota KJA di Waduk Jatiluhur untuk menjaga stabilitas daya dukung air dan keamanan bendungan. Sebagian kelompok pembudidaya ikan lokal menyuarakan keberatan terkait kompensasi dan mata pencaharian alternatif.',
      why_important: 'Waduk Jatiluhur memasok 80% air baku untuk DKI Jakarta, mengairi 240.000 hektar sawah di Pantura Jawa Barat, dan memproduksi listrik PLTA 187 MW. Gangguan ekosistem atau keamanan bendungan berdampak sistemik lintas provinsi.',
      who_is_affected: [
        'Petani budidaya KJA dan nelayan tangkap tradisional waduk',
        'Masyarakat pengguna air baku di Purwakarta, Karawang, Bekasi, dan DKI Jakarta',
        'Petani sawah irigasi teknis di hilir Jawa Barat',
        'Pelaku wisata tirta Jatiluhur'
      ],
      key_stakeholders: [
        { category: 'Pengelola & Regulator', entities: ['Perum Jasa Tirta II (PJT II)', 'Kementerian PUPR', 'Dinas Lingkungan Hidup Kab. Purwakarta'] },
        { category: 'Aparat Penegak Hukum', entities: ['Polres Purwakarta', 'Satpol PP Purwakarta', 'Kodim 0619/Purwakarta'] },
        { category: 'Kelompok Masyarakat', entities: ['Paguyuban Petani Ikan KJA Jatiluhur', 'Forum Warga Pesisir Danau', 'Himpunan Petani Pemakai Air (P3A)'] }
      ],
      unknown_gaps: [
        'Besaran riil skema bantuan alih profesi nelayan KJA dari Pemkab Purwakarta',
        'Hasil uji baku mutu kualitas air sedimen dasar bendungan periode kuartal terakhir'
      ],
      data_discrepancies: [
        'Data PJT II mencatat 23.000 petak KJA beroperasi, sementara data asosiasi petani mencatat sekitar 16.500 petak aktif.'
      ]
    },
    marhaenism_analysis: {
      sosio_nasionalisme: 'Pengelolaan Waduk Jatiluhur harus mendudukkan kedaulatan air dan energi sebagai milik kolektif bangsa, bukan semata-mata komersialisasi korporasi atau eksploitasi tanpa batas.',
      sosio_demokrasi: 'Penertiban KJA tidak boleh mengorbankan kaum produsen kecil (petani ikan gurem). Kebijakan penataan wajib melibatkan musyawarah mufakat bersama petani lokal, bukan pendekatan sepihak represif.',
      trisakti_perspective: 'Kemandirian pangan ikan air tawar harus diseimbangkan dengan kedaulatan air nasional. Perlindungan terhadap petani ikan kecil adalah wujud konkret keadilan ekonomi Trisakti.',
      pro_poor_advocacy_notes: 'GMNI mendesak Pemkab Purwakarta dan PJT II untuk memprioritaskan kuota KJA bagi warga lokal berpenghasilan rendah dan menertibkan pemodal besar/cukong luar daerah yang menguasai ratusan petak.',
      critical_questions: [
        'Siapa aktor pemilik modal dominan di balik ribuan petak KJA ilegal di Jatiluhur?',
        'Mengapa program konversi mata pencaharian bagi nelayan lokal belum berjalan efektif?',
        'Bagaimana transparansi dana CSR dan bagi hasil air permukaan untuk kesejahteraan warga sekitar bendungan?'
      ]
    },
    research_recommendation: {
      verdict: 'Sangat Layak',
      score: 94,
      relevance_notes: 'Memenuhi seluruh kriteria kajian strategis komisariat: lokus lokal Purwakarta, berdampak langsung pada rakyat kecil, dan melibatkan kebijakan objek vital strategis.',
      urgency_notes: 'Tenggat penertiban tahap kedua berlangsung bulan depan; advokasi kebijakan berbasis data sangat krusial saat ini.',
      data_availability: 'Tinggi (24 sumber resmi dan media terverifikasi tersedia)',
      grassroots_impact: 'Sangat Tinggi (menyentuh ratusan kepala keluarga nelayan dan ribuan hektar sawah rakyat)',
      policy_potential: 'Dapat melahirkan Policy Brief Rekomendasi Regulasi Zonasi Berkeadilan untuk DPRD & Bupati Purwakarta.',
      suggested_angle: 'Keadilan Ekologis & Perlindungan Petani Ikan Lokal dalam Penataan Objek Vital Jatiluhur'
    },
    momentum_trend: {
      labels: ['18 Agu', '19 Agu', '20 Agu', '21 Agu', '22 Agu', '23 Agu', '24 Agu'],
      values: [14, 22, 35, 48, 62, 75, 89],
      percentage_change: '+46%',
      trend_status: 'Naik',
      ai_commentary: 'Pembahasan publik di Purwakarta dan Jawa Barat meningkat 46% dalam 4 hari terakhir menyusul hearing asosiasi petani KJA di kantor DPRD Purwakarta.'
    }
  },
  {
    id: 'issue-pwk-02',
    title: 'Perlindungan Hak Buruh, Status Outsourcing, dan Ancaman PHK di Kawasan Industri Bukit Indah (KBI)',
    slug: 'perlindungan-hak-buruh-outsourcing-kbi-purwakarta',
    description: 'Dugaan pelanggaran sistem kerja kontrak berulang, keterlambatan pembayaran pesangon, dan ketidakpastian status ketenagakerjaan buruh manufaktur otomotif dan garmen di Kawasan Industri Kota Bukit Indah.',
    category: 'Ketenagakerjaan & Upah',
    location: 'Purwakarta',
    province: 'Jawa Barat',
    district: 'Kec. Bungursari',
    status: 'Confirmed',
    priority_level: 'Tinggi',
    impact_score: 91,
    urgency_score: 87,
    momentum_score: 82,
    evidence_score: 89,
    credibility_score: 88,
    first_detected_at: '2026-07-15T09:00:00Z',
    last_updated_at: '2026-08-25T11:00:00Z',
    sources_count: 19,
    is_purwakarta_priority: true,
    summary_ai: {
      what_happened: 'Serikat buruh bersama aliansi mahasiswa melakukan mediasi tripartit di Disnakertrans Purwakarta terkait PHK sepihak terhadap 280 buruh kontrak serta tuntutan kepatuhan Upah Minimum Kabupaten (UMK) Purwakarta.',
      why_important: 'Kawasan Industri Bukit Indah merupakan pusat roda ekonomi Purwakarta. Ketidakpastian kerja memicu kerentanan sosial ekonomi keluarga buruh di tengah inflasi kebutuhan pokok.',
      who_is_affected: [
        'Buruh kontrak dan outsourcing di Kawasan Industri KBI Purwakarta',
        'Keluarga buruh dan sektor ekonomi mikro/warung sekitar pabrik',
        'Pencari kerja pemuda lokal lulusan SMK Purwakarta'
      ],
      key_stakeholders: [
        { category: 'Pemerintah', entities: ['Disnakertrans Kab. Purwakarta', 'Pengawas Ketenagakerjaan Wilayah II Jabar'] },
        { category: 'Pengusaha', entities: ['Asosiasi Pengusaha Indonesia (APINDO) Purwakarta', 'Manajemen Vendor Outsourcing'] },
        { category: 'Serikat Pekerja & Organisasi', entities: ['FSPMI Purwakarta', 'KASBI Purwakarta', 'Bidang SosPol GMNI Wastukancana'] }
      ],
      unknown_gaps: [
        'Data valid jumlah vendor penyalur tenaga kerja (LPTK) tak berizin di wilayah Purwakarta',
        'Laporan resmi hasil pengawasan ketenagakerjaan Provinsi Jabar terhadap audit K3'
      ]
    },
    marhaenism_analysis: {
      sosio_nasionalisme: 'Industrialisasi tidak boleh menjadi sarana penghisapan tenaga kerja nasional oleh pemodal. Kemajuan industri wajib berjalan seiring dengan martabat dan kesejahteraan kaum buruh Indonesia.',
      sosio_demokrasi: 'Hak berserikat dan perundingan bersama adalah hak fundamental buruh. Praktik union busting dan kontrak seumur hidup adalah musuh utama demokrasi ekonomi Marhaenis.',
      trisakti_perspective: 'Berdaulat secara ekonomi hanya dapat tercapai jika kelas pekerja memiliki daya beli yang layak dan jaminan perlindungan sosial menyeluruh.',
      pro_poor_advocacy_notes: 'Wajib mengawal penegakan sanksi bagi perusahaan yang melanggar ketentuan status kerja waktu tertentu (PKWT) dan memastikan ruang bantuan hukum pro-bono bagi buruh rentan.',
      critical_questions: [
        'Sejauh mana efektivitas pengawasan Disnakertrans terhadap klausul kontrak kerja outsourcing di KBI?',
        'Apakah kuota 60% tenaga kerja lokal Purwakarta sesuai Perda Ketenagakerjaan sudah benar-benar terpenuhi?'
      ]
    },
    research_recommendation: {
      verdict: 'Sangat Layak',
      score: 92,
      relevance_notes: 'Isu fundamental keberpihakan kaum Marhaen / buruh industrial di basis teritori komisariat.',
      urgency_notes: 'Batas waktu verifikasi tripartit 14 hari kerja membutuhkan pengawalan opini publik dan advokasi faktual.',
      data_availability: 'Tinggi (Didukung berkas perjanjian kerja bersama, risalah mediasi, dan rilis resmi serikat)',
      grassroots_impact: 'Sangat Tinggi pada ribuan keluarga pekerja',
      policy_potential: 'Bahan Hearing Terbuka Komisi IV DPRD Purwakarta.',
      suggested_angle: 'Evaluasi Implementasi Perda Ketenagakerjaan Lokal dan Perlindungan Buruh Kontrak KBI'
    },
    momentum_trend: {
      labels: ['18 Agu', '19 Agu', '20 Agu', '21 Agu', '22 Agu', '23 Agu', '24 Agu'],
      values: [28, 30, 45, 52, 60, 78, 85],
      percentage_change: '+38%',
      trend_status: 'Naik',
      ai_commentary: 'Konsolidasi serikat pekerja dan posko pengaduan buruh mendongkrak perhatian kanal berita lokal Purwakarta.'
    }
  },
  {
    id: 'issue-pwk-03',
    title: 'Sengketa Alih Fungsi Lahan Pertanian & Ancaman Penggusuran Petani Gurem Wanayasa',
    slug: 'sengketa-lahan-pertanian-petani-gurem-wanayasa',
    description: 'Maraknya alih fungsi lahan sawah produktif dan perkebunan rakyat menjadi kawasan komersial wisata tanpa analisis dampak lingkungan dan tanpa kepastian ganti rugi petani penggarap di Wanayasa.',
    category: 'Agraria & Lingkungan Hidup',
    location: 'Purwakarta',
    province: 'Jawa Barat',
    district: 'Kec. Wanayasa',
    status: 'Developing',
    priority_level: 'Tinggi',
    impact_score: 83,
    urgency_score: 80,
    momentum_score: 75,
    evidence_score: 81,
    credibility_score: 85,
    first_detected_at: '2026-08-02T10:00:00Z',
    last_updated_at: '2026-08-23T16:00:00Z',
    sources_count: 14,
    is_purwakarta_priority: true,
    summary_ai: {
      what_happened: 'Sebanyak 35 hektar lahan perkebunan dan sawah di kaki Gunung Burangrang wilayah Wanayasa beralih kepemilikan kepada pengembang swasta untuk proyek resort dan glamping, memicu protes puluhan petani penggarap tradisional.',
      why_important: 'Kecamatan Wanayasa merupakan lumbung hortikultura dan daerah tangkapan air vital Purwakarta. Alih fungsi lahan sawah dilindungi (LSD) mengancam kedaulatan pangan lokal dan meningkatkan risiko longsor.',
      who_is_affected: [
        'Petani penggarap dan buruh tani gurem Wanayasa',
        'Masyarakat hilir penerima suplai air bersih mata air Burangrang',
        'Konsumen produk pertanian lokal di pasar tradisional Purwakarta'
      ],
      key_stakeholders: [
        { category: 'Pemerintah', entities: ['Dinas Pangan dan Pertanian Purwakarta', 'BPN Purwakarta', 'Kecamatan Wanayasa'] },
        { category: 'Swasta', entities: ['Pengembang Resort Swasta'] },
        { category: 'Masyarakat', entities: ['Kelompok Tani Sadar Lestari Wanayasa', 'Aliansi Pemuda Peduli Agraria Purwakarta'] }
      ],
      unknown_gaps: [
        'Status perizinan Kesesuaian Kegiatan Pemanfaatan Ruang (KKPR) dari dinas tata ruang',
        'Validitas dokumen pelepasan hak garap tanah adat/desa'
      ]
    },
    marhaenism_analysis: {
      sosio_nasionalisme: 'Tanah untuk mereka yang menggarap! Hak dasar petani Marhaen atas alat produksi primer tanah adalah pilar utama ajaran Bung Karno.',
      sosio_demokrasi: 'Keputusan tata ruang tidak boleh tunduk pada oligarki properti dengan mengorbankan kaum tani pedesaan.',
      trisakti_perspective: 'Mandiri dalam pangan menuntut perlindungan mutlak terhadap Lahan Pertanian Pangan Berkelanjutan (LP2B).',
      pro_poor_advocacy_notes: 'Menyusun rekomendasi penegakan Perda Perlindungan LP2B dan memfasilitasi sertifikasi tanah reforma agraria untuk petani penggarap Wanayasa.',
      critical_questions: [
        'Apakah lokasi proyek glamping masuk dalam peta Lahan Sawah Dilindungi (LSD) Kementerian ATR/BPN?',
        'Bagaimana transparansi izin AMDAL dan kajian daya dukung lingkungan lereng Wanayasa?'
      ]
    },
    research_recommendation: {
      verdict: 'Sangat Layak',
      score: 90,
      relevance_notes: 'Isu inti ideologis Marhaenisme (konflik agraria rakyat tani vs kapital swasta).',
      urgency_notes: 'Alat berat mulai beroperasi meratakan tebing; advokasi moratorium mendesak dilakukan.',
      data_availability: 'Sedang-Tinggi (Peta tata ruang, aduan warga, rilis dinas terkait)',
      grassroots_impact: 'Tinggi bagi mata pencaharian puluhan keluarga petani',
      policy_potential: 'Dapat diajukan sebagai usulan audit kepatuhan RTRW Kabupaten Purwakarta.',
      suggested_angle: 'Konflik Agraria & Kedaulatan Pangan: Menyelamatkan Lahan Tani Wanayasa dari Komersialisasi'
    },
    momentum_trend: {
      labels: ['18 Agu', '19 Agu', '20 Agu', '21 Agu', '22 Agu', '23 Agu', '24 Agu'],
      values: [10, 15, 24, 38, 55, 68, 76],
      percentage_change: '+52%',
      trend_status: 'Naik',
      ai_commentary: 'Aksi penolakan warga dan audiensi kelompok tani dengan aparat desa menjadi sorotan media lokal.'
    }
  },
  {
    id: 'issue-pwk-04',
    title: 'Akses Pendidikan Vokasi, Kuota Beasiswa Daerah, dan Tingginya Pengangguran Usia Muda di Purwakarta',
    slug: 'akses-pendidikan-vokasi-pengangguran-muda-purwakarta',
    description: 'Disparitas antara kurikulum pendidikan kejuruan/vokasi lokal dengan kualifikasi industri manufaktur yang memicu paradoks tingginya angka pengangguran terbuka pemuda di wilayah berstatus kawasan industri besar.',
    category: 'Pendidikan & Kepemudaan',
    location: 'Purwakarta',
    province: 'Jawa Barat',
    district: 'Kec. Purwakarta',
    status: 'Monitoring',
    priority_level: 'Sedang',
    impact_score: 79,
    urgency_score: 74,
    momentum_score: 68,
    evidence_score: 83,
    credibility_score: 90,
    first_detected_at: '2026-06-20T10:00:00Z',
    last_updated_at: '2026-08-20T09:00:00Z',
    sources_count: 12,
    is_purwakarta_priority: true,
    summary_ai: {
      what_happened: 'BPS mencatat Tingkat Pengangguran Terbuka (TPT) Kabupaten Purwakarta masih berada pada angka 7,8%, didominasi lulusan SMA/SMK sederajat. Sementara itu, alokasi beasiswa pendidikan tinggi daerah bagi keluarga prasejahtera dinilai belum merata.',
      why_important: 'Bonus demografi pemuda Purwakarta berisiko menjadi bencana demografi jika tidak diiringi dengan peningkatan skill teknologi dan proteksi kesempatan kerja dari pemerintah daerah.',
      who_is_affected: [
        'Lulusan SMK/SMA usia 18-24 tahun di 17 kecamatan Purwakarta',
        'Mahasiswa prasejahtera di kampus-kampus lokal Purwakarta',
        'Keluarga kelas pekerja dan buruh harian'
      ],
      key_stakeholders: [
        { category: 'Pemerintah', entities: ['Dinas Pendidikan Purwakarta', 'Bappelitbangda Purwakarta', 'Balai Latihan Kerja (BLK) Disnaker'] },
        { category: 'Pendidikan & Pemuda', entities: ['Forum BEM Purwakarta', 'Dewan Pendidikan Purwakarta', 'GMNI Wastukancana'] }
      ],
      unknown_gaps: [
        'Evaluasi efektivitas serapan dana program link and match industri-SMK tahun anggaran sebelumnya'
      ]
    },
    marhaenism_analysis: {
      sosio_nasionalisme: 'Pendidikan adalah hak konstitusional rakyat untuk mencerdaskan kehidupan bangsa, bukan komoditas bisnis selektif.',
      sosio_demokrasi: 'Demokratisasi akses pendidikan tinggi dan vokasi bermutu bagi anak-anak kaum Marhaen.',
      trisakti_perspective: 'Membangun kepribadian dalam kebudayaan dan kemandirian SDM pemuda Indonesia.',
      pro_poor_advocacy_notes: 'Mendorong regulasi Perda Beasiswa Sarjana Desa dan kewajiban magang berbayar di seluruh industri Purwakarta.',
      critical_questions: [
        'Bagaimana alokasi anggaran APBD Purwakarta untuk peningkatan kapasitas BLK gratis?',
        'Mengapa perusahaan industri masih memprioritaskan rekrutmen pekerja dari luar daerah?'
      ]
    },
    research_recommendation: {
      verdict: 'Layak',
      score: 82,
      relevance_notes: 'Sangat relevan dengan basis gerakan mahasiswa dan kondisi pemuda Purwakarta.',
      urgency_notes: 'Isu struktural tahunan; perlu riset mendalam berbasis survei lulusan SMK.',
      data_availability: 'Tinggi (Data BPS, dokumen Renja Disdik, data BLK)',
      grassroots_impact: 'Tinggi terhadap mobilitas vertikal pemuda Marhaen',
      policy_potential: 'Draf Rekomendasi Roadmap Pendidikan Vokasi Inklusif Purwakarta.',
      suggested_angle: 'Mengurai Paradoks Kawasan Industri: Revitalisasi Vokasi & Akses Kerja Pemuda Lokal'
    },
    momentum_trend: {
      labels: ['18 Agu', '19 Agu', '20 Agu', '21 Agu', '22 Agu', '23 Agu', '24 Agu'],
      values: [30, 32, 34, 38, 40, 42, 45],
      percentage_change: '+12%',
      trend_status: 'Stabil',
      ai_commentary: 'Pembahasan stabil di kalangan forum mahasiswa dan seminar ketenagakerjaan daerah.'
    }
  },
  {
    id: 'issue-jbr-01',
    title: 'Evaluasi Keamanan Lalu Lintas, Penerangan Jalan, dan Titik Rawan Begal Jalur Pantura - Cikopo Jawa Barat',
    slug: 'keamanan-jalan-penerangan-pantura-cikopo-jabar',
    description: 'Meningkatnya laporan tindak kejahatan jalanan pada malam hari akibat minimnya Penerangan Jalan Umum (PJU) dan patroli kepolisian di jalur arteri penghubung Purwakarta - Karawang - Subang.',
    category: 'Keamanan Publik & Infrastruktur',
    location: 'Jawa Barat',
    province: 'Jawa Barat',
    district: 'Perbatasan Purwakarta - Karawang',
    status: 'Developing',
    priority_level: 'Sedang',
    impact_score: 77,
    urgency_score: 79,
    momentum_score: 72,
    evidence_score: 80,
    credibility_score: 84,
    first_detected_at: '2026-08-05T20:00:00Z',
    last_updated_at: '2026-08-24T18:00:00Z',
    sources_count: 15,
    summary_ai: {
      what_happened: 'Aparat gabungan Polres Purwakarta dan Karawang menggelar razia malam di jalur Cikopo - Cikampek setelah terjadi rentetan pembegalan terhadap buruh pabrik yang pulang shift malam.',
      why_important: 'Jalur arteri Cikopo merupakan urat nadi mobilitas ribuan buruh dan distribusi logistik antar-kabupaten di Jawa Barat.',
      who_is_affected: [
        'Buruh pabrik shift malam dan pengemudi ojek online',
        'Pengguna jalan antar-kota Purwakarta - Karawang - Subang',
        'Pelaku usaha kuliner malam di sepanjang rute'
      ],
      key_stakeholders: [
        { category: 'Aparat Keamanan', entities: ['Polda Jawa Barat', 'Polres Purwakarta', 'Polres Karawang'] },
        { category: 'Infrastruktur', entities: ['Dinas Perhubungan Prov. Jawa Barat', 'BPTD Kemenhub Wilayah IX'] },
        { category: 'Masyarakat', entities: ['Komunitas Ojol Pantura', 'Serikat Pekerja Penglaju'] }
      ],
      unknown_gaps: [
        'Jadwal pengadaan dan perbaikan lampu PJU ruas provinsi tahun 2026'
      ]
    },
    marhaenism_analysis: {
      sosio_nasionalisme: 'Rasa aman rakyat di ruang publik adalah kewajiban mutlak negara tanpa diskriminasi.',
      sosio_demokrasi: 'Aparatur keamanan wajib hadir melindungi pekerja kecil yang bertaruh nyawa di jalanan malam hari.',
      trisakti_perspective: 'Keamanan ketertiban umum menopang kelancaran sirkulasi ekonomi kerakyatan.',
      pro_poor_advocacy_notes: 'Mendesak Dishub Jabar memasang PJU solar cell di titik buta dan kepolisian membentuk pos pantau buruh malam.',
      critical_questions: [
        'Berapa persentase lampu PJU yang mati di jalur penghubung antar-wilayah industri?',
        'Bagaimana sistem respons cepat hotline darurat kepolisian di perbatasan daerah?'
      ]
    },
    research_recommendation: {
      verdict: 'Layak',
      score: 78,
      relevance_notes: 'Relevan dengan keselamatan fisik buruh dan kader yang beraktivitas malam hari.',
      urgency_notes: 'Tinggi karena menyangkut keselamatan jiwa korban pembegalan.',
      data_availability: 'Sedang (Laporan kepolisian, aduan warga medsos, liputan media kriminal)',
      grassroots_impact: 'Tinggi bagi komunitas pekerja penglaju',
      policy_potential: 'Petisi Audit Fasilitas Keselamatan Jalan Provinsi Jawa Barat.',
      suggested_angle: 'Krisis Keamanan Ruang Publik: Urgensi Infrastruktur Terpadu bagi Buruh Penglaju'
    },
    momentum_trend: {
      labels: ['18 Agu', '19 Agu', '20 Agu', '21 Agu', '22 Agu', '23 Agu', '24 Agu'],
      values: [20, 25, 30, 42, 50, 65, 73],
      percentage_change: '+29%',
      trend_status: 'Naik',
      ai_commentary: 'Viralnya rekaman video amatir aksi begal di media sosial memicu atensi publik luas.'
    }
  },
  {
    id: 'issue-nas-01',
    title: 'Kesiapsiagaan Pencegahan Karhutla Terpadu & Perlindungan Wilayah Adat Musim Kemarau 2026',
    slug: 'pencegahan-karhutla-terpadu-wilayah-adat-2026',
    description: 'Pemantauan titik panas (hotspot) BMKG di Sumatra dan Kalimantan serta pengawasan ketat terhadap izin konsesi perkebunan sawit dan HTI di atas lahan gambut menjelang puncak kemarau 2026.',
    category: 'Lingkungan Hidup & Kebencanaan',
    location: 'Nasional',
    province: 'Nasional (Sumatra, Kalimantan, Riau)',
    status: 'Developing',
    priority_level: 'Tinggi',
    impact_score: 93,
    urgency_score: 88,
    momentum_score: 80,
    evidence_score: 90,
    credibility_score: 95,
    first_detected_at: '2026-07-01T08:00:00Z',
    last_updated_at: '2026-08-25T08:00:00Z',
    sources_count: 31,
    summary_ai: {
      what_happened: 'KLHK bersama BNPB dan TNI-Polri mengaktifkan Satgas Karhutla Terpadu menyusul deteksi 412 titik panas di Riau, Jambi, Sumsel, dan Kalbar. Koalisi masyarakat sipil menuntut penegakan hukum pidana korporasi pembakar lahan gambut.',
      why_important: 'Bencana kabut asap mengancam kesehatan pernapasan jutaan warga, memicu kerugian ekonomi miliaran dolar, dan melemahkan komitmen penurunan emisi iklim Indonesia.',
      who_is_affected: [
        'Masyarakat adat dan penduduk pedalaman di sekitar kawasan hutan gambut',
        'Anak-anak dan lansia rentan ISPA di kota-kota terdampak kabut asap',
        'Hubungan diplomasi lingkungan regional Asia Tenggara'
      ],
      key_stakeholders: [
        { category: 'Pemerintah Pusat', entities: ['KLHK', 'BNPB', 'BMKG', 'Badan Restorasi Gambut dan Mangrove (BRGM)'] },
        { category: 'Korporasi', entities: ['Gabungan Pengusaha Kelapa Sawit (GAPKI)', 'Asosiasi Pengusaha Hutan (APHI)'] },
        { category: 'Masyarakat Sipil', entities: ['WALHI', 'Aliansi Masyarakat Adat Nusantara (AMAN)', 'DPP GMNI'] }
      ],
      unknown_gaps: [
        'Daftar sanksi administratif terbaru terhadap 12 perusahaan terindikasi hotspot dalam konsesi'
      ]
    },
    marhaenism_analysis: {
      sosio_nasionalisme: 'Bumi, air, dan kekayaan alam yang terkandung di dalamnya dikuasai oleh negara dan dipergunakan untuk sebesar-besar kemakmuran rakyat, bukan dirusak segelintir korporasi oligarki.',
      sosio_demokrasi: 'Keadilan antargenerasi menuntut penghentian perusakan ekologis hutan hujan tropis nusantara.',
      trisakti_perspective: 'Kedaulatan lingkungan dan martabat bangsa tidak boleh digadaikan demi ekspor komoditas ekstraktif kotor.',
      pro_poor_advocacy_notes: 'Menolak kriminalisasi peladang tradisional lokal yang membuka lahan dengan kearifan adat bakar terkendali, fokuskan penindakan pada korporasi skala besar.',
      critical_questions: [
        'Apakah instrumen denda pemulihan lingkungan ekologis dieksekusi secara transparan ke kas negara?',
        'Bagaimana alokasi posko kesehatan oksigen gratis bagi warga miskin di zona merah asap?'
      ]
    },
    research_recommendation: {
      verdict: 'Sangat Layak',
      score: 95,
      relevance_notes: 'Isu strategis nasional dengan dampak ekologis dan kedaulatan sumber daya alam fundamental.',
      urgency_notes: 'Puncak musim kemarau diprediksi September 2026; pemantauan real-time satelit krusial.',
      data_availability: 'Sangat Tinggi (Data satelit MODIS/VIIRS LAPAN-BRIN, laporan BNPB, SIPONGI KLHK)',
      grassroots_impact: 'Ekstrem pada jutaan jiwa',
      policy_potential: 'Position Paper DPP/Komisariat GMNI untuk Komisi IV DPR RI.',
      suggested_angle: 'Penegakan Hukum Korporasi & Pengakuan Hak Peladang Tradisional dalam Mitigasi Karhutla'
    },
    momentum_trend: {
      labels: ['18 Agu', '19 Agu', '20 Agu', '21 Agu', '22 Agu', '23 Agu', '24 Agu'],
      values: [40, 48, 55, 62, 70, 82, 91],
      percentage_change: '+42%',
      trend_status: 'Naik',
      ai_commentary: 'Rilis data hotspot harian BMKG dan penetapan status siaga darurat di 4 provinsi memicu pemberitaan nasional.'
    }
  },
  {
    id: 'issue-nas-02',
    title: 'Mitigasi Pasca-Bencana Gempa, Hunian Tetap, dan Kedaulatan Logistik Pesisir NTT 2026',
    slug: 'mitigasi-bencana-gempa-huntap-logistik-ntt-2026',
    description: 'Pemantauan percepatan pembangunan Hunian Tetap (Huntap) tahan gempa, ketersediaan air bersih, dan transparansi distribusi bantuan sosial bagi korban gempa magnitudo 6,4 pesisir Flores Timur - NTT.',
    category: 'Kebencanaan & Kesejahteraan Sosial',
    location: 'Nasional',
    province: 'Nusa Tenggara Timur',
    status: 'Confirmed',
    priority_level: 'Tinggi',
    impact_score: 87,
    urgency_score: 92,
    momentum_score: 71,
    evidence_score: 91,
    credibility_score: 94,
    first_detected_at: '2026-07-28T04:00:00Z',
    last_updated_at: '2026-08-24T12:00:00Z',
    sources_count: 22,
    summary_ai: {
      what_happened: 'Pemerintah pusat melalui Kementerian PUPR dan BNPB memulai tahap konstruksi 650 unit Huntap bagi penyintas gempa NTT. Relawan mengabarkan adanya kendala logistik air bersih dan fasilitas sanitasi darurat di beberapa titik pengungsian terpencil.',
      why_important: 'Pembangunan kembali pasca-bencana di wilayah kepulauan terluar menuntut kecepatan dan keadilan distribusi agar masyarakat tidak terjebak kemiskinan ekstrem.',
      who_is_affected: [
        'Ribuan warga penyintas gempa di Flores Timur dan pulau sekitarnya',
        'Anak-anak sekolah di tenda darurat belajar',
        'Nelayan pesisir yang kehilangan perahu dan dermaga tambat'
      ],
      key_stakeholders: [
        { category: 'Pemerintah', entities: ['BNPB', 'Kementerian PUPR', 'Pemprov NTT', 'Kemensos'] },
        { category: 'Relawan & Kemanusiaan', entities: ['Palang Merah Indonesia', 'Posko Solidaritas Mahasiswa Peduli NTT'] }
      ],
      unknown_gaps: [
        'Rincian timeline serah terima kunci Huntap tahap pertama',
        'Skema bantuan modal usaha bagi nelayan pesisir terdampak'
      ]
    },
    marhaenism_analysis: {
      sosio_nasionalisme: 'Solidaritas kebangsaan tidak mengenal batas pulau. Saudara kita di pelosok NTT berhak atas standar pemulihan yang setara dengan wilayah pusat.',
      sosio_demokrasi: 'Penyaluran bantuan kemanusiaan harus bersih dari rente dan politisasi elektoral.',
      trisakti_perspective: 'Membangun kembali desa tangguh bencana berbasis kearifan lokal rumah tahan gempa.',
      pro_poor_advocacy_notes: 'Mengorganisir donasi solidaritas kader GMNI dan mengawal transparansi dana rekonstruksi bencana.',
      critical_questions: [
        'Apakah proses relokasi Huntap memperhatikan akses mata pencaharian nelayan ke laut?',
        'Bagaimana sistem jaminan kesehatan dan trauma healing bagi anak-anak pengungsi?'
      ]
    },
    research_recommendation: {
      verdict: 'Layak',
      score: 86,
      relevance_notes: 'Isu kemanusiaan dan pemerataan pembangunan wilayah timur Indonesia.',
      urgency_notes: 'Musim hujan akhir tahun berpotensi menghambat konstruksi Huntap darurat.',
      data_availability: 'Tinggi (Laporan resmi BNPB, citra satelit Badan Informasi Geospasial, rilis relawan)',
      grassroots_impact: 'Sangat Tinggi pada ribuan keluarga pengungsi',
      policy_potential: 'Rekomendasi Kebijakan Mitigasi Wilayah Kepulauan Terpencil.',
      suggested_angle: 'Keadilan Tata Kelola Rehabilitasi Pasca-Bencana di Kawasan Pesisir Timur Indonesia'
    },
    momentum_trend: {
      labels: ['18 Agu', '19 Agu', '20 Agu', '21 Agu', '22 Agu', '23 Agu', '24 Agu'],
      values: [70, 68, 65, 62, 58, 55, 54],
      percentage_change: '-12%',
      trend_status: 'Menurun',
      ai_commentary: 'Perhatian media arus utama mulai menurun seiring selesainya masa tanggap darurat, namun fase rekonstruksi justru membutuhkan pengawasan lebih ketat.'
    }
  }
];
