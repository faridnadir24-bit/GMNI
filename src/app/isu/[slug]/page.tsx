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
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-ink-secondary">Menghubungkan ke basis data...</p>
      </div>
    );
  }

  const issueClaims = claims.filter(c => c.issue_id === issue.id);
  const issueSources = sources.filter(s => s.issue_id === issue.id);
  const issueActors = mockActors.filter(a => a.issue_id === issue.id);
  const isSaved = savedIssueIds.includes(issue.id);

  const handleOpenKajian = () => {
    const existing = mockKajianDocs.find(k => k.issue_id === issue.id);
    if (existing) {
      setActiveKajianDoc(existing);
    } else {
      const newDoc: BahanKajianDocument = {
        id: `kajian-${Date.now()}`,
        issue_id: issue.id,
        issue_title: issue.title,
        title: `Naskah Kebijakan: Penanganan Isu ${issue.title}`,
        subtitle: `Kajian Bidang Sosial Politik GMNI Komisariat Wastukancana Purwakarta`,
        author: 'Bidang Sosial Politik GMNI Wastukancana',
        komisariat: 'GMNI Komisariat Wastukancana – Purwakarta',
        date_created: new Date().toISOString().slice(0, 10),
        status: 'Draft',
        sections: {
          latar_belakang: issue.summary_ai.what_happened + ' ' + issue.summary_ai.why_important,
          rumusan_masalah: issue.marhaenism_analysis.critical_questions.length > 0
            ? issue.marhaenism_analysis.critical_questions
            : [
                `Bagaimana akar persoalan ${issue.title}?`,
                `Siapa kelompok masyarakat yang paling rentan terdampak?`,
                `Apa rekomendasi alternatif kebijakan advokasi GMNI?`
              ],
          data_dan_fakta: [
            issue.summary_ai.what_happened,
            `Dampak terverifikasi pada ${issue.summary_ai.who_is_affected.join(', ')}`
          ],
          kronologi_singkat: [
            `Terdeteksi: ${issue.first_detected_at.slice(0, 10)}`,
            `Pembaruan terakhir: ${issue.last_updated_at.slice(0, 10)}`
          ],
          pihak_terkait: issue.summary_ai.key_stakeholders.flatMap(s => s.entities.map(e => ({ nama: e, peran: s.category, posisi: 'Terkait' }))),
          analisis_sosial_politik: issue.marhaenism_analysis.sosio_demokrasi,
          perspektif_marhaenisme: issue.marhaenism_analysis.sosio_nasionalisme,
          dampak_masyarakat: issue.summary_ai.who_is_affected.join('; '),
          alternatif_kebijakan: [
            'Moratorium kebijakan sepihak dan pembukaan ruang dengar pendapat publik secara partisipatif.',
            'Penyusunan regulasi perlindungan afirmatif bagi kelompok rentan dan masyarakat lokal.'
          ],
          rekomendasi_advokasi: [
            'Menyerahkan naskah policy paper kepada DPRD dan instansi terkait.',
            'Membuka forum konsolidasi kader dan aliansi masyarakat terdampak.'
          ],
          daftar_pustaka: issueSources.map(s => ({
            title: s.title,
            source: s.source_name,
            year: '2026'
          }))
        }
      };
      setActiveKajianDoc(newDoc);
    }
    setIsKajianModalOpen(true);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* TOP BREADCRUMB & ACTIONS */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <Link
          href="/isu"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-secondary hover:text-ink-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Isu</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-surface hover:bg-stone-100 text-ink-secondary hover:text-ink-primary border border-border text-xs font-medium transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Tersalin' : 'Bagikan'}</span>
          </button>

          <button
            onClick={() => toggleSaveIssue(issue.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn border text-xs font-medium transition-colors ${
              isSaved
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-surface hover:bg-stone-100 text-ink-secondary hover:text-ink-primary border border-border'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Tersimpan di Dokumen' : 'Simpan Isu'}</span>
          </button>

          <button
            onClick={handleOpenKajian}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-btn bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
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
          <ConfidenceExplainer confidenceMeta={issue.confidence_meta} score={issue.confidence_score} />
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
          <div className="text-emerald-700 font-sans font-medium">● Near Real-Time Synced</div>
        </div>
      </div>

      {/* APA YANG BERUBAH? (CHANGE DETECTION MODULE) */}
      <WhatChangedSection 
        changeSummary={issue.what_changed} 
        lastUpdatedAt={issue.last_updated_at} 
      />

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

      {/* CONTRADICTION & DATA DISCREPANCY MODULE */}
      <ContradictionSection contradictions={issue.contradictions} />

      {/* MODULE: MENGAPA ISU INI MENINGKAT? */}
      {issue.why_rising && (
        <div className="bg-surface rounded-card border border-border p-5 space-y-3 shadow-subtle">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink-primary">
              Mengapa Isu Ini Meningkat?
            </h3>
            <span className="text-xs font-mono font-bold text-primary">
              ({issue.why_rising.percentage_24h} dalam 24 jam terakhir)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
            {issue.why_rising.factors.map((factor, idx) => (
              <div
                key={idx}
                className="p-3 bg-stone-50 rounded border border-border/80 text-xs text-ink-primary font-medium"
              >
                {factor}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MAIN TWO-COLUMN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: EVIDENCE & FACT ANALYSIS (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          
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
