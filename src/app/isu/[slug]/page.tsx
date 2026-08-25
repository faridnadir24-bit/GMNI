'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { 
  Sparkles, 
  BookOpen, 
  MapPin, 
  Calendar, 
  Clock, 
  Bookmark, 
  BookmarkCheck, 
  FileText, 
  Scale, 
  ArrowLeft,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Users
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getStatusBadgeStyle, formatDateIndo } from '@/lib/utils';
import FactVsClaim from '@/components/issue/FactVsClaim';
import SourcePanel from '@/components/issue/SourcePanel';
import TimelineView from '@/components/issue/TimelineView';
import MomentumChart from '@/components/issue/MomentumChart';
import ActorMap from '@/components/issue/ActorMap';
import AISummarizer from '@/components/ai/AISummarizer';
import MarhaenismAnalysis from '@/components/ai/MarhaenismAnalysis';
import AIRecommender from '@/components/ai/AIRecommender';
import KajianDocModal from '@/components/ai/KajianDocModal';
import { mockTimelineEvents } from '@/data/mockTimeline';
import { mockActors } from '@/data/mockActors';
import { mockKajianDocs } from '@/data/mockKajian';
import { BahanKajianDocument } from '@/types';

interface IssueDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function IssueDetailPage({ params }: IssueDetailPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { issues, claims, sources, savedIssueIds, toggleSaveIssue, addKajianDoc } = useApp();

  const issue = issues.find(i => i.slug === resolvedParams.slug);

  const [activeTab, setActiveTab] = useState<'facts' | 'sources' | 'timeline' | 'actors' | 'marhaenism'>('facts');
  const [isKajianModalOpen, setIsKajianModalOpen] = useState(false);
  const [activeDoc, setActiveDoc] = useState<BahanKajianDocument | null>(null);

  if (!issue) {
    return notFound();
  }

  const issueClaims = claims.filter(c => c.issue_id === issue.id);
  const issueSources = sources.filter(s => s.issue_id === issue.id);
  const issueTimeline = mockTimelineEvents.filter(t => t.issue_id === issue.id);
  const issueActors = mockActors.filter(a => a.issue_id === issue.id);

  const isSaved = savedIssueIds.includes(issue.id);

  const handleOpenKajian = () => {
    const existingDoc = mockKajianDocs.find(k => k.issue_id === issue.id);
    if (existingDoc) {
      setActiveDoc(existingDoc);
    } else {
      const generatedDoc: BahanKajianDocument = {
        id: `kajian-${Date.now()}`,
        issue_id: issue.id,
        issue_title: issue.title,
        title: `Naskah Kebijakan: Penanganan Strategis ${issue.title}`,
        subtitle: `Kajian Kebijakan Bidang Sosial Politik GMNI Komisariat Wastukancana Purwakarta`,
        author: 'Bidang Sosial Politik GMNI Wastukancana',
        komisariat: 'GMNI Komisariat Wastukancana – Purwakarta',
        date_created: new Date().toISOString().slice(0, 10),
        status: 'Draft',
        sections: {
          latar_belakang: issue.summary_ai.what_happened + ' ' + issue.summary_ai.why_important,
          rumusan_masalah: [
            `Bagaimana akar persoalan struktural dalam ${issue.title}?`,
            `Siapa kelompok masyarakat yang paling rentan dirugikan?`,
            `Apa rekomendasi alternatif kebijakan advokasi GMNI?`
          ],
          data_dan_fakta: issueClaims.filter(c => c.type === 'fact').map(c => `${c.content} (Sumber: ${c.source_name})`),
          kronologi_singkat: issueTimeline.map(t => `${t.date}: ${t.title}`),
          pihak_terkait: issueActors.map(a => ({ nama: a.name, peran: a.role, posisi: a.stance })),
          analisis_sosial_politik: issue.marhaenism_analysis.sosio_demokrasi,
          perspektif_marhaenisme: issue.marhaenism_analysis.sosio_nasionalisme,
          dampak_masyarakat: issue.summary_ai.who_is_affected.join('; '),
          alternatif_kebijakan: [
            'Mendorong pengawasan partisipatif dari unsur legislatif dan masyarakat sipil.',
            'Pemberian perlindungan afirmatif bagi kelompok rentan dan masyarakat lokal.',
            'Transparansi penuh data dan perizinan kepada publik.'
          ],
          rekomendasi_advokasi: [
            'Menyerahkan naskah policy paper kepada DPRD dan instansi terkait.',
            'Membuka forum konsolidasi kader dan aliansi masyarakat terdampak.'
          ],
          daftar_pustaka: issueSources.map(s => ({ title: s.title, source: s.source_name, year: s.published_at.slice(0, 4) }))
        }
      };
      addKajianDoc(generatedDoc);
      setActiveDoc(generatedDoc);
    }
    setIsKajianModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/isu"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Direktori Isu</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSaveIssue(issue.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              isSaved
                ? 'bg-red-50 text-gmni-red border-red-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 fill-gmni-red text-gmni-red" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Dipantau' : 'Pantau Isu'}</span>
          </button>
        </div>
      </div>

      {/* HEADER SECTION (SECTION 9) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-subtle space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {issue.is_purwakarta_priority && (
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded bg-red-600 text-white uppercase tracking-wider">
                🔴 PRIORITAS PURWAKARTA
              </span>
            )}
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadgeStyle(issue.status)}`}>
              Status: {issue.status}
            </span>
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
              {issue.category}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Calendar className="w-3.5 h-3.5" />
            <span>Terdeteksi: {formatDateIndo(issue.first_detected_at)}</span>
          </div>
        </div>

        {/* Title & Location */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans leading-snug">
            {issue.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
            <span className="inline-flex items-center gap-1 text-slate-800 font-bold">
              <MapPin className="w-3.5 h-3.5 text-gmni-red" />
              {issue.location} {issue.district ? `(${issue.district})` : ''}
            </span>
            <span>•</span>
            <span>Provinsi: {issue.province}</span>
            <span>•</span>
            <span>Update Terakhir: {formatDateIndo(issue.last_updated_at)}</span>
          </div>
        </div>

        {/* Top Metric Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-center">
          <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Impact Score</div>
            <div className="text-base sm:text-lg font-extrabold text-red-700 font-mono">{issue.impact_score}/100</div>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Evidence Score</div>
            <div className="text-base sm:text-lg font-extrabold text-slate-800 font-mono">{issue.evidence_score}/100</div>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Momentum Trend</div>
            <div className="text-base sm:text-lg font-extrabold text-amber-700 font-mono">{issue.momentum_score}/100</div>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Sumber Data</div>
            <div className="text-base sm:text-lg font-extrabold text-emerald-700 font-mono">{issue.sources_count} Rujukan</div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
          <Link
            href={`/ai-analyst?issue=${issue.id}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Ringkas & Analisis dengan AI</span>
          </Link>

          <button
            onClick={handleOpenKajian}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gmni-red hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Jadikan Bahan Kajian</span>
          </button>
        </div>

      </div>

      {/* AI SUMMARY COMPONENT (SECTION 9) */}
      <AISummarizer summary={issue.summary_ai} />

      {/* AI RESEARCH RECOMMENDATION SPOTLIGHT (SECTION 20) */}
      <AIRecommender 
        recommendation={issue.research_recommendation} 
        onProceedToKajian={handleOpenKajian}
      />

      {/* MOMENTUM TREND GRAPH (SECTION 14) */}
      <MomentumChart trend={issue.momentum_trend} />

      {/* DETAILED INTERACTIVE TABS */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          {[
            { id: 'facts', label: `✅ Fakta vs Klaim (${issueClaims.length})` },
            { id: 'sources', label: `🏛️ Sumber Terverifikasi (${issueSources.length})` },
            { id: 'timeline', label: `⏱️ Kronologi & Timeline (${issueTimeline.length})` },
            { id: 'actors', label: `👥 Peta Aktor (${issueActors.length})` },
            { id: 'marhaenism', label: '🚩 Perspektif Marhaenisme' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div>
          {activeTab === 'facts' && (
            <FactVsClaim issueId={issue.id} claims={issueClaims} />
          )}

          {activeTab === 'sources' && (
            <SourcePanel issueId={issue.id} sources={issueSources} />
          )}

          {activeTab === 'timeline' && (
            <TimelineView events={issueTimeline} />
          )}

          {activeTab === 'actors' && (
            <ActorMap actors={issueActors} />
          )}

          {activeTab === 'marhaenism' && (
            <MarhaenismAnalysis analysis={issue.marhaenism_analysis} />
          )}
        </div>
      </div>

      {/* Modal Kajian View */}
      {activeDoc && (
        <KajianDocModal
          doc={activeDoc}
          isOpen={isKajianModalOpen}
          onClose={() => setIsKajianModalOpen(false)}
        />
      )}

    </div>
  );
}
