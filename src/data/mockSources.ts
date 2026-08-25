import { Source } from '@/types';

export const mockSources: Source[] = [
  // Jatiluhur Sources
  {
    id: 'src-01',
    issue_id: 'issue-pwk-01',
    title: 'Surat Edaran Direksi Penataan Zona Keramba Jaring Apung Waduk Jatiluhur',
    url: 'https://jasatirta2.co.id/regulasi/se-penataan-kja-2026',
    source_name: 'Perum Jasa Tirta II (PJT II)',
    source_type: 'Official Source',
    credibility_score: 96,
    published_at: '2026-08-10T10:00:00Z',
    author_or_institution: 'Direksi Pengelolaan Sumber Daya Air PJT II',
    summary: 'Dokumen penetapan kuota resmi KJA, zonasi steril bendungan utama, dan jadwal pelaksanaan penertiban gabungan bersama aparat daerah.'
  },
  {
    id: 'src-02',
    issue_id: 'issue-pwk-01',
    title: 'Pengamanan Objek Vital Nasional Bendungan Ir. H. Djuanda Jatiluhur',
    url: 'https://polres.purwakarta.jabar.polri.go.id/berita/pengamanan-obvitnas-jatiluhur',
    source_name: 'Polres Purwakarta',
    source_type: 'Official Source',
    credibility_score: 94,
    published_at: '2026-08-15T14:30:00Z',
    author_or_institution: 'Seksi Humas Polres Purwakarta',
    summary: 'Laporan pengerahan personel pengamanan patroli perairan Satpolairud di seputar fasilitas pembangkit listrik dan saluran pelimpah air.'
  },
  {
    id: 'src-03',
    issue_id: 'issue-pwk-01',
    title: 'Jeritan Petani Ikan Jatiluhur: Tuntut Moratorium Penertiban Tanpa Solusi Usaha',
    url: 'https://pasundan.news/jatiluhur/petani-kja-tuntut-keadilan',
    source_name: 'Radar Purwakarta',
    source_type: 'Local Media',
    credibility_score: 78,
    published_at: '2026-08-18T08:15:00Z',
    author_or_institution: 'Redaksi Radar Purwakarta',
    summary: 'Liputan investigasi jurnalis lokal mengenai keluhan puluhan peternak ikan kecil yang terancam kehilangan mata pencaharian utama.'
  },
  {
    id: 'src-04',
    issue_id: 'issue-pwk-01',
    title: 'Hasil Uji Kualitas Air Waduk Jatiluhur Triwulan II 2026',
    url: 'https://dlh.purwakartakab.go.id/laporan/kualitas-air-jatiluhur-2026',
    source_name: 'Dinas Lingkungan Hidup Kab. Purwakarta',
    source_type: 'Official Source',
    credibility_score: 92,
    published_at: '2026-07-30T11:00:00Z',
    author_or_institution: 'Laboratorium Lingkungan DLH Purwakarta',
    summary: 'Data saintifik kadar sedimen pakan ikan, nutrien nitrogen, fosfat, dan dampaknya terhadap turbiditas air baku waduk.'
  },
  {
    id: 'src-05',
    issue_id: 'issue-pwk-01',
    title: 'Aspirasi Paguyuban Pembudidaya Ikan dalam Rapat Dengar Pendapat DPRD',
    url: 'https://dprd.purwakartakab.go.id/berita/rdp-kja-jatiluhur',
    source_name: 'Sekretariat DPRD Kab. Purwakarta',
    source_type: 'Official Source',
    credibility_score: 90,
    published_at: '2026-08-21T15:00:00Z',
    author_or_institution: 'Humas Sekretariat DPRD Purwakarta',
    summary: 'Risalah resmi pertemuan Komisi II DPRD dengan perwakilan petani KJA dan perwakilan manajemen PJT II.'
  },
  {
    id: 'src-06',
    issue_id: 'issue-pwk-01',
    title: 'Video Viral: Warga Rekam Situasi Penertiban Rakit KJA di Teluk Servis',
    url: 'https://instagram.com/p/viral_purwakarta_kja_alert',
    source_name: 'Instagram @infopurwakarta_real',
    source_type: 'Social Media',
    credibility_score: 48,
    published_at: '2026-08-22T09:30:00Z',
    author_or_institution: 'Akun Publik Komunitas Warga',
    summary: 'Video amatir rekaman interaksi antara petugas patroli air dan pembudidaya ikan. Catatan: indikator sentimen publik, bukan dokumen legal.'
  },

  // KBI Purwakarta Sources
  {
    id: 'src-07',
    issue_id: 'issue-pwk-02',
    title: 'Risalah Perundingan Bipartit PHK Buruh Manufaktur KBI',
    url: 'https://fspmi-purwakarta.org/dokumen/risalah-bipartit-pt-mki',
    source_name: 'PC FSPMI Kabupaten Purwakarta',
    source_type: 'Local Media',
    credibility_score: 82,
    published_at: '2026-08-16T13:00:00Z',
    author_or_institution: 'Biro Advokasi Hukum FSPMI Purwakarta',
    summary: 'Salinan dokumen perundingan hak pesangon dan pelanggaran perjanjian kerja waktu tertentu (PKWT).'
  },
  {
    id: 'src-08',
    issue_id: 'issue-pwk-02',
    title: 'Pemberitahuan Mediasi Hubungan Industrial Disnakertrans',
    url: 'https://disnaker.purwakartakab.go.id/mediasi/ag-08-2026',
    source_name: 'Disnakertrans Kab. Purwakarta',
    source_type: 'Official Source',
    credibility_score: 95,
    published_at: '2026-08-18T10:00:00Z',
    author_or_institution: 'Mediator Hubungan Industrial Pemkab Purwakarta',
    summary: 'Surat resmi penetapan sidang tripartit antara serikat buruh dan manajemen kawasan industri Bukit Indah.'
  },
  {
    id: 'src-09',
    issue_id: 'issue-pwk-02',
    title: 'Menilik Dinamika Ketenagakerjaan di Koridor Industri Jawa Barat',
    url: 'https://kompas.id/baca/ekonomi/dinamika-buruh-purwakarta-karawang',
    source_name: 'Harian Kompas',
    source_type: 'Established Media',
    credibility_score: 89,
    published_at: '2026-08-22T06:00:00Z',
    author_or_institution: 'Desk Ekonomi Kompas',
    summary: 'Analisis komparatif tantangan efisiensi manufaktur, biaya energi, dan perlindungan daya beli buruh kawasan industri.'
  },

  // Karhutla Sources
  {
    id: 'src-10',
    issue_id: 'issue-nas-01',
    title: 'Laporan Harian Sebaran Titik Panas Hotspot Indonesia Sistem SIPONGI',
    url: 'https://sipongi.menlhk.go.id/laporan-harian/2026-08-24',
    source_name: 'Kementerian Lingkungan Hidup dan Kehutanan (KLHK)',
    source_type: 'Official Source',
    credibility_score: 98,
    published_at: '2026-08-24T06:00:00Z',
    author_or_institution: 'Ditjen Pengendalian Perubahan Iklim KLHK',
    summary: 'Data geospasial titik api, indeks kelembaban tanah gambut, dan status siaga darurat udara di 6 provinsi prioritas.'
  },
  {
    id: 'src-11',
    issue_id: 'issue-nas-01',
    title: 'Kesiapan Satgas Udara dan Water Bombing BNPB Tangani Titik Api',
    url: 'https://bnpb.go.id/siaran-pers/satgas-karhutla-2026',
    source_name: 'Badan Nasional Penanggulangan Bencana (BNPB)',
    source_type: 'Official Source',
    credibility_score: 97,
    published_at: '2026-08-23T11:00:00Z',
    author_or_institution: 'Pusat Data Informasi dan Komunikasi Bencana BNPB',
    summary: 'Pengerahan 18 helikopter water bombing dan teknologi modifikasi cuaca hujan buatan di wilayah rawan kebakaran hutan.'
  },
  {
    id: 'src-12',
    issue_id: 'issue-nas-01',
    title: 'Laporan Lapangan WALHI: Temuan Titik Hotspot di Dalam Konsesi Sawit',
    url: 'https://walhi.or.id/laporan-investigasi-karhutla-2026',
    source_name: 'WALHI Eksekutif Nasional',
    source_type: 'Established Media',
    credibility_score: 86,
    published_at: '2026-08-21T09:00:00Z',
    author_or_institution: 'Divisi Kampanye Hutan dan Perkebunan WALHI',
    summary: 'Overlay citra satelit konsesi HGU perusahaan kelapa sawit dengan titik koordinat sebaran api kebakaran lahan.'
  }
];
