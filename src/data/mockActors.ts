import { Actor } from '@/types';

export const mockActors: Actor[] = [
  // Issue 1: Waduk Jatiluhur
  {
    id: 'actor-01',
    issue_id: 'issue-pwk-01',
    name: 'Direksi Pengelolaan SDA PJT II',
    organization: 'Perum Jasa Tirta II',
    role: 'Pengelola Objek Vital / BUMN Air',
    stance: 'Proaktif',
    statement: '"Penertiban KJA adalah keharusan mutlak untuk menjaga keamanan struktur bendungan dan kualitas air baku 80% warga ibu kota."',
    influence_level: 'Tinggi'
  },
  {
    id: 'actor-02',
    issue_id: 'issue-pwk-01',
    name: 'Kapolres Purwakarta',
    organization: 'Polres Purwakarta / Satpolairud',
    role: 'Aparat Penegak Hukum & Obvitnas',
    stance: 'Proaktif',
    statement: '"Polri mengedepankan pendekatan preventif-humanis dalam pengamanan objek vital nasional, namun siap menindak tegas pelaku perusakan fasilitas negara."',
    influence_level: 'Tinggi'
  },
  {
    id: 'actor-03',
    issue_id: 'issue-pwk-01',
    name: 'H. Suryana (Ketua Paguyuban KJA)',
    organization: 'Paguyuban Petani Ikan KJA Jatiluhur',
    role: 'Kelompok Masyarakat / Produsen Kecil',
    stance: 'Kritis',
    statement: '"Jangan samaratakan petani gurem berpenghasilan pas-pasan dengan pemodal besar pemilik ratusan kolam. Kami butuh kepastian mata pencaharian."',
    influence_level: 'Tinggi'
  },
  {
    id: 'actor-04',
    issue_id: 'issue-pwk-01',
    name: 'Kepala Dinas Lingkungan Hidup Kab. Purwakarta',
    organization: 'Pemerintah Kabupaten Purwakarta',
    role: 'Regulator Lingkungan Daerah',
    stance: 'Netral',
    statement: '"Daya tampung beban pencemaran air danau telah melebihi ambang batas aman. Zonasi ketat harus ditaati demi ekosistem jangka panjang."',
    influence_level: 'Sedang'
  },
  {
    id: 'actor-05',
    issue_id: 'issue-pwk-01',
    name: 'Bidang Sosial Politik GMNI Wastukancana',
    organization: 'GMNI Komisariat Wastukancana Purwakarta',
    role: 'Organisasi Mahasiswa & Tim Kajian Advokasi',
    stance: 'Kritis',
    statement: '"Menuntut audit terbuka kepemilikan petak KJA dan mendesak skema perlindungan mata pencaharian alternatif bagi nelayan lokal Purwakarta."',
    influence_level: 'Tinggi'
  },

  // Issue 2: Buruh KBI Purwakarta
  {
    id: 'actor-06',
    issue_id: 'issue-pwk-02',
    name: 'Ketua PC FSPMI Purwakarta',
    organization: 'Federasi Serikat Pekerja Metal Indonesia',
    role: 'Serikat Buruh',
    stance: 'Kritis',
    statement: '"Kami menolak pemutusan sepihak tanpa perundingan bipartit yang jujur dan menuntut pembayaran hak pesangon sesuai perundang-undangan."',
    influence_level: 'Tinggi'
  },
  {
    id: 'actor-07',
    issue_id: 'issue-pwk-02',
    name: 'Kepala Disnakertrans Purwakarta',
    organization: 'Dinas Tenaga Kerja dan Transmigrasi Kab. Purwakarta',
    role: 'Regulator Ketenagakerjaan Daerah',
    stance: 'Netral',
    statement: '"Pemerintah daerah membuka posko mediasi tripartit dan mewajibkan perusahaan hadir memenuhi hak-hak normatif pekerja."',
    influence_level: 'Tinggi'
  },
  {
    id: 'actor-08',
    issue_id: 'issue-pwk-02',
    name: 'Direktur Hubungan Industrial APINDO Purwakarta',
    organization: 'Asosiasi Pengusaha Indonesia Purwakarta',
    role: 'Perwakilan Korporasi / Pengusaha',
    stance: 'Reaktif',
    statement: '"Tantangan penurunan permintaan pasar global memaksa penyesuaian kapasitas produksi agar kelangsungan pabrik tetap terjaga."',
    influence_level: 'Sedang'
  }
];
