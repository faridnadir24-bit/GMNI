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
  Check
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatDateIndo } from '@/lib/utils';
import LocationBadge from '@/components/ui/LocationBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import ScoreIndicator from '@/components/ui/ScoreIndicator';

import FactVsClaim from '@/components/issue/FactVsClaim';
import SourcePanel from '@/components/issue/SourcePanel';
import TimelineView from '@/components/issue/TimelineView';
import MomentumChart from '@/components/issue/MomentumChart';
import ActorMap from '@/components/issue/ActorMap';
import AISummarizer from '@/components/ai/AISummarizer';
import MarhaenismAnalysis from '@/components/ai/MarhaenismAnalysis';
import AIRecommender from '@/components/ai/AIRecommender';
import KajianDocModal from '@/components/ai/KajianDocModal';
import { BahanKajianDocument } from '@/types';
import { mockKajianDocs } from '@/data/mockKajian';
import { mockActors } from '@/data/mockActors';
import { mockTimelineEvents } from '@/data/mockTimeline';

export default function IssueDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { issues, claims, sources, savedIssueIds, toggleSaveIssue, addKajianDoc } = useApp();
  const [isKajianModalOpen, setIsKajianModalOpen] = useState(false);
  const [activeKajianDoc, setActiveKajianDoc] = useState<BahanKajianDocument | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const issue = issues.find(i => i.slug === slug);
  if (!issue) {
    notFound();
  }

  const issueClaims = claims.filter(c => c.issue_id === issue.id);
  const issueSources = sources.filter(s => s.issue_id === issue.id);
  const issueActors = mockActors.filter(a => a.issue_id === issue.id);
  const issueTimeline = mockTimelineEvents.filter(t => t.issue_id === issue.id);
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
          rumusan_masalah: [
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
          daftar_pustaka: [
            { title: `Dokumen Terkait ${issue.title}`, source: 'Arsip Riset GMNI Wastukancana', year: '2026' }
          ]
        }
      };
      addKajianDoc(newDoc);
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/isu"
          className="inline-flex items-center gap-1.5 text-xs text-ink-secondary hover:text-ink-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Direktori Isu</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface hover:bg-muted text-ink-secondary text-xs rounded-btn border border-border transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Tersalin' : 'Bagikan'}</span>
          </button>

          <button
            onClick={() => toggleSaveIssue(issue.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-btn border transition-colors ${
              isSaved
                ? 'bg-stone-100 border-primary text-primary font-medium'
                : 'bg-surface hover:bg-muted text-ink-secondary border-border'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Tersimpan' : 'Simpan'}</span>
          </button>
        </div>
      </div>

      {/* EDITORIAL HEADER */}
      <header className="space-y-4 border-b border-border pb-8">
        
        {/* Category & Status Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={issue.category} />
          <LocationBadge location={issue.location} district={issue.district} />
          <StatusBadge status={issue.status} />
          {issue.priority_level === 'Tinggi' && (
            <span className="text-[11px] font-semibold text-primary">
              · Prioritas Kajian
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink-primary tracking-tight leading-tight">
          {issue.title}
        </h1>

        {/* Lead Summary */}
        <p className="text-sm sm:text-base text-ink-secondary leading-relaxed">
          {issue.description}
        </p>

        {/* Metadata & Scores Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/80">
          <ScoreIndicator label="Impact Score" score={issue.impact_score} accent />
          <ScoreIndicator label="Evidence Score" score={issue.evidence_score} />
          <ScoreIndicator label="Momentum" score={issue.momentum_score} />
          
          <div className="space-y-1 text-xs">
            <span className="text-ink-secondary text-[11px]">Validasi Sumber</span>
            <div className="text-xs font-semibold text-ink-primary">
              {issue.sources_count} Rujukan Terdaftar
            </div>
            <div className="text-[10px] text-ink-tertiary">
              Update: {formatDateIndo(issue.last_updated_at)}
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-3">
          <Link
            href={`/ai-analyst?issue=${issue.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-ink-primary hover:bg-black text-white text-xs font-semibold rounded-btn transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-300" />
            <span>Buka di AI Issue Analyst</span>
          </Link>

          <button
            onClick={handleOpenKajian}
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface hover:bg-muted text-ink-primary text-xs font-semibold rounded-btn border border-border transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-ink-secondary" />
            <span>Jadikan Bahan Kajian Siap Cetak</span>
          </button>
        </div>

      </header>

      {/* VERTICAL EDITORIAL CONTENT SECTIONS */}
      <main className="space-y-10">
        
        {/* Section 1: Executive Summary & Facts Structure */}
        <AISummarizer summary={issue.summary_ai} />

        {/* Section 2: Fact vs Claim System */}
        <FactVsClaim issueId={issue.id} claims={issueClaims} />

        {/* Section 3: Sources & Credibility Index */}
        <SourcePanel issueId={issue.id} sources={issueSources} />

        {/* Section 4: Timeline & Chronology */}
        <TimelineView events={issueTimeline} />

        {/* Section 5: Momentum Trend */}
        <MomentumChart trend={issue.momentum_trend} />

        {/* Section 6: Actor Map */}
        <ActorMap actors={issueActors} />

        {/* Section 7: Marhaenism Ideological Framework */}
        <MarhaenismAnalysis analysis={issue.marhaenism_analysis} />

        {/* Section 8: Research Recommendation */}
        <AIRecommender
          recommendation={issue.research_recommendation}
          onProceedToKajian={handleOpenKajian}
        />

      </main>

      {/* Bahan Kajian Document Modal */}
      {activeKajianDoc && (
        <KajianDocModal
          doc={activeKajianDoc}
          isOpen={isKajianModalOpen}
          onClose={() => setIsKajianModalOpen(false)}
        />
      )}

    </div>
  );
}
