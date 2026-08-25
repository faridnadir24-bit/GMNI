'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Scale, 
  BookOpen, 
  HeartHandshake, 
  AlertTriangle, 
  ArrowRight,
  Award,
  Layers,
  Sparkles
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Brand Hero Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-subtle flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-28 h-32 shrink-0">
          <Image
            src="/assets/gmni/logo-gmni.png"
            alt="Logo Resmi GMNI"
            fill
            className="object-contain"
          />
        </div>

        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-gmni-red text-xs font-bold uppercase tracking-wider">
            GERAKAN MAHASISWA NASIONAL INDONESIA
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            RUANG ISU GMNI Wastukancana Purwakarta
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
            Pusat Pemantauan dan Pengembangan Isu Sosial Politik yang dibangun untuk menunjang kerja-kerja intelektual, 
            investigasi lapangan, dan advokasi kebijakan publik berbasis data yang berpihak pada kaum Marhaen.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
            <span className="bg-slate-900 text-white text-xs font-mono font-bold px-3 py-1.5 rounded-lg">
              "Membaca Persoalan, Mengawal Perubahan"
            </span>
            <span className="bg-red-950 text-red-300 border border-red-800 text-xs font-mono font-bold px-3 py-1.5 rounded-lg">
              "Pejuang Pemikir – Pemikir Pejuang"
            </span>
          </div>
        </div>
      </div>

      {/* Identitas Organisasi & Lokus Teritorial */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-subtle space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-gmni-red flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Ideologi & Nilai Dasar
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Berlandaskan <strong>Marhaenisme</strong> ajaran Bung Karno: menjunjung tinggi <em>Sosio-Nasionalisme</em>, <em>Sosio-Demokrasi</em>, dan prinsip <em>Trisakti</em> guna mewujudkan keadilan sosial bagi seluruh rakyat Indonesia.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-subtle space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Teritorial Purwakarta
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Prioritas utama pemantauan mencakup dinamika <strong>17 kecamatan di Kabupaten Purwakarta</strong> (Jatiluhur, Bungursari, Wanayasa, Campaka, dll) sebagai lokus basis kader komisariat.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-subtle space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Karakteristik Platform
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Bukan sekadar portal berita atau blog opini, melainkan <strong>Issue Intelligence Platform</strong> untuk menyaring sinyal informasi mentah menjadi bahan kajian advokasi kebijakan publik yang terarah.
          </p>
        </div>

      </div>

      {/* Prinsip Etika & Aturan Mutlak (Section 32) */}
      <div id="etika" className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 space-y-6">
        <div className="max-w-2xl space-y-1">
          <span className="text-xs font-bold text-red-400 uppercase tracking-widest font-mono">
            KODE ETIK INTELLIGENCE
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold font-sans">
            Prinsip Etika & Integritas Data Platform
          </h2>
          <p className="text-xs text-slate-400">
            Standar integritas yang dijaga ketat oleh seluruh kader dalam pengoperasian sistem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {principles.map((pr, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white leading-snug">
                  {pr.title}
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {pr.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="p-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Mulai Eksplorasi Data & Bahan Kajian
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Gunakan platform ini untuk mendukung diskusi cabang, riset tugas akhir, atau penyusunan naskah audiensi ke pemangku kebijakan.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="px-6 py-3 bg-gmni-red hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-all shrink-0"
        >
          Masuk ke Dashboard Isu →
        </Link>
      </div>

    </div>
  );
}
