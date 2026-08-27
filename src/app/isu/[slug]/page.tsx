'use client';

import React, { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Sparkles, 
  FileText, 
  Bookmark, 
  BookmarkCheck, 
  ArrowLeft,
  Share2,
  Check,
  TrendingUp,
  AlertTriangle,
  Scale,
  ShieldCheck,
  Layers,
  GitCommit
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatDateIndo } from '@/lib/utils';
import LocationBadge from '@/components/ui/LocationBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import ScoreIndicator from '@/components/ui/ScoreIndicator';

import IssueExplanationDepth from '@/components/issue/IssueExplanationDepth';
import WhatChangedSection from '@/components/issue/WhatChangedSection';
import ConfidenceExplainer from '@/components/issue/ConfidenceExplainer';
import ContradictionSection from '@/components/issue/ContradictionSection';
import FactVsClaim from '@/components/issue/FactVsClaim';
import SourcePanel from '@/components/issue/SourcePanel';
import EvidenceLocker from '@/components/issue/EvidenceLocker';
import IssueEventsTimeline from '@/components/issue/IssueEventsTimeline';
import TimelineView from '@/components/issue/TimelineView';
import MomentumChart from '@/components/issue/MomentumChart';
import ActorMap from '@/components/issue/ActorMap';
import AISummarizer from '@/components/ai/AISummarizer';
import MarhaenismAnalysis from '@/components/ai/MarhaenismAnalysis';
import AIRecommender from '@/components/ai/AIRecommender';
import KajianDocModal from '@/components/ai/KajianDocModal';
import { BahanKajianDocument, Issue } from '@/types';
import { mockKajianDocs } from '@/data/mockKajian';
import { mockActors } from '@/data/mockActors';

