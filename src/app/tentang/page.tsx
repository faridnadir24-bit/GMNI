'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Scale, 
  BookOpen, 
  HeartHandshake, 
  Info,
  ArrowRight
} from 'lucide-react';

export default function TentangPage() {
  const principles = [
    {
      title: 'AI Membantu Analisis, Bukan Menggantikan Verifikasi Manusia',
      desc: 'Sistem AI bertindak sebagai akselerator sintesis data dan pemetaan hubungan, sedangkan verifikasi faktual dan konklusi akhir tetap berada di tangan pertimbangan kritis kader di lapangan.'
    },
    {
      title: 'Pemisahan Ketat Fakta vs Klaim vs Opini',
      desc: 'Setiap entri informasi diberi label status yang jelas. Tidak mencampuradukkan spekulasi media sosial dengan rilis resmi instansi berwenang.'
    },
    {
      title: 'Praduga Tidak Bersalah & Integritas Sumber',
      desc: 'Platform menolak penyajian tuduhan tanpa bukti primer. Sinyal sentimen publik tidak boleh diperlakukan sebagai vonis bersalah.'
    },
    {
      title: 'Transparansi Celah Informasi (Data Gap)',
      desc: 'Jika data belum mencukupi atau terdapat kontradiksi antar lembaga, sistem secara eksplisit menampilkan status "Belum Cukup Data" atau "Terdapat Perbedaan Data".'
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Brand Hero Header */}
      <div className="bg-surface rounded-card border border-border p-8 sm:p-10 shadow-subtle flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-20 h-24 shrink-0">
          <Image
            src="/assets/gmni/logo-gmni.png"
            alt="Logo Resmi GMNI"
            fill
            className="object-contain"
          />
        </div>

        <div className="space-y-2.5 text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>GERAKAN MAHASISWA NASIONAL INDONESIA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">
            RUANG ISU GMNI Wastukancana
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-2xl">
            Pusat Pemantauan dan Pengembangan Isu Sosial Politik yang dibangun untuk menunjang kerja intelektual, 
            investigasi lapangan, dan advokasi kebijakan publik berbasis data yang berpihak pada kaum Marhaen.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2 text-xs text-ink-tertiary font-mono">
            <span>"Membaca Persoalan, Mengawal Perubahan"</span>
            <span>·</span>
            <span>"Pejuang Pemikir – Pemikir Pejuang"</span>
          </div>
        </div>
      </div>

      {/* Identitas Organisasi & Lokus Teritorial */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-5 bg-surface rounded-card border border-border shadow-subtle space-y-2">
          <div className="w-8 h-8 rounded-md bg-stone-100 text-ink-primary flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-ink-primary">
            Ideologi & Nilai Dasar
          </h3>
          <p className="text-xs text-ink-secondary leading-relaxed">
            Berlandaskan <strong>Marhaenisme</strong> ajaran Bung Karno: menjunjung tinggi <em>Sosio-Nasionalisme</em>, <em>Sosio-Demokrasi</em>, dan prinsip <em>Trisakti</em> guna mewujudkan keadilan sosial bagi seluruh rakyat Indonesia.
          </p>
        </div>

        <div className="p-5 bg-surface rounded-card border border-border shadow-subtle space-y-2">
          <div className="w-8 h-8 rounded-md bg-stone-100 text-ink-primary flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-ink-primary">
            Teritorial Purwakarta
          </h3>
          <p className="text-xs text-ink-secondary leading-relaxed">
            Prioritas utama pemantauan mencakup dinamika <strong>17 kecamatan di Kabupaten Purwakarta</strong> (Jatiluhur, Bungursari, Wanayasa, Campaka, dll) sebagai lokus basis kader komisariat.
          </p>
        </div>

        <div className="p-5 bg-surface rounded-card border border-border shadow-subtle space-y-2">
          <div className="w-8 h-8 rounded-md bg-stone-100 text-ink-primary flex items-center justify-center">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-ink-primary">
            Advokasi Kebijakan
          </h3>
          <p className="text-xs text-ink-secondary leading-relaxed">
            Hasil olah data dan sintesis AI dirumuskan menjadi naskah <strong>Bahan Kajian</strong> resmi untuk audiensi DPRD, konsolidasi gerakan buruh/petani, dan forum diskusi publik.
          </p>
        </div>

      </div>

      {/* 4 Pilar Prinsip Etika & Integritas Data */}
      <div className="bg-surface rounded-card border border-border p-6 sm:p-8 space-y-6 shadow-subtle" id="etika">
        
        <div className="space-y-1 border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-ink-secondary" />
            <h2 className="text-base sm:text-lg font-bold text-ink-primary">
              4 Pilar Integritas Data & Kode Etik Verifikasi
            </h2>
          </div>
          <p className="text-xs text-ink-secondary">
            Standar baku yang mengatur proses pengumpulan, pemilahan, dan diseminasi data dalam RUANG ISU.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {principles.map((p, idx) => (
            <div
              key={idx}
              className="p-4 rounded-btn bg-stone-50/70 border border-border/80 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary">
                  0{idx + 1}.
                </span>
                <h3 className="text-xs font-bold text-ink-primary">
                  {p.title}
                </h3>
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed pl-5">
                {p.desc}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* Footer Callout */}
      <div className="p-6 bg-stone-50 rounded-card border border-border text-center space-y-3">
        <h3 className="text-sm font-bold text-ink-primary">
          Siap Mengembangkan Kajian Bersama?
        </h3>
        <p className="text-xs text-ink-secondary max-w-md mx-auto leading-relaxed">
          Gunakan modul AI Issue Analyst untuk membedah data dan menyusun draf naskah rekomendasi kebijakan.
        </p>
        <Link
          href="/ai-analyst"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-ink-primary hover:bg-black text-white text-xs font-semibold rounded-btn transition-colors"
        >
          <span>Buka AI Analyst</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
