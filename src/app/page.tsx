'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  BookOpen, 
  MapPin, 
  Layers, 
  Radio, 
  FileText, 
  Scale, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Flame, 
  ChevronRight,
  Database,
  Search
} from 'lucide-react';
import StatCards from '@/components/dashboard/StatCards';
import PriorityBoard from '@/components/dashboard/PriorityBoard';
import { mockIssues } from '@/data/mockIssues';

export default function LandingPage() {
  const workflowSteps = [
    { num: '01', title: 'Informasi & Sinyal', desc: 'Penangkapan sinyal awal dari laporan warga, media lokal, dan dokumen resmi.' },
    { num: '02', title: 'Klasifikasi Isu', desc: 'Pengelompokan berbasis wilayah Purwakarta, Jawa Barat, dan Nasional serta sektor bidang.' },
    { num: '03', title: 'Validasi Sumber', desc: 'Pemisahan ketat 3 tingkat: Terkonfirmasi, Klaim/Pernyataan, dan Belum Terverifikasi.' },
    { num: '04', title: 'Analisis AI & Marhaenisme', desc: 'Pemindaian kontradiksi, pemetaan relasi aktor, dan pisau analisis kerakyatan.' },
    { num: '05', title: 'Rekomendasi Kajian', desc: 'Evaluasi kelayakan urgensi dan dampak terhadap rakyat kecil.' },
    { num: '06', title: 'Bahan Kajian Siap Advokasi', desc: 'Penerbitan policy paper terstruktur untuk audiensi legislatif & aksi terukur.' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/30">
        
        {/* Subtle Background Accent Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Col: Hero Headline & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Organization Badge */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-200/80 text-gmni-red shadow-2xs">
                <div className="relative w-4 h-5 shrink-0">
                  <Image
                    src="/assets/gmni/logo-gmni.png"
                    alt="Logo GMNI"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs font-extrabold uppercase tracking-wider">
                  GMNI KOMISARIAT WASTUKANCANA
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight font-sans leading-[1.15]">
                "Menemukan Persoalan <br className="hidden sm:inline" />
                <span className="text-gmni-red">Sebelum Menjadi Terlambat.</span>"
              </h1>

              {/* Subheadline */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
                <strong>RUANG ISU</strong> membantu membaca perkembangan isu sosial-politik dari tingkat Purwakarta 
                hingga nasional, menghubungkan berbagai sumber, dan menggunakan AI untuk mengubah informasi menjadi 
                bahan kajian yang lebih terarah.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/isu"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gmni-red hover:bg-red-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Jelajahi Isu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#cara-kerja"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-all border border-slate-300 shadow-xs"
                >
                  <span>Lihat Cara Kerja</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>

                <Link
                  href="/ai-analyst"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>AI Issue Analyst</span>
                </Link>
              </div>

              {/* Teritorial Hierarchy Tags */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Prioritas Teritori:</span>
                <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold border border-red-200">
                  1. Purwakarta (Primer)
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                  2. Jawa Barat
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                  3. Nasional
                </span>
              </div>

            </div>

            {/* Right Col: Interactive Intelligence Dashboard Mockup Preview */}
            <div className="lg:col-span-5 relative">
              
              {/* Floating Cards Required in Section 6 */}
              <div className="absolute -top-4 -left-4 z-20 bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 shadow-lg flex items-center gap-2 animate-bounce duration-1000">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-800">23 Isu Dipantau</span>
              </div>

              <div className="absolute -bottom-3 -right-3 z-20 bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 shadow-lg flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-bold font-mono">AI Analysis Ready</span>
              </div>

              <div className="absolute top-1/2 -right-6 z-20 hidden sm:flex bg-red-600 text-white px-3 py-1.5 rounded-lg shadow-md items-center gap-1.5 text-xs font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>7 Isu Prioritas</span>
              </div>

              {/* Main Intelligence Card Preview */}
              <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl p-5 space-y-4 relative overflow-hidden">
                
                {/* Command Bar Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-mono font-semibold text-slate-500 ml-2">
                      RUANG-ISU://PURWAKARTA-INTEL
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    LIVE RADAR
                  </span>
                </div>

                {/* Simulated Monitored Issue Item */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-gmni-red border border-red-200">
                      🔴 PRIORITAS PURWAKARTA
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Aktif • 24 Sumber
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    Keamanan & Penataan Keramba Jaring Apung (KJA) Waduk Jatiluhur
                  </h3>

                  {/* Fact vs Claim Pill */}
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Fakta Terkonfirmasi: PJT II rilis SE-08 penataan zona steril.</span>
                    </div>
                    <div className="text-slate-500 pl-5 text-[10px]">
                      Sumber: Rilis Resmi PJT II & Polres Purwakarta
                    </div>
                  </div>

                  {/* Score Gauges */}
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="bg-red-50/70 p-1.5 rounded border border-red-200">
                      <div className="text-[9px] text-red-700 font-semibold">Impact</div>
                      <div className="text-xs font-extrabold text-red-900 font-mono">88/100</div>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                      <div className="text-[9px] text-slate-600 font-semibold">Evidence</div>
                      <div className="text-xs font-extrabold text-slate-900 font-mono">86/100</div>
                    </div>
                    <div className="bg-amber-50 p-1.5 rounded border border-amber-200">
                      <div className="text-[9px] text-amber-700 font-semibold">Momentum</div>
                      <div className="text-xs font-extrabold text-amber-900 font-mono">79/100</div>
                    </div>
                  </div>

                  {/* Bottom AI Status */}
                  <div className="p-2 bg-gradient-to-r from-red-900 to-slate-900 text-white rounded-lg text-[11px] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[10px]">Perspektif Marhaenis Siap</span>
                    </div>
                    <Link
                      href="/isu/keamanan-pengawasan-kawasan-waduk-jatiluhur"
                      className="text-[10px] font-bold text-amber-300 hover:underline inline-flex items-center gap-0.5"
                    >
                      Buka Kajian <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* DASHBOARD STATS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-sans">
              Kondisi Pantauan Isu Terkini
            </h2>
            <p className="text-xs text-slate-500">
              Metrik agregasi sistem pemantauan ruang sosial politik.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-gmni-red hover:underline inline-flex items-center gap-1"
          >
            <span>Buka Dashboard Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <StatCards />
      </section>

      {/* ISSUE PRIORITY BOARD SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PriorityBoard issues={mockIssues} limit={3} />
      </section>

      {/* WORKFLOW ALUR KERJA SISTEM */}
      <section id="cara-kerja" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8 relative overflow-hidden">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-red-400 font-mono">
              ALUR KERJA INTELLIGENCE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
              Dari Informasi Mentah Menjadi Bahan Kajian Strategis
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Platform bukan sekadar agregator berita viral, melainkan metodologi terstruktur untuk membantu kader membaca persoalan rakyat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-2 hover:border-red-500/50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-red-400 group-hover:text-red-300">
                    STEP {step.num}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-red-400" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Workflow Chain Visualizer */}
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-center font-mono text-[11px] text-slate-400 overflow-x-auto whitespace-nowrap">
            INFORMASI → PENGUMPULAN DATA → KLASIFIKASI ISU → VALIDASI SUMBER → ANALISIS AI → PEMETAAN ISU → REKOMENDASI KAJIAN → BAHAN KAJIAN
          </div>

        </div>
      </section>

      {/* CORE MODULES FEATURE MATRIX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gmni-red font-mono">
            FITUR & MODUL UTAMA
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Instrumen Riset Sosial-Politik untuk Kader
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Didesain khusus untuk kebutuhan kader bidang sosial-politik, tim kajian, dan forum intelektual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle hover:border-slate-300 hover:shadow-card-hover transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Fact vs Claim System
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Memisahkan secara ketat fakta terkonfirmasi, klaim narasumber, dan informasi belum terverifikasi untuk menjaga integritas kajian.
            </p>
            <Link href="/isu" className="text-xs font-semibold text-gmni-red hover:underline inline-flex items-center gap-1">
              <span>Buka Modul</span> <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle hover:border-slate-300 hover:shadow-card-hover transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-gmni-red flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              AI Issue Analyst & Marhaenisme
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              8 Aksi AI dialektis (Deteksi Celah Data, 8 Dimensi Pertanyaan Kajian, Komparasi Sumber) dengan pisau analisis ideologis Marhaenisme.
            </p>
            <Link href="/ai-analyst" className="text-xs font-semibold text-gmni-red hover:underline inline-flex items-center gap-1">
              <span>Buka AI Analyst</span> <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle hover:border-slate-300 hover:shadow-card-hover transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Peta Isu & 17 Kecamatan Purwakarta
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Visualisasi persebaran geospasial isu dari tingkat kecamatan Jatiluhur, Bungursari, Wanayasa, hingga tingkat provinsi & nasional.
            </p>
            <Link href="/peta" className="text-xs font-semibold text-gmni-red hover:underline inline-flex items-center gap-1">
              <span>Buka Peta Isu</span> <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle hover:border-slate-300 hover:shadow-card-hover transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Generator Bahan Kajian Otomatis
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Menghasilkan naskah naskah akademik & policy brief terstruktur siap ekspor Markdown atau langsung dicetak untuk keperluan audiensi.
            </p>
            <Link href="/kajian" className="text-xs font-semibold text-gmni-red hover:underline inline-flex items-center gap-1">
              <span>Arsip Kajian</span> <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

        </div>
      </section>

      {/* FINAL SLOGAN BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-900 via-slate-900 to-black text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <div className="inline-block bg-red-950 text-red-300 border border-red-800 text-[10px] font-bold px-2.5 py-1 rounded">
              GERAKAN MAHASISWA NASIONAL INDONESIA
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              "Pejuang Pemikir – Pemikir Pejuang"
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Membumikan analisis intelektual untuk mengabdi pada kemakmuran dan kedaulatan kaum Marhaen Indonesia.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="px-6 py-3.5 bg-gmni-red hover:bg-red-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all shrink-0 hover:scale-105"
          >
            Masuk ke Intelligence Workspace →
          </Link>
        </div>
      </section>

    </div>
  );
}
