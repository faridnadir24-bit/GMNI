import { TimelineEvent } from '@/types';

export const mockTimelineEvents: TimelineEvent[] = [
  // Jatiluhur Timeline
  {
    id: 'tl-01',
    issue_id: 'issue-pwk-01',
    date: '24 JUL 2026',
    title: 'Deteksi Awal Peningkatan KJA Liar',
    description: 'Citra satelit dan drone pantau PJT II mendeteksi pertambahan 450 unit petak KJA baru di area terlarang mendekati spillway bendungan.',
    event_type: 'discovery',
    source_ref: 'Laporan Drone Pantau PJT II'
  },
  {
    id: 'tl-02',
    issue_id: 'issue-pwk-01',
    date: '28 JUL 2026',
    title: 'Rapat Koordinasi Pengamanan Objek Vital',
    description: 'PJT II menggelar rapat koordinasi tertutup bersama Polres Purwakarta dan Kodim 0619 terkait pengamanan fasilitas vital nasional.',
    event_type: 'official_statement',
    source_ref: 'Rilis Bersama PJT II & Kodim'
  },
  {
    id: 'tl-03',
    issue_id: 'issue-pwk-01',
    date: '05 AGU 2026',
    title: 'Surat Edaran Batas Waktu Pembongkaran Mandiri',
    description: 'Surat peringatan pertama dilayangkan kepada pemilik KJA tanpa izin untuk membongkar secara mandiri dalam tempo 14 hari kerja.',
    event_type: 'policy_action',
    source_ref: 'Surat Edaran No. 420/PJT-II'
  },
  {
    id: 'tl-04',
    issue_id: 'issue-pwk-01',
    date: '14 AGU 2026',
    title: 'Audiensi Akbar Petani KJA di Gedung DPRD',
    description: 'Ratusan pembudidaya ikan berorasi di depan kantor DPRD Purwakarta menuntut relokasi tertata dan bantuan pakan mandiri.',
    event_type: 'public_protest',
    source_ref: 'Liputan Radar Purwakarta'
  },
  {
    id: 'tl-05',
    issue_id: 'issue-pwk-01',
    date: '21 AGU 2026',
    title: 'Pemberitaan Media Nasional & KemenPUPR Merespons',
    description: 'Menteri PUPR memberikan pernyataan bahwa penataan KJA Jatiluhur harus seimbang antara ketahanan air Jakarta dan kesejahteraan rakyat lokal.',
    event_type: 'media_surge',
    source_ref: 'Siaran Pers KemenPUPR'
  },
  {
    id: 'tl-06',
    issue_id: 'issue-pwk-01',
    date: '24 AGU 2026',
    title: 'Kajian Awal Tim Bidang SosPol GMNI Wastukancana',
    description: 'Tim kajian GMNI menerjunkan relawan investigasi ke 4 desa pesisir waduk untuk mendata profil kepemilikan petak ikan petani Marhaen.',
    event_type: 'official_statement',
    source_ref: 'Dokumen Catatan Lapangan GMNI'
  },

  // Buruh KBI Timeline
  {
    id: 'tl-07',
    issue_id: 'issue-pwk-02',
    date: '15 JUL 2026',
    title: 'Penerbitan Surat PHK Sepihak 280 Buruh',
    description: 'Buruh kontrak shift pagi menerima amplop pemberitahuan pemutusan kontrak kerja mendadak tanpa kompensasi pesangon.',
    event_type: 'discovery',
    source_ref: 'Laporan Posko Pengaduan Buruh'
  },
  {
    id: 'tl-08',
    issue_id: 'issue-pwk-02',
    date: '22 JUL 2026',
    title: 'Aksi Solidaritas Depan Gerbang Utama Kawasan Industri',
    description: 'Aksi damai serikat pekerja menuntut pembatalan PHK sepihak dan transparansi laporan keuangan audit independen pabrik.',
    event_type: 'public_protest',
    source_ref: 'Kanal Berita Buruh Pasundan'
  },
  {
    id: 'tl-09',
    issue_id: 'issue-pwk-02',
    date: '18 AGU 2026',
    title: 'Disnakertrans Melayangkan Panggilan Tripartit Resmi',
    description: 'Pemerintah Kabupaten Purwakarta menjadwalkan sidang mediasi hubungan industrial wajib bagi kedua pihak.',
    event_type: 'policy_action',
    source_ref: 'Surat Panggilan Disnakertrans Kab. Purwakarta'
  }
];
