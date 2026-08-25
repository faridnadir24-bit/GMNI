import { Signal } from '@/types';

export const mockSignals: Signal[] = [
  {
    id: 'sig-01',
    issue_id: 'issue-pwk-01',
    platform: 'Instagram',
    content: '"Tolong dengarkan suara nelayan kecil Jatiluhur! Kami cuma cari makan dari 2 petak kolam, jangan disamakan dengan bos-bos pemilik 100 kolam yang punya mobil mewah!"',
    timestamp: '2 jam yang lalu',
    engagement: {
      likes: 1840,
      shares: 420,
      comments: 312
    },
    sentiment: 'Kritis / Resah',
    growth_rate: '+32%',
    keywords: ['#KJAJatiluhur', '#PurwakartaTerkini', '#PetaniIkan', '#BupatiPurwakarta'],
    is_verified_fact: false,
    location_tag: 'Jatiluhur, Purwakarta'
  },
  {
    id: 'sig-02',
    issue_id: 'issue-pwk-01',
    platform: 'TikTok',
    content: 'Video kompilasi warga memperlihatkan kondisi keruhnya air tepi waduk dan petugas patroli berseragam yang sedang menempelkan stiker peringatan di rakit bambu.',
    timestamp: '5 jam yang lalu',
    engagement: {
      likes: 8750,
      shares: 1940,
      comments: 680
    },
    sentiment: 'Marah / Protes',
    growth_rate: '+51%',
    keywords: ['#wadukjatiluhur', '#infopurwakarta', '#fyp', '#suararakyat'],
    is_verified_fact: false,
    location_tag: 'Purwakarta'
  },
  {
    id: 'sig-03',
    issue_id: 'issue-pwk-02',
    platform: 'X',
    content: 'Thread investigasi mandiri: Mengapa ratusan kawan buruh kontrak di Bukit Indah Purwakarta diputus kerja tanpa pesangon jelang perpanjangan tahunan? Simak pola outsourcing berulang ini 🧵👇',
    timestamp: '7 jam yang lalu',
    engagement: {
      likes: 3420,
      shares: 1280,
      comments: 290
    },
    sentiment: 'Kritis / Resah',
    growth_rate: '+18%',
    keywords: ['#BuruhPurwakarta', '#KawasanBukitIndah', '#TolakPHKSepihak', '#DisnakerJabar'],
    is_verified_fact: false,
    location_tag: 'Bungursari, Purwakarta'
  },
  {
    id: 'sig-04',
    issue_id: 'issue-pwk-01',
    platform: 'YouTube',
    content: 'Liputan Wawancara Khusus: Apa Dampak Penurunan Kualitas Air Waduk Jatiluhur terhadap Pasokan Air Minum Warga Jakarta & Jawa Barat? (Podcast Kebijakan Publik)',
    timestamp: '1 hari yang lalu',
    engagement: {
      likes: 12500,
      shares: 890,
      comments: 740
    },
    sentiment: 'Netral',
    growth_rate: '+12%',
    keywords: ['#JatiluhurAirBaku', '#KrisisAirBersih', '#KetahananPangan'],
    is_verified_fact: false,
    location_tag: 'Nasional / Purwakarta'
  },
  {
    id: 'sig-05',
    issue_id: 'issue-pwk-03',
    platform: 'Forum Warga',
    content: 'Aduan warga Desa Wanayasa: Pengurukan tebing bukit oleh alat berat mulai menimbulkan lumpur ke saluran irigasi sawah warga di hilir saat hujan deras kemarin sore.',
    timestamp: '1 hari yang lalu',
    engagement: {
      likes: 450,
      shares: 120,
      comments: 88
    },
    sentiment: 'Kritis / Resah',
    growth_rate: '+24%',
    keywords: ['#WanayasaPurwakarta', '#LahanSawah', '#BencanaLongsor'],
    is_verified_fact: false,
    location_tag: 'Wanayasa, Purwakarta'
  },
  {
    id: 'sig-06',
    issue_id: 'issue-nas-01',
    platform: 'X',
    content: 'Peringatan kabut asap pekat mulai menyelimuti wilayah perbatasan Riau-Jambi pagi ini. Anak-anak SD terpaksa dipulangkan lebih awal demi pencegahan ISPA.',
    timestamp: '3 jam yang lalu',
    engagement: {
      likes: 5600,
      shares: 2400,
      comments: 480
    },
    sentiment: 'Marah / Protes',
    growth_rate: '+44%',
    keywords: ['#Karhutla2026', '#RiauMelawanAsap', '#KLHK', '#SaveSumatraForest'],
    is_verified_fact: false,
    location_tag: 'Nasional (Sumatra)'
  }
];