export default function IssueDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { issues, claims, sources, savedIssueIds, toggleSaveIssue, addKajianDoc } = useApp();
  const [dynamicSingleIssue, setDynamicSingleIssue] = useState<Issue | null>(null);
  const [isLoadingSingle, setIsLoadingSingle] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [isKajianModalOpen, setIsKajianModalOpen] = useState(false);
  const [activeKajianDoc, setActiveKajianDoc] = useState<BahanKajianDocument | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const issue = issues.find(i => i.slug === slug || i.id === slug) || dynamicSingleIssue;

  React.useEffect(() => {
    if (!issue && !fetchFailed) {
      setIsLoadingSingle(true);
      fetch(`/api/issues/${slug}`)
        .then(res => res.json())
        .then(json => {
          if (json.success && json.data) {
            setDynamicSingleIssue(json.data);
          } else {
            setFetchFailed(true);
          }
        })
        .catch(() => setFetchFailed(true))
        .finally(() => setIsLoadingSingle(false));
    }
  }, [slug, issue, fetchFailed]);

  if (isLoadingSingle) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-ink-secondary">Memuat lembar fakta dan rujukan isu...</p>
      </div>
    );
  }

  if (!issue) {
    if (fetchFailed) {
      return (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-primary mx-auto" />
          <h2 className="text-base font-bold text-ink-primary">Isu Tidak Ditemukan</h2>
          <p className="text-xs text-ink-secondary max-w-sm mx-auto">
            Isu yang Anda cari belum terdata atau telah diarsipkan dalam sistem pemantauan.
          </p>
          <Link
            href="/dashboard"
            className="inline-block py-2 px-4 bg-stone-900 text-white text-xs font-semibold rounded-btn hover:bg-stone-800"
          >
            Kembali ke Pantauan
          </Link>
        </div>
      );
    }
    return null;
  }

  const isSaved = savedIssueIds.includes(issue.id);
  const issueSources = sources.filter(s => s.issue_id === issue.id || s.issue_id === issue.slug);
  const issueClaims = claims.filter(c => c.issue_id === issue.id || c.issue_id === issue.slug);
  const issueActors = mockActors.filter(a => a.issue_id === issue.id);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleOpenKajian = () => {
    const existing = mockKajianDocs.find(d => d.issue_id === issue.id);
    if (existing) {
      setActiveKajianDoc(existing);
    } else {
      const newDoc: BahanKajianDocument = {
        id: `kajian-${Date.now()}`,
        issue_id: issue.id,
        issue_title: issue.title,
        title: `Naskah Kajian Kebijakan: ${issue.title}`,
        subtitle: `Analisis Sosio-Politik Teritorial ${issue.location}`,
        author: 'Tim Riset Kebijakan GMNI Wastukancana',
        komisariat: 'GMNI Komisariat Wastukancana Purwakarta',
        date_created: new Date().toISOString(),
        status: 'Draft',
        sections: {
          latar_belakang: issue.description,
          rumusan_masalah: [
            `Bagaimana dinamika dan dampak persoalan ${issue.title} terhadap masyarakat di ${issue.location}?`,
            `Bagaimana respon pemerintah daerah dan evaluasi kebijakan penanganannya?`,
            `Bagaimana pisau analisis Marhaenisme membedah relasi kuasa dalam isu ini?`
          ],
          data_dan_fakta: [
            `Skor Dampak Kebijakan: ${issue.impact_score}/100`,
            `Jumlah Rujukan Terverifikasi: ${issue.sources_count} Sumber`,
            `Tingkat Keyakinan Evidensi (Confidence): ${issue.confidence_score || 75}%`
          ],
          kronologi_singkat: [
            `Deteksi Awal: ${formatDateIndo(issue.first_detected_at)}`,
            `Pembaruan Terkini: ${formatDateIndo(issue.last_updated_at)}`
          ],
          pihak_terkait: [
            { nama: 'Pemerintah Daerah / Dinas Terkait', peran: 'Regulator & Otoritas Penanganan', posisi: 'Pembuat Kebijakan' },
            { nama: 'Masyarakat Terdampak (Kaum Marhaen)', peran: 'Pihak Penerima Dampak', posisi: 'Korban / Terdampak' },
            { nama: 'GMNI Wastukancana', peran: 'Advokasi & Pengawasan Partisipatif', posisi: 'Pendamping Rakyat' }
          ],
          analisis_sosial_politik: `Isu ini berakar dari implementation gap regulasi dan membutuhkan pengawasan ketat dari elemen masyarakat sipil.`,
          perspektif_marhaenisme: `Berdasarkan prinsip Sosio-Nasionalisme dan Sosio-Demokrasi, hak-hak rakyat miskin harus menjadi pertimbangan utama di atas kalkulasi ekonomi elite.`,
          dampak_masyarakat: `Dampak langsung dirasakan oleh warga di sekitar lokasi berupa ketidakpastian nafkah dan penurunan kualitas layanan publik.`,
          alternatif_kebijakan: [
            'Audit menyeluruh terhadap pelaksanaan regulasi oleh dinas teknis.',
            'Pemberian kompensasi dan perlindungan sosial bagi warga terdampak.',
            'Pembentukan saluran komunikasi publik yang transparan dan akuntabel.'
          ],
          rekomendasi_advokasi: [
            'GMNI menginisiasi forum audiensi bersama pihak terkait di DPRD.',
            'Penerbitan Policy Brief resmi sebagai masukan konstruktif pemerintah daerah.',
            'Pendampingan langsung kepada masyarakat basis di lapangan.'
          ],
          daftar_pustaka: [
            { title: issue.title, source: 'Pusat Data Ruang Isu GMNI', year: '2026' }
          ]
        }
      };
      addKajianDoc(newDoc);
      setActiveKajianDoc(newDoc);
    }
    setIsKajianModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* TOP NAVIGATION & ACTIONS */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <Link
          href="/isu"
          className="text-xs font-semibold text-ink-secondary hover:text-ink-primary transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Direktori Isu</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="p-2 bg-surface hover:bg-stone-100 border border-border rounded-btn text-ink-secondary hover:text-ink-primary transition-colors text-xs inline-flex items-center gap-1.5"
            title="Salin Tautan Isu"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copiedLink ? 'Tersalin' : 'Bagikan'}</span>
          </button>

          <button
            onClick={() => toggleSaveIssue(issue.id)}
            className={`p-2 rounded-btn border text-xs inline-flex items-center gap-1.5 transition-colors ${
              isSaved
                ? 'bg-primary text-white border-primary'
                : 'bg-surface hover:bg-stone-100 border-border text-ink-secondary hover:text-ink-primary'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSaved ? 'Tersimpan' : 'Simpan Isu'}</span>
          </button>

          <button
            onClick={handleOpenKajian}
            className="py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-btn text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Naskah Bahan Kajian</span>
          </button>
        </div>
      </div>

      {/* ISSUE HERO / HEADER */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <LocationBadge location={issue.location} district={issue.district} />
          <CategoryBadge category={issue.category} />
          <StatusBadge status={issue.status} />
          <ConfidenceExplainer 
            score={issue.confidence_score} 
            confidenceScore={issue.confidence_score}
            evidenceScore={issue.evidence_score}
            sourcesCount={issue.sources_count}
            explanation={issue.confidence_meta} 
          />
          {issue.is_unviral_priority && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              Belum Viral · Dampak Tinggi
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink-primary tracking-tight leading-tight">
          {issue.title}
        </h1>

        <p className="text-sm sm:text-base text-ink-secondary leading-relaxed max-w-4xl">
          {issue.description}
        </p>

        {/* METADATA STRIP */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-ink-tertiary pt-2 border-t border-border/80">
          <div>Terdeteksi: {formatDateIndo(issue.first_detected_at)}</div>
          <div>·</div>
          <div>Pembaruan: {formatDateIndo(issue.last_updated_at)}</div>
          <div>·</div>
          <div>Jumlah Rujukan: {issue.sources_count} Sumber</div>
          <div>·</div>
          <div className="text-emerald-700 font-sans font-medium">● Pantauan Terhubung</div>
        </div>
      </div>

      {/* METRIC SCORES CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface rounded-card border border-border p-4 shadow-subtle space-y-1">
          <span className="text-[10px] uppercase font-bold text-ink-tertiary">Impact Score</span>
          <div className="text-2xl font-bold font-mono text-primary">{issue.impact_score}/100</div>
          <p className="text-[10px] text-ink-tertiary">Derajat kerentanan warga</p>
        </div>

        <div className="bg-surface rounded-card border border-border p-4 shadow-subtle space-y-1">
          <span className="text-[10px] uppercase font-bold text-ink-tertiary">Evidence Score</span>
          <div className="text-2xl font-bold font-mono text-ink-primary">{issue.evidence_score}/100</div>
          <p className="text-[10px] text-ink-tertiary">Kekuatan data rujukan</p>
        </div>

        <div className="bg-surface rounded-card border border-border p-4 shadow-subtle space-y-1">
          <span className="text-[10px] uppercase font-bold text-ink-tertiary">Confidence Score</span>
          <div className="text-2xl font-bold font-mono text-ink-primary">{issue.confidence_score || 80}/100</div>
          <p className="text-[10px] text-ink-tertiary">Indikator konsistensi sumber</p>
        </div>

        <div className="bg-surface rounded-card border border-border p-4 shadow-subtle space-y-1">
          <span className="text-[10px] uppercase font-bold text-ink-tertiary">Priority Score</span>
          <div className="text-2xl font-bold font-mono text-ink-primary">{issue.priority_score || 85}/100</div>
          <p className="text-[10px] text-ink-tertiary">Urgensi advokasi GMNI</p>
        </div>
      </div>

      {/* 3-TIER EXPLANATION DEPTH: RINGKAS (PUBLIK) | ANALISIS MENDALAM (KADER) | DOSSIER RISET 18 BAB (PENELITI) */}
      <IssueExplanationDepth issue={issue} />

      {/* DETAILED EVIDENCE AND INVESTIGATION WORKSPACE */}
      <div className="pt-6 border-t border-border space-y-8">
        
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-ink-primary">
            Arsip Evidensi & Instrumen Investigasi Lengkap
          </h2>
          <p className="text-xs text-ink-secondary">
            Eksplorasi data mentah, pemetaan aktor, klasifikasi fakta vs klaim, dan rujukan media terverifikasi.
          </p>
        </div>

        {/* MAIN TWO-COLUMN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: EVIDENCE & FACT ANALYSIS (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* WHAT CHANGED (CHANGE DETECTION) */}
            <WhatChangedSection changeSummary={issue.what_changed} lastUpdatedAt={issue.last_updated_at} />

            {/* CONTRADICTION DETECTION */}
            {issue.contradictions && issue.contradictions.length > 0 && (
              <ContradictionSection contradictions={issue.contradictions} />
            )}

            {/* FACT VS CLAIM */}
            <FactVsClaim issueId={issue.id} claims={issueClaims} />

            {/* EVIDENCE LOCKER */}
            <EvidenceLocker
              sources={issueSources}
              evidenceBreakdown={issue.evidence_breakdown}
              confidenceScore={issue.confidence_score}
            />

            {/* ACTIVITY TIMELINE (PERKEMBANGAN ISU) */}
            <IssueEventsTimeline events={issue.events} />

            {/* AI SUMMARIZER */}
            <AISummarizer summary={issue.summary_ai} />

            {/* MARHAENISM FRAMEWORK */}
            <MarhaenismAnalysis analysis={issue.marhaenism_analysis} />

            {/* ACTOR MAP */}
            <ActorMap actors={issueActors} />
          </div>

          {/* RIGHT COLUMN: RECOMMENDATIONS & CHARTS (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* RESEARCH RECOMMENDATION */}
            <AIRecommender recommendation={issue.research_recommendation} onProceedToKajian={handleOpenKajian} />

            {/* MOMENTUM TREND */}
            <MomentumChart trend={issue.momentum_trend} />

            {/* ACTION BUTTON TO AI ANALYST WORKBENCH */}
            <div className="bg-stone-900 text-white rounded-card p-6 space-y-4 shadow-subtle">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                    AI Policy Workbench
                  </span>
                </div>
                <h3 className="text-base font-bold">
                  Bedah Isu di AI Analyst
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Jalankan 8 instrumen analisis kritis dialektis, uji kontradiksi, dan susun draf naskah kebijakan.
                </p>
              </div>

              <Link
                href={`/ai-analyst?issue=${issue.id}`}
                className="w-full py-2.5 px-4 rounded-btn bg-primary hover:bg-primary-hover text-white text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Buka AI Analyst Workbench</span>
              </Link>
            </div>

          </div>

        </div>

      </div>

      {/* KAJIAN DOCUMENT MODAL */}
      {activeKajianDoc && (
        <KajianDocModal
          isOpen={isKajianModalOpen}
          onClose={() => setIsKajianModalOpen(false)}
          doc={activeKajianDoc}
        />
      )}

    </div>
  );
}
