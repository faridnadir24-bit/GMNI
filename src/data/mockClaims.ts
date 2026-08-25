import { Claim } from '@/types';

export const mockClaims: Claim[] = [
  // Issue 1: Waduk Jatiluhur
  {
    id: 'claim-pwk01-01',
    issue_id: 'issue-pwk-01',
    content: 'Perum Jasa Tirta II (PJT II) telah merilis surat edaran resmi penertiban KJA tahap kedua dengan target pengurangan 4.000 petak liar di zona terlarang dekat spillway bendungan.',
    type: 'fact',
    source_name: 'Humas PJT II Purwakarta',
    source_type: 'Official',
    source_url: 'https://jasatirta2.co.id/press/penataan-kja-2026',
    verification_notes: 'Diverifikasi melalui Surat Edaran Direksi PJT II No. SE-08/DIR/2026 bertanggal 10 Agustus 2026.',
    confidence_score: 98
  },
  {
    id: 'claim-pwk01-02',
    issue_id: 'issue-pwk-01',
    content: 'Polres Purwakarta menyiagakan 120 personel gabungan Satpolairud dan Samapta untuk pengamanan objek vital nasional di seputar bendungan utama.',
    type: 'fact',
    source_name: 'Polres Purwakarta (Rilis Humas)',
    source_type: 'Official',
    verification_notes: 'Terkonfirmasi melalui siaran pers resmi Kapolres Purwakarta.',
    confidence_score: 95
  },
  {
    id: 'claim-pwk01-03',
    issue_id: 'issue-pwk-01',
    content: 'Paguyuban Petani Ikan KJA mengklaim bahwa 70% petak KJA yang ditertibkan adalah milik pemodal besar dari luar Purwakarta yang menyewa KTP warga lokal.',
    type: 'claim',
    source_name: 'Ketua Paguyuban KJA Jatiluhur',
    source_type: 'Field Report',
    verification_notes: 'Pernyataan disampaikan saat audiensi dengan Komisi II DPRD Purwakarta. Perlu audit kepemilikan faktual di lapangan.',
    confidence_score: 65
  },
  {
    id: 'claim-pwk01-04',
    issue_id: 'issue-pwk-01',
    content: 'Dugaan adanya pungutan liar izin pelampung KJA liar sebesar Rp 2,5 juta per petak oleh oknum tertentu tanpa bukti kuitansi resmi.',
    type: 'unverified',
    source_name: 'Laporan Warga / Forum Warga Pesisir Danau',
    source_type: 'Social',
    verification_notes: 'Informasi beredar di grup percakapan warga, belum ada bukti transaksi atau laporan pidana resmi yang terdaftar di kejaksaan/kepolisian.',
    confidence_score: 30
  },
  {
    id: 'claim-pwk01-05',
    issue_id: 'issue-pwk-01',
    content: 'Kadar Biological Oxygen Demand (BOD) di zona barat waduk mengalami penurunan kualitas sebesar 14% dibanding standar baku mutu air bersih.',
    type: 'fact',
    source_name: 'Dinas Lingkungan Hidup Kab. Purwakarta',
    source_type: 'Official',
    verification_notes: 'Berdasarkan laporan hasil uji laboratorium DLH Purwakarta periode Juni 2026.',
    confidence_score: 92
  },

  // Issue 2: Buruh KBI Purwakarta
  {
    id: 'claim-pwk02-01',
    issue_id: 'issue-pwk-02',
    content: 'Sebanyak 280 buruh kontrak PT MKI di Kawasan Industri Kota Bukit Indah menerima surat pemutusan hubungan kerja sepihak tanpa musyawarah bipartit.',
    type: 'fact',
    source_name: 'Pimpinan Cabang FSPMI Purwakarta',
    source_type: 'Field Report',
    verification_notes: 'Diverifikasi dengan salinan surat keputusan PHK dan daftar absensi serikat pekerja.',
    confidence_score: 94
  },
  {
    id: 'claim-pwk02-02',
    issue_id: 'issue-pwk-02',
    content: 'Manajemen perusahaan menyatakan efisiensi dilakukan akibat penurunan pesanan ekspor komponen suku cadang luar negeri sebesar 35%.',
    type: 'claim',
    source_name: 'Pernyataan Manajemen Perusahaan (via Media Lokal)',
    source_type: 'Media',
    verification_notes: 'Klaim keuangan perusahaan belum diverifikasi oleh akuntan independen dalam audit bipartit.',
    confidence_score: 60
  },
  {
    id: 'claim-pwk02-03',
    issue_id: 'issue-pwk-02',
    content: 'Disnakertrans Purwakarta telah melayangkan surat panggilan mediasi tripartit pertama kepada kedua belah pihak.',
    type: 'fact',
    source_name: 'Kepala Bidang HI Disnakertrans Purwakarta',
    source_type: 'Official',
    verification_notes: 'Terkonfirmasi melalui agenda resmi mediasi ketenagakerjaan Pemkab Purwakarta.',
    confidence_score: 96
  },
  {
    id: 'claim-pwk02-04',
    issue_id: 'issue-pwk-02',
    content: 'Beredar rumor bahwa pabrik akan segera relokasi ke wilayah Jawa Tengah demi mencari upah minimum yang lebih rendah.',
    type: 'unverified',
    source_name: 'Percakapan Komunitas Buruh WhatsApp / X',
    source_type: 'Social',
    verification_notes: 'Belum ada surat izin relokasi atau izin penutupan pabrik di Dinas Penanaman Modal Purwakarta.',
    confidence_score: 25
  },

  // Issue 3: Agraria Wanayasa
  {
    id: 'claim-pwk03-01',
    issue_id: 'issue-pwk-03',
    content: 'Luas area sawah yang telah dipagari seng oleh pengembang seluas 35 hektar di blok lereng Wanayasa.',
    type: 'fact',
    source_name: 'Pemerintah Desa Wanayasa & Tim Pantau Lapangan',
    source_type: 'Official',
    verification_notes: 'Pengecekan fisik batas patok oleh perangkat desa dan perwakilan kelompok tani.',
    confidence_score: 90
  },
  {
    id: 'claim-pwk03-02',
    issue_id: 'issue-pwk-03',
    content: 'Pengembang mengklaim telah mengantongi izin Persetujuan Bangunan Gedung (PBG) dan persetujuan warga sekitar.',
    type: 'claim',
    source_name: 'Kuasa Hukum Pengembang Swasta',
    source_type: 'Media',
    verification_notes: 'Warga membantah telah menandatangani persetujuan lingkungan tanpa paksaan.',
    confidence_score: 50
  },
  {
    id: 'claim-pwk03-03',
    issue_id: 'issue-pwk-03',
    content: 'Dugaan adanya intimidasi oleh oknum preman terhadap petani yang menolak menjual surat garapannya.',
    type: 'unverified',
    source_name: 'Laporan Lisan Warga Desa ke Tim GMNI',
    source_type: 'Field Report',
    verification_notes: 'Sedang dilakukan pengumpulan bukti dokumentasi dan rekaman suara oleh tim investigasi.',
    confidence_score: 35
  },

  // Issue 4: Karhutla Nasional 2026
  {
    id: 'claim-nas01-01',
    issue_id: 'issue-nas-01',
    content: 'BMKG mendeteksi 412 hotspot kategori tingkat kepercayaan tinggi (high confidence) di pulau Sumatra dan Kalimantan.',
    type: 'fact',
    source_name: 'Pusat Informasi Perubahan Iklim BMKG',
    source_type: 'Official',
    source_url: 'https://bmkg.go.id/iklim/hotspot-monitoring',
    verification_notes: 'Data satelit MODIS & SNPP VIIRS terkonfirmasi.',
    confidence_score: 99
  },
  {
    id: 'claim-nas01-02',
    issue_id: 'issue-nas-01',
    content: 'Kementerian LHK telah menyegel 3 konsesi perkebunan di Riau dan Kalbar yang terbukti lalai menjaga sekat kanal gambut.',
    type: 'fact',
    source_name: 'Ditjen Gakkum KLHK',
    source_type: 'Official',
    verification_notes: 'Berita acara pemasangan plang segel investigasi KLHK bertanggal 19 Agustus 2026.',
    confidence_score: 97
  },
  {
    id: 'claim-nas01-03',
    issue_id: 'issue-nas-01',
    content: 'Asosiasi menyatakan kebakaran bersumber dari api lompat luar area konsesi yang terbawa angin kencang.',
    type: 'claim',
    source_name: 'Juru Bicara GAPKI Wilayah Riau',
    source_type: 'Media',
    verification_notes: 'Klaim dibantah temuan citra satelit independen WALHI yang menunjukkan titik awal api dari dalam konsesi.',
    confidence_score: 45
  },

  // Issue 5: Gempa NTT 2026
  {
    id: 'claim-nas02-01',
    issue_id: 'issue-nas-02',
    content: 'Kementerian PUPR mengalokasikan anggaran Rp 140 Miliar untuk pembangunan 650 unit Huntap tipe 36 dengan struktur RISHA (Rumah Instan Sederhana Sehat).',
    type: 'fact',
    source_name: 'Satgas Penanggulangan Bencana Ditjen Perumahan PUPR',
    source_type: 'Official',
    verification_notes: 'Tercatat dalam DIPA Anggaran Tanggap Darurat Bencana NTT 2026.',
    confidence_score: 97
  },
  {
    id: 'claim-nas02-02',
    issue_id: 'issue-nas-02',
    content: 'Distribusi logistik bantuan sembako dan air bersih terhambat akibat kerusakan dermaga sandar kapal di pulau Adonara.',
    type: 'fact',
    source_name: 'BPBD Kabupaten Flores Timur',
    source_type: 'Official',
    verification_notes: 'Diverifikasi langsung oleh tim relawan kemanusiaan di lokasi posko pelabuhan.',
    confidence_score: 93
  }
];
