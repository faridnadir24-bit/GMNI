'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  ShieldCheck, 
  BookOpen, 
  MapPin, 
  Radio, 
  FileText, 
  Scale, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import StatCards from '@/components/dashboard/StatCards';
import PriorityBoard from '@/components/dashboard/PriorityBoard';
import UnviralPrioritySection from '@/components/dashboard/UnviralPrioritySection';
import LocationBadge from '@/components/ui/LocationBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import ScoreIndicator from '@/components/ui/ScoreIndicator';
import { useApp } from '@/context/AppContext';
import { formatDateIndo } from '@/lib/utils';

export default function LandingPage() {
  const { issues } = useApp();
  const snapshotIssue = issues[0] || null;

  const workflowSteps = [
    { num: '01', title: 'Penangkapan Sinyal', desc: 'Identifikasi awal dari rilis pers resmi, media massa daerah, dan aduan posko kader.' },
    { num: '02', title: 'Klasifikasi Isu', desc: 'Pemetaan berdasar lokus teritorial Purwakarta, Jawa Barat, dan Nasional serta sektor bidang.' },
    { num: '03', title: 'Validasi Sumber', desc: 'Pemisahan ketat 3 tingkat: Terkonfirmasi, Klaim/Pernyataan, dan Belum Terverifikasi.' },
    { num: '04', title: 'Analisis Dialektis', desc: 'Pengujian celah data, pemetaan relasi aktor, dan pisau analisis Marhaenisme.' },
    { num: '05', title: 'Rekomendasi Riset', desc: 'Evaluasi kelayakan dan signifikansi dampak sosial-ekonomi terhadap rakyat.' },
    { num: '06', title: 'Naskah Bahan Kajian', desc: 'Penerbitan policy brief terstruktur untuk advokasi kebijakan publik dan audiensi.' },
  ];

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      
      {/* HERO SECTION */}
      <section className="pt-10 sm:pt-16 pb-12 border-b border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left: Editorial Headline & CTAs */}
            <div className="lg:col-span-7 space-y-5 text-left">
              
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>GMNI WASTUKANCANA · PURWAKARTA</span>
              </div>

              {/* Display Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-ink-primary tracking-tight leading-[1.15]">
                Menemukan Persoalan <br className="hidden sm:inline" />
                Sebelum Menjadi Krisis.
              </h1>

              {/* Subheadline */}
              <p className="text-sm sm:text-base text-ink-secondary max-w-2xl leading-relaxed">
                Platform intelijen pemantauan isu berbasis data dan kerangka advokasi sosial-politik. Mengubah arus berita harian menjadi bahan kajian kebijakan strategis demi keberpihakan pada kaum Marhaen.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-[#8F0D15] text-white text-xs sm:text-sm font-semibold rounded-btn shadow-subtle transition-all active:scale-95"
                >
                  <span>Buka Pantauan Isu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/ai-analyst"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-muted hover:bg-stone-200 text-ink-primary text-xs sm:text-sm font-semibold rounded-btn transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-ink-secondary" />
                  <span>AI Analyst</span>
                </Link>

                <Link
                  href="/tentang"
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm text-ink-secondary hover:text-ink-primary font-medium transition-colors"
                >
                  <span>Metodologi</span>
                  <ChevronRight className="w-3.5 h-3.5 text-ink-tertiary" />
                </Link>
              </div>

              {/* Quick Territory Indicators */}
              <div className="flex items-center gap-4 pt-3 text-xs text-ink-tertiary">
                <span className="font-semibold text-ink-secondary">Cakupan Teritori:</span>
                <span className="text-ink-primary font-medium">1. Purwakarta (17 Kecamatan)</span>
                <span>·</span>
                <span>2. Jawa Barat</span>
                <span>·</span>
                <span>3. Nasional</span>
              </div>

            </div>

            {/* Right: Clean Editorial Issue Snapshot */}
            <div className="lg:col-span-5">
              {snapshotIssue ? (
                <div className="bg-surface rounded-card border border-border p-6 shadow-subtle space-y-4">
                  
                  {/* Snapshot Header */}
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                        Isu Prioritas Terkini
                      </span>
                    </div>
                    <StatusBadge status={snapshotIssue.status} />
                  </div>

                  {/* Title & Metadata */}
                  <div className="space-y-2">
                    <Link href={`/isu/${snapshotIssue.slug}`} className="block hover:text-primary transition-colors">
                      <h3 className="text-base font-bold text-ink-primary leading-snug">
                        {snapshotIssue.title}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2">
                      <LocationBadge location={snapshotIssue.location} district={snapshotIssue.district} size="sm" />
                      <CategoryBadge category={snapshotIssue.category} />
                    </div>
                  </div>

                  {/* Score Indicators */}
                  <div className="space-y-2 bg-stone-50/70 p-3.5 rounded-btn border border-border/60">
                    <ScoreIndicator label="Impact Score" score={snapshotIssue.impact_score} accent />
                    <ScoreIndicator label="Evidence Score" score={snapshotIssue.evidence_score} />
                    <ScoreIndicator label="Momentum" score={snapshotIssue.momentum_score} />
                  </div>

                  {/* Summary Metadata */}
                  <div className="flex items-center justify-between text-xs text-ink-tertiary pt-1">
                    <span>{snapshotIssue.sources_count || 1} rujukan sumber</span>
                    <span>Diperbarui {formatDateIndo(snapshotIssue.last_activity_at || snapshotIssue.last_updated_at)}</span>
                  </div>

                  {/* Action Link */}
                  <Link
                    href={`/isu/${snapshotIssue.slug}`}
                    className="w-full text-center py-2 px-4 bg-muted hover:bg-stone-200 text-ink-primary text-xs font-semibold rounded-btn transition-colors block"
                  >
                    Buka Lembar Fakta & Analisis
                  </Link>

                </div>
              ) : (
                <div className="bg-surface rounded-card border border-border p-8 text-center space-y-3 shadow-subtle">
                  <BookOpen className="w-8 h-8 text-ink-tertiary mx-auto" />
                  <div className="text-sm font-bold text-ink-primary">Basis Data Terhubung</div>
                  <p className="text-xs text-ink-secondary">
                    Menghubungkan ke sistem pemantauan isu sosial-politik...
                  </p>
                  <Link
                    href="/dashboard"
                    className="inline-block py-2 px-4 bg-stone-900 text-white text-xs font-semibold rounded-btn hover:bg-stone-800"
                  >
                    Buka Dashboard
                  </Link>
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* DASHBOARD SUMMARY STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StatCards />
      </section>

      {/* ISU BELUM VIRAL · DAMPAK TINGGI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <UnviralPrioritySection issues={issues} />
      </section>

      {/* ISSUE PRIORITY BOARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PriorityBoard issues={issues} limit={3} />
      </section>

      {/* WORKFLOW PIPELINE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-surface rounded-card border border-border p-6 sm:p-10 space-y-8">
          
          <div className="space-y-1.5 max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
              Metodologi
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-ink-primary">
              Alur Pengolahan Isu Menjadi Bahan Kajian
            </h2>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              Tahapan sistematis untuk memvalidasi informasi mentah sebelum dituangkan dalam naskah advokasi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-5 rounded-btn bg-stone-50/60 border border-border/80 space-y-1.5 hover:border-stone-400 transition-colors"
              >
                <span className="text-xs font-mono font-bold text-primary">
                  {step.num}
                </span>
                <h3 className="text-sm font-bold text-ink-primary">
                  {step.title}
                </h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CORE MODULES OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
            Modul Platform
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-ink-primary">
            Instrumen Riset Sosial-Politik
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-surface p-5 rounded-card border border-border shadow-subtle hover:border-stone-400 transition-colors space-y-2.5">
            <div className="w-8 h-8 rounded-md bg-muted text-ink-primary flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-ink-primary">
              Fact vs Claim System
            </h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Memisahkan secara ketat fakta terkonfirmasi, klaim narasumber, dan informasi belum terverifikasi.
            </p>
            <Link href="/isu" className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1 pt-1">
              <span>Buka Direktori</span> <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-surface p-5 rounded-card border border-border shadow-subtle hover:border-stone-400 transition-colors space-y-2.5">
            <div className="w-8 h-8 rounded-md bg-muted text-ink-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-ink-primary">
              AI Issue Analyst
            </h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Analisis celah data, komparasi rujukan, dan sintesis kritis berlandaskan kerangka ideologis Marhaenisme.
            </p>
            <Link href="/ai-analyst" className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1 pt-1">
              <span>Buka Analisis</span> <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-surface p-5 rounded-card border border-border shadow-subtle hover:border-stone-400 transition-colors space-y-2.5">
            <div className="w-8 h-8 rounded-md bg-muted text-ink-primary flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-ink-primary">
              Peta Isu Geospasial
            </h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Pemetaan sebaran persoalan dari 17 kecamatan di Kabupaten Purwakarta hingga tingkat nasional.
            </p>
            <Link href="/peta" className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1 pt-1">
              <span>Buka Peta</span> <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-surface p-5 rounded-card border border-border shadow-subtle hover:border-stone-400 transition-colors space-y-2.5">
            <div className="w-8 h-8 rounded-md bg-muted text-ink-primary flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-ink-primary">
              Naskah Bahan Kajian
            </h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Penerbitan policy brief 10 bab terstruktur dengan dukungan cetak instan dan ekspor Markdown.
            </p>
            <Link href="/kajian" className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1 pt-1">
              <span>Arsip Kajian</span> <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

        </div>
      </section>

      {/* INSTITUTIONAL SLOGAN BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface rounded-card border border-border p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-subtle">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-secondary">
              Gerakan Mahasiswa Nasional Indonesia
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-ink-primary">
              "Pejuang Pemikir – Pemikir Pejuang"
            </h3>
            <p className="text-xs text-ink-secondary max-w-lg">
              Mewujudkan analisis sosial-politik yang kritis, objektif, dan berpihak pada kesejahteraan rakyat.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="px-5 py-2.5 bg-ink-primary hover:bg-black text-white text-xs font-semibold rounded-btn transition-colors shrink-0"
          >
            Buka Ruang Kerja Pemantauan
          </Link>
        </div>
      </section>

    </div>
  );
}
