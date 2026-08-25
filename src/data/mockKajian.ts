import { BahanKajianDocument } from '@/types';

export const mockKajianDocs: BahanKajianDocument[] = [
  {
    id: 'kajian-pwk-01',
    issue_id: 'issue-pwk-01',
    issue_title: 'Keamanan, Zonasi KJA, dan Pengawasan Kawasan Objek Vital Waduk Jatiluhur',
    title: 'Keadilan Ekologis dan Perlindungan Petani Ikan Tradisional dalam Tata Kelola Objek Vital Waduk Jatiluhur',
    subtitle: 'Naskah Kebijakan & Kerangka Advokasi Bidang Sosial Politik GMNI Komisariat Wastukancana Purwakarta',
    author: 'Tim Riset & Advokasi Bidang SosPol GMNI Wastukancana',
    komisariat: 'GMNI Komisariat Wastukancana – Purwakarta',
    date_created: '2026-08-24',
    status: 'Final Kajian',
    sections: {
      latar_belakang: 'Waduk Ir. H. Djuanda (Jatiluhur) adalah infrastruktur strategis nasional yang menopang ketahanan pangan 240.000 hektar sawah, pasokan 80% air baku DKI Jakarta, dan pembangkitan energi bersih. Namun, penumpukan Keramba Jaring Apung (KJA) liar yang ditengarai dikuasai pemodal non-lokal memicu degradasi kualitas air dan pendangkalan waduk. Rencana penertiban sepihak berisiko melindas hak hidup nelayan gurem lokal Purwakarta jika tidak disertai transparansi kuota dan jaminan alih profesi.',
      rumusan_masalah: [
        'Bagaimana relasi kuasa kepemilikan petak KJA antara pemodal besar luar daerah dan petani ikan gurem lokal Purwakarta?',
        'Sejauh mana implementasi tanggung jawab sosial (TJSL/CSR) dan bagi hasil air permukaan dialokasikan untuk pemberdayaan masyarakat pesisir waduk?',
        'Apa rumusan alternatif kebijakan penataan yang menjamin kelestarian ekosistem tanpa memiskinkan rakyat pekerja danau?'
      ],
      data_dan_fakta: [
        'Kapasitas daya dukung ideal waduk adalah 4.000 petak KJA, namun realitas lapangan mencapai lebih dari 20.000 petak aktif.',
        'DLH Purwakarta mencatat beban limbah sisa pakan ikan (pelet) mencapai puluhan ton per hari di zona dasar bendungan.',
        'Lebih dari 450 kepala keluarga nelayan tradisional menggantungkan 100% mata pencaharian harian pada budidaya ikan air tawar Jatiluhur.'
      ],
      kronologi_singkat: [
        '24 Juli 2026: Pantauan drone PJT II mendeteksi eskalasi petak baru.',
        '05 Agustus 2026: Surat Edaran penertiban mandiri diterbitkan.',
        '14 Agustus 2026: Audiensi ratusan petani KJA di DPRD Purwakarta menuntut perlindungan nelayan gurem.',
        '21 Agustus 2026: MenPUPR menegaskan penataan wajib berkeadilan sosial.'
      ],
      pihak_terkait: [
        { nama: 'Perum Jasa Tirta II (PJT II)', peran: 'Pengelola Objek Vital', posisi: 'Menuntut penegakan batas steril bendungan' },
        { nama: 'Paguyuban Petani KJA', peran: 'Organisasi Produsen Rakyat', posisi: 'Menuntut perlindungan kuota bagi warga lokal' },
        { nama: 'DPRD & Pemkab Purwakarta', peran: 'Regulator & Pengawas Daerah', posisi: 'Memfasilitasi mediasi dan skema kompensasi' },
        { nama: 'GMNI Wastukancana', peran: 'Kader Pemikir & Pendamping Rakyat', posisi: 'Mengawal advokasi berbasis data dan kedaulatan Marhaen' }
      ],
      analisis_sosial_politik: 'Secara struktural, konflik Jatiluhur adalah cerminan ketimpangan penguasaan modal. Pemodal besar memanfaatkan warga lokal sebagai buruh penjaga keramba dengan upah harian tanpa perlindungan sosial. Pendekatan penertiban yang hanya mengandalkan represi aparat keamanan tanpa audit kepemilikan modal justru akan memindahkan masalah ke pengangguran baru dan kemiskinan perdesaan.',
      perspektif_marhaenisme: 'Berdasarkan asas Marhaenisme Bung Karno, kaum tani dan nelayan kecil adalah pilar kekuatan produksi nasional yang tidak boleh ditindas oleh pemodal komprador maupun birokrasi yang abai. Sosio-Nasionalisme menempatkan air sebagai kedaulatan bangsa untuk kemakmuran rakyat, sedangkan Sosio-Demokrasi mewajibkan pengambilan keputusan tata ruang melibatkan partisipasi mufakat kaum Marhaen pesisir.',
      dampak_masyarakat: 'Ketiadaan zonasi berkeadilan akan memicu kepunahan nelayan tradisional lokal Purwakarta, memperparah polusi air Jakarta, dan memicu ketegangan sosial berkepanjangan di 5 kecamatan lingkar danau.',
      alternatif_kebijakan: [
        'Pemberlakuan e-Zonasi dan Kartu Nelayan Jatiluhur berbasis NIK warga lokal dengan batas kepemilikan maksimal 4 petak per KK.',
        'Moratorium dan penyitaan petak KJA milik korporasi/pemodal besar non-Purwakarta yang melanggar batas kuota.',
        'Pembentukan Koperasi Nelayan Mandiri yang difasilitasi modal usaha pakan alternatif berbasis maggot oleh BUMD/PJT II.',
        'Pengalihan sebagian nelayan ke sektor budidaya perikanan darat sistem bioflok dan ekowisata perairan terpadu.'
      ],
      rekomendasi_advokasi: [
        'Mendorong Fraksi-Fraksi DPRD Purwakarta membentuk Pansus Penataan KJA Berkeadilan.',
        'Menggelar Mimbar Akademik Terbuka bersama civitas akademika kampus Wastukancana, PJT II, dan asosiasi nelayan.',
        'Membuka Posko Bantuan Advokasi Hukum dan Konsolidasi Data Lapangan GMNI untuk pendampingan kaum tani nelayan.'
      ],
      daftar_pustaka: [
        { title: 'Laporan Status Lingkungan Hidup Waduk Jatiluhur 2026', source: 'Dinas Lingkungan Hidup Kab. Purwakarta', year: '2026' },
        { title: 'Kajian Daya Dukung dan Daya Tampung Beban Pencemaran Danau', source: 'Puslitbang SDA Kementerian PUPR', year: '2025' },
        { title: 'Kapitalisme dan Hak Atas Air di Indonesia: Perspektif Marhaenis', source: 'Pustaka SosPol GMNI Press', year: '2024' }
      ]
    }
  },
  {
    id: 'kajian-pwk-02',
    issue_id: 'issue-pwk-02',
    issue_title: 'Perlindungan Hak Buruh, Status Outsourcing, dan Ancaman PHK di Kawasan Industri Bukit Indah (KBI)',
    title: 'Evaluasi Implementasi Perda Ketenagakerjaan dan Gugatan atas Fleksibilitas Kerja Murah di Kawasan Industri Purwakarta',
    subtitle: 'Kajian Kebijakan Hak-Hak Normatif Buruh Industri Manufaktur',
    author: 'Biro Advokasi Perburuhan & Kajian Strategis GMNI Wastukancana',
    komisariat: 'GMNI Komisariat Wastukancana – Purwakarta',
    date_created: '2026-08-25',
    status: 'Policy Brief',
    sections: {
      latar_belakang: 'Purwakarta sebagai salah satu episentrum industri manufaktur nasional menghadapi persoalan akut degradasi kepastian kerja buruh akibat penyalahgunaan status Perjanjian Kerja Waktu Tertentu (PKWT) berkedok outsourcing.',
      rumusan_masalah: [
        'Bagaimana celah hukum UU Ketenagakerjaan dimanfaatkan vendor nakal untuk memangkas hak pesangon buruh kontrak?',
        'Mengapa kuota 60% penyerapan tenaga kerja lokal Purwakarta kerap diabaikan manajemen korporasi?',
        'Langkah konkrit apa yang dapat diambil Pemerintah Daerah untuk melindungi kepastian kerja warganya?'
      ],
      data_dan_fakta: [
        'Lebih dari 40% tenaga kerja di koridor industri Bungursari berstatus kontrak jangka pendek di bawah 1 tahun.',
        'Terdapat aduan 280 buruh PT MKI yang mengalami PHK tanpa proses mediasi bipartit yang memadai.',
        'Indeks upah riil buruh manufaktur Purwakarta tertekan oleh kenaikan harga bahan pokok sebesar 12% year-on-year.'
      ],
      kronologi_singkat: [
        '15 Juli 2026: Surat PHK sepihak diedarkan manajemen pabrik.',
        '22 Juli 2026: Aksi damai solidaritas buruh di gerbang KBI.',
        '18 Agustus 2026: Panggilan resmi mediasi tripartit Disnakertrans.'
      ],
      pihak_terkait: [
        { nama: 'Disnakertrans Kab. Purwakarta', peran: 'Pengawas Ketenagakerjaan', posisi: 'Mediator hubungan industrial' },
        { nama: 'Serikat Buruh FSPMI & KASBI', peran: 'Perwakilan Pekerja', posisi: 'Menuntut pencabutan PHK sepihak & audit vendor' },
        { nama: 'APINDO Purwakarta', peran: 'Asosiasi Pengusaha', posisi: 'Mempertahankan fleksibilitas operasional efisiensi' }
      ],
      analisis_sosial_politik: 'Sistem kerja kontrak abadi menciptakan ketidakpastian eksistensial bagi buruh, melemahkan posisi tawar serikat, dan memutus rantai kesejahteraan antargenerasi keluarga pekerja di Purwakarta.',
      perspektif_marhaenisme: 'Marhaenisme menentang penghisapan manusia atas manusia (exploitation de l\'homme par l\'homme). Buruh bukan sekadar faktor produksi yang dapat dibuang semena-mena saat keuntungan berkurang.',
      dampak_masyarakat: 'Menurunnya daya beli lokal dan meningkatnya kerentanan kemiskinan perkotaan di sekitar kantong-kantong industri.',
      alternatif_kebijakan: [
        'Pembentukan Satgas Terpadu Pengawasan Ketenagakerjaan Pemkab - Serikat Buruh - Mahasiswa.',
        'Pemberian sanksi pencabutan izin operasional bagi LPTK/Vendor outsourcing yang melanggar standar UMK dan jaminan BPJS.',
        'Insentif pajak daerah bagi industri yang mempekerjakan buruh lokal dengan status karyawan tetap (PKWTT).'
      ],
      rekomendasi_advokasi: [
        'Menginisiasi Posko Konseling Hukum Ketenagakerjaan GMNI untuk buruh terdampak PHK.',
        'Mengajukan tuntutan audit kepatuhan Perda Ketenagakerjaan dalam Rapat Kerja DPRD Purwakarta.'
      ],
      daftar_pustaka: [
        { title: 'Statistik Ketenagakerjaan Kabupaten Purwakarta 2025/2026', source: 'BPS Kab. Purwakarta', year: '2026' },
        { title: 'Manifesto Kaum Buruh dan Pemikiran Sosio-Demokrasi Sukarno', source: 'Koleksi Dokumen Sejarah GMNI', year: '2023' }
      ]
    }
  }
];
