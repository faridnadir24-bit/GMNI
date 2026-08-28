'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  AlertTriangle, 
  RefreshCw, 
  BookOpen, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles,
  ChevronDown,
  ListOrdered,
  Layers,
  HelpCircle,
  Scale,
  CheckCircle2,
  UserCheck,
  TrendingUp,
  Share2,
  Presentation,
  Users,
  Radio,
  FileCheck,
  Clock
} from 'lucide-react';
import { ResearchDossier, Issue, DossierCitation, DossierMode } from '@/types';
import { formatDateIndo } from '@/lib/utils';
import { 
  exportDossierToMarkdown, 
  markDossierReviewed, 
  generateMediaBrief,
  generatePolicyBrief,
  generatePresentationDeck,
  generateMeetingNotes,
  generateSocialMediaContent,
  generatePressConferenceBrief,
  calculateResearchQualityScore,
  generateDataTable
} from '@/lib/services/dossier-engine';
import SourceDrawer from './SourceDrawer';

interface DossierViewProps {
  dossier: ResearchDossier;
  issue: Issue;
  onRefreshDossier?: () => void;
  isRefreshing?: boolean;
}

export default function DossierView({
  dossier: initialDossier,
  issue,
  onRefreshDossier,
  isRefreshing = false
}: DossierViewProps) {
  const [dossier, setDossier] = useState<ResearchDossier>(initialDossier);
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState(false);
  const [activeChapterId, setActiveChapterId] = useState<string>(dossier.chapters[0]?.id || '');
  const [selectedFormatMode, setSelectedFormatMode] = useState<DossierMode>('naskah_kajian');
  
  // Source Drawer state
  const [selectedCitation, setSelectedCitation] = useState<DossierCitation | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Human Review Modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState('Kader Peneliti Sospol');

  const handleOpenSourceDrawer = (badgeOrCitation: string | DossierCitation) => {
    if (typeof badgeOrCitation === 'string') {
      const match = dossier.sources_list.find(s => s.badge === badgeOrCitation || badgeOrCitation.includes(s.badge));
      if (match) {
        setSelectedCitation(match);
        setIsDrawerOpen(true);
      }
    } else {
      setSelectedCitation(badgeOrCitation);
      setIsDrawerOpen(true);
    }
  };

  const handleExportMarkdown = () => {
    const mdContent = exportDossierToMarkdown(dossier);
    
    // Download file
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DOSSIER_${issue.slug || issue.id}_21BAB.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Copy to clipboard
    navigator.clipboard.writeText(mdContent);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollToChapter = (chapId: string) => {
    setActiveChapterId(chapId);
    const el = document.getElementById(chapId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleApplyReview = () => {
    const updated = markDossierReviewed(
      dossier, 
      reviewerName, 
      'Tim Peneliti Sospol GMNI',
      'Telah diverifikasi: Seluruh data empiris, angka kuantitatif, atribusi klaim, dan rujukan sitasi sesuai standar riset kebijakan.'
    );
    setDossier(updated);
    setIsReviewModalOpen(false);
  };

  // Helper to render paragraph with clickable citation badges
  const renderParagraphWithCitations = (text: string) => {
    const parts = text.split(/(\[Sumber \d+\])/g);
    return parts.map((part, index) => {
      if (/^\[Sumber \d+\]$/.test(part)) {
        return (
          <button
            key={index}
            onClick={() => handleOpenSourceDrawer(part)}
            className="inline-flex items-center gap-0.5 mx-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-mono font-bold transition-transform hover:scale-105 cursor-pointer"
            title="Klik untuk melihat register verifikasi rujukan ini"
          >
            <span>{part}</span>
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Multi-Mode Artifact Generators
  const issueClaims = (issue as any).claims || [];
  const issueSources = (issue as any).sources || [];
  const mediaBrief = generateMediaBrief(issue, issueSources, issueClaims);
  const policyBrief = generatePolicyBrief(issue, issueSources, issueClaims);
  const presentationDeck = generatePresentationDeck(issue, issueSources, issueClaims);
  const meetingNotes = generateMeetingNotes(issue, issueSources, issueClaims);
  const socialContent = generateSocialMediaContent(issue, issueSources, issueClaims);
  const pressConferenceBrief = generatePressConferenceBrief(issue, issueSources, issueClaims);
  const researchQuality = calculateResearchQualityScore(issue, dossier.sources_list, dossier);
  const dataTableItems = generateDataTable(issue, dossier.sources_list);

  const copyCustomFormat = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFormat(true);
    setTimeout(() => setCopiedFormat(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="bg-surface rounded-card border border-border p-4 sm:p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded text-[10px] font-bold font-mono uppercase tracking-wider">
              Deep Policy Dossier · 21 Bab Lengkap
            </span>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold font-mono uppercase tracking-wider">
              Cakupan Sitasi: {dossier.citation_coverage}%
            </span>
            {dossier.publication_readiness === 'PUBLICATION_READY' ? (
              <span className="px-2 py-0.5 bg-emerald-700 text-white rounded text-[10px] font-bold font-mono uppercase tracking-wider inline-flex items-center gap-1 shadow-2xs">
                <ShieldCheck className="w-3 h-3" />
                PUBLICATION READY
              </span>
            ) : dossier.publication_readiness === 'RESEARCH_REVIEWED' ? (
              <span className="px-2 py-0.5 bg-blue-700 text-white rounded text-[10px] font-bold font-mono uppercase tracking-wider inline-flex items-center gap-1">
                <FileCheck className="w-3 h-3" />
                RESEARCH REVIEWED
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded text-[10px] font-bold font-mono uppercase tracking-wider inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                RESEARCH DRAFT
              </span>
            )}
            <span className="text-xs font-mono text-ink-tertiary">
              Versi {dossier.version}.0
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-ink-primary">
            Naskah Berkas Riset & Advokasi Kebijakan Kerakyatan
          </h2>
          <p className="text-xs text-ink-secondary">
            Disusun secara komprehensif berbasis data empiris, uji kontradiksi, pemetaan aktor, dan pisau bedah Marhaenisme.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onRefreshDossier && (
            <button
              onClick={onRefreshDossier}
              disabled={isRefreshing}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-ink-primary rounded-btn text-xs font-semibold inline-flex items-center gap-1.5 transition-colors border border-border disabled:opacity-50"
              title="Perbarui data dossier"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Perbarui</span>
            </button>
          )}

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className={`px-3 py-1.5 rounded-btn text-xs font-semibold inline-flex items-center gap-1.5 transition-colors border ${
              dossier.human_review?.is_reviewed 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{dossier.human_review?.is_reviewed ? 'Terverifikasi Peneliti' : 'Tinjau Naskah'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-ink-primary rounded-btn text-xs font-semibold inline-flex items-center gap-1.5 transition-colors border border-border"
            title="Cetak Berkas Kajian"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak</span>
          </button>

          <button
            onClick={handleExportMarkdown}
            className="px-3.5 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-btn text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-subtle"
            title="Ekspor ke format Markdown (.md)"
          >
            {copiedMd ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            <span>{copiedMd ? 'Tersalin!' : 'Ekspor .MD'}</span>
          </button>
        </div>
      </div>

      {/* Mode / Format Selector: "Jadikan Naskah" */}
      <div className="bg-surface rounded-card border border-border p-2 sm:p-2.5 shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold text-ink-secondary px-2 uppercase tracking-wider shrink-0">
          Format Dokumen:
        </span>
        {[
          { id: 'naskah_kajian', label: 'Naskah Kajian (21 Bab)', icon: BookOpen },
          { id: 'policy_brief', label: 'Policy Brief (Eksekutif)', icon: FileText },
          { id: 'presentation', label: 'Bahan Presentasi', icon: Presentation },
          { id: 'meeting_notes', label: 'Naskah Rapat Sospol', icon: Users },
          { id: 'media_brief', label: 'Media Brief (Rilis Pers)', icon: Share2 },
          { id: 'social_content', label: 'Konten Sosial Media', icon: Sparkles },
          { id: 'press_conference', label: 'Brief Konferensi Pers', icon: Radio }
        ].map(fmt => {
          const isActive = selectedFormatMode === fmt.id;
          const Icon = fmt.icon;
          return (
            <button
              key={fmt.id}
              onClick={() => setSelectedFormatMode(fmt.id as DossierMode)}
              className={`px-3 py-1.5 rounded-btn text-xs font-medium transition-all shrink-0 inline-flex items-center gap-1.5 ${
                isActive
                  ? 'bg-ink-primary text-white font-bold shadow-xs'
                  : 'text-ink-secondary hover:bg-stone-100 hover:text-ink-primary'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{fmt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Human Review Banner if Reviewed */}
      {dossier.human_review?.is_reviewed && (
        <div className="p-3.5 rounded-card bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Naskah Telah Ditinjau oleh Peneliti: {dossier.human_review.reviewer_name}</div>
            <div className="text-emerald-800/80 text-[11px] mt-0.5">
              {dossier.human_review.review_notes} ({formatDateIndo(dossier.human_review.reviewed_at || '')})
            </div>
          </div>
        </div>
      )}

      {/* Quality Gate or Stale Warnings */}
      {dossier.quality_warning && (
        <div className="p-3.5 rounded-card bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Peringatan Metodologis Riset</div>
            <div className="text-amber-800 text-[11px] mt-0.5">{dossier.quality_warning}</div>
          </div>
        </div>
      )}

      {/* RENDER VIEW ACCORDING TO SELECTED FORMAT */}
      {selectedFormatMode === 'policy_brief' ? (
        /* POLICY BRIEF VIEW */
        <div className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-primary uppercase">Format Policy Brief Eksekutif</span>
              <h2 className="text-xl font-bold text-ink-primary mt-1">{policyBrief.title}</h2>
            </div>
            <button
              onClick={() => copyCustomFormat(JSON.stringify(policyBrief, null, 2))}
              className="px-3 py-1.5 rounded-btn bg-stone-100 hover:bg-stone-200 text-xs font-semibold inline-flex items-center gap-1.5"
            >
              {copiedFormat ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFormat ? 'Tersalin!' : 'Salin Brief'}</span>
            </button>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-ink-primary font-serif">
            <div className="p-4 rounded-card bg-stone-50 border border-border space-y-2">
              <div className="font-bold text-xs uppercase font-sans text-ink-primary">Ringkasan Eksekutif</div>
              <p className="leading-relaxed">{renderParagraphWithCitations(policyBrief.executive_summary)}</p>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-xs uppercase font-sans text-ink-primary">Konteks & Urgensi Intervensi</div>
              <p className="leading-relaxed">{renderParagraphWithCitations(policyBrief.context_and_urgency)}</p>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-xs uppercase font-sans text-ink-primary">Temuan Kunci (Key Findings)</div>
              <div className="space-y-1.5">
                {policyBrief.key_findings.map((kf, i) => (
                  <div key={i} className="p-2.5 rounded bg-stone-50 border border-border">{kf}</div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-card bg-emerald-50/50 border border-emerald-200/70 space-y-2">
                <div className="font-bold text-xs uppercase font-sans text-emerald-900">Rekomendasi Jangka Pendek</div>
                <div className="space-y-1 text-xs">
                  {policyBrief.actionable_recommendations.short_term.map((r, i) => (
                    <div key={i}>• {r}</div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-card bg-blue-50/50 border border-blue-200/70 space-y-2">
                <div className="font-bold text-xs uppercase font-sans text-blue-900">Rekomendasi Jangka Menengah</div>
                <div className="space-y-1 text-xs">
                  {policyBrief.actionable_recommendations.medium_term.map((r, i) => (
                    <div key={i}>• {r}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : selectedFormatMode === 'presentation' ? (
        /* PRESENTATION DECK VIEW */
        <div className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-primary uppercase">Bahan Presentasi / Slide Deck Outline</span>
              <h2 className="text-xl font-bold text-ink-primary mt-1">{presentationDeck.deck_title}</h2>
              <p className="text-xs text-ink-secondary mt-0.5">Target Audiens: {presentationDeck.target_audience}</p>
            </div>
            <button
              onClick={() => copyCustomFormat(JSON.stringify(presentationDeck, null, 2))}
              className="px-3 py-1.5 rounded-btn bg-stone-100 hover:bg-stone-200 text-xs font-semibold inline-flex items-center gap-1.5"
            >
              {copiedFormat ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFormat ? 'Tersalin!' : 'Salin Slide'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {presentationDeck.slides.map(slide => (
              <div key={slide.slide_number} className="p-5 rounded-card border border-border bg-stone-50/70 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-primary">
                  <span>SLIDE {slide.slide_number}</span>
                </div>
                <h3 className="text-sm font-bold text-ink-primary">{slide.title}</h3>
                <div className="space-y-1.5 text-xs text-ink-secondary">
                  {slide.bullet_points.map((bp, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="text-primary font-bold">•</span>
                      <span>{renderParagraphWithCitations(bp)}</span>
                    </div>
                  ))}
                </div>
                <div className="p-2.5 rounded bg-white border border-border text-[11px] text-ink-tertiary italic">
                  <strong>Speaker Notes:</strong> {slide.speaker_notes}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : selectedFormatMode === 'meeting_notes' ? (
        /* MEETING NOTES VIEW */
        <div className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-primary uppercase">Naskah Rapat Sospol & Diskusi Komisariat</span>
              <h2 className="text-xl font-bold text-ink-primary mt-1">{meetingNotes.agenda_title}</h2>
            </div>
            <button
              onClick={() => copyCustomFormat(JSON.stringify(meetingNotes, null, 2))}
              className="px-3 py-1.5 rounded-btn bg-stone-100 hover:bg-stone-200 text-xs font-semibold inline-flex items-center gap-1.5"
            >
              {copiedFormat ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFormat ? 'Tersalin!' : 'Salin Naskah Rapat'}</span>
            </button>
          </div>

          <div className="space-y-5 text-xs sm:text-sm text-ink-primary">
            {/* Spoken Script ready to be read aloud */}
            <div className="p-4 rounded-card bg-stone-50 border border-border space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs uppercase text-primary tracking-wider">
                  🎙️ Naskah Pengantar Rapat (Dapat Langsung Dibacakan)
                </div>
                <button
                  onClick={() => copyCustomFormat(meetingNotes.spoken_script)}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Salin Naskah Pidato
                </button>
              </div>
              <p className="text-xs sm:text-sm font-serif text-ink-secondary leading-relaxed whitespace-pre-line italic bg-white p-3.5 rounded border border-border">
                "{meetingNotes.spoken_script}"
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-xs uppercase text-ink-primary">1. Basis Faktual Pokok</div>
              <div className="space-y-1.5">
                {meetingNotes.factual_basis.map((fb, i) => (
                  <div key={i} className="p-2.5 rounded bg-stone-50 border border-border">{fb}</div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-xs uppercase text-ink-primary">2. Pertanyaan Kritis Forum</div>
              <div className="space-y-1.5">
                {meetingNotes.critical_questions.map((cq, i) => (
                  <div key={i} className="p-2.5 rounded bg-amber-50/60 border border-amber-200 text-amber-900 font-medium">{cq}</div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-xs uppercase text-ink-primary">3. Posisi Ideologis & Sikap Politik</div>
              <div className="p-3 rounded bg-blue-50/70 border border-blue-200 text-blue-950 font-serif leading-relaxed">
                {meetingNotes.discussion_position}
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-xs uppercase text-ink-primary">4. Rencana Aksi & Pembagian Tim</div>
              <div className="space-y-1.5">
                {meetingNotes.action_plan_items.map((ap, i) => (
                  <div key={i} className="p-2.5 rounded bg-emerald-50/60 border border-emerald-200 text-emerald-900">{ap}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : selectedFormatMode === 'media_brief' ? (
        /* MEDIA BRIEF VIEW */
        <div className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-primary uppercase">Media Brief & Rilis Pers Kerakyatan</span>
              <h2 className="text-xl font-bold text-ink-primary mt-1">{mediaBrief.title}</h2>
              <p className="text-xs text-ink-secondary mt-0.5">{mediaBrief.subtitle}</p>
            </div>
            <button
              onClick={() => copyCustomFormat(JSON.stringify(mediaBrief, null, 2))}
              className="px-3 py-1.5 rounded-btn bg-stone-100 hover:bg-stone-200 text-xs font-semibold inline-flex items-center gap-1.5"
            >
              {copiedFormat ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFormat ? 'Tersalin!' : 'Salin Media Brief'}</span>
            </button>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-ink-primary">
            <div className="space-y-2">
              <div className="font-bold text-xs uppercase text-ink-primary">5 Fakta Utama</div>
              <div className="space-y-1.5">
                {mediaBrief.five_key_facts.map((f, i) => (
                  <div key={i} className="p-2.5 rounded bg-stone-50 border border-border">{renderParagraphWithCitations(f)}</div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-xs uppercase text-ink-primary">3 Data Kuantitatif Kunci</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {mediaBrief.three_key_data.map((d, i) => (
                  <div key={i} className="p-3 rounded-card bg-stone-50 border border-border text-center space-y-1">
                    <div className="text-[11px] text-ink-secondary">{d.label}</div>
                    <div className="text-base font-bold text-primary">{d.value}</div>
                    <div className="text-[10px] text-ink-tertiary font-mono">{d.source}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-card bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
              <strong>Caveat Metodologis:</strong> {mediaBrief.one_caveat}
            </div>
          </div>
        </div>
      ) : selectedFormatMode === 'social_content' ? (
        /* KONTEN SOSIAL MEDIA VIEW */
        <div className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-primary uppercase">Generator Konten Sosial Media & Advokasi Publik</span>
              <h2 className="text-xl font-bold text-ink-primary mt-1">{socialContent.issue_title}</h2>
              <p className="text-xs text-ink-secondary mt-0.5">{socialContent.disclaimer}</p>
            </div>
            <button
              onClick={() => copyCustomFormat(JSON.stringify(socialContent, null, 2))}
              className="px-3 py-1.5 rounded-btn bg-stone-100 hover:bg-stone-200 text-xs font-semibold inline-flex items-center gap-1.5"
            >
              {copiedFormat ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFormat ? 'Tersalin!' : 'Salin Semua Konten'}</span>
            </button>
          </div>

          {/* 1. Instagram Carousel Deck */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-ink-primary uppercase tracking-wider">
                1. Instagram Carousel (5 Slide)
              </h3>
              <button
                onClick={() => copyCustomFormat(socialContent.instagram_carousel.map(s => `[SLIDE ${s.slide}]\n${s.headline}\n${s.body}\nSitasi: ${s.citation}`).join('\n\n'))}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Salin Carousel
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {socialContent.instagram_carousel.map(slide => (
                <div key={slide.slide} className="p-3.5 rounded-card bg-stone-50 border border-border space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-primary">SLIDE {slide.slide}</span>
                    <div className="text-xs font-bold text-ink-primary leading-snug">{slide.headline}</div>
                    <p className="text-[11px] text-ink-secondary leading-relaxed font-serif">{slide.body}</p>
                  </div>
                  <div className="text-[10px] font-mono text-ink-tertiary pt-2 border-t border-border">{slide.citation}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. X / Twitter Thread */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-ink-primary uppercase tracking-wider">
                2. Utas X / Twitter Thread (5 Tweets)
              </h3>
              <button
                onClick={() => copyCustomFormat(socialContent.twitter_thread.map(t => t.text).join('\n\n'))}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Salin Utas X
              </button>
            </div>
            <div className="space-y-2">
              {socialContent.twitter_thread.map(tweet => (
                <div key={tweet.tweet_number} className="p-3 rounded-card bg-stone-50 border border-border text-xs text-ink-primary flex items-start gap-2.5">
                  <span className="font-bold text-primary font-mono">{tweet.tweet_number}.</span>
                  <div className="leading-relaxed">{tweet.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Short Video Script & Caption */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="p-4 rounded-card bg-stone-50 border border-border space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-ink-primary uppercase">Naskah Video Singkat (Reels / TikTok / Shorts)</div>
                <button
                  onClick={() => copyCustomFormat(`HOOK: ${socialContent.short_video_script.hook}\n\nBODY:\n${socialContent.short_video_script.body_points.join('\n')}\n\nCTA: ${socialContent.short_video_script.call_to_action}`)}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Salin Naskah
                </button>
              </div>
              <div className="text-xs space-y-2 font-serif text-ink-secondary">
                <div><strong className="text-ink-primary font-sans">Hook:</strong> {socialContent.short_video_script.hook}</div>
                <div>
                  <strong className="text-ink-primary font-sans">Poin Utama:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    {socialContent.short_video_script.body_points.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div><strong className="text-ink-primary font-sans">Call to Action:</strong> {socialContent.short_video_script.call_to_action}</div>
                <div className="text-[10px] font-mono text-ink-tertiary pt-1 border-t border-border">{socialContent.short_video_script.source_citation}</div>
              </div>
            </div>

            <div className="p-4 rounded-card bg-stone-50 border border-border space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-ink-primary uppercase">Caption Instagram Feed</div>
                <button
                  onClick={() => copyCustomFormat(socialContent.instagram_caption)}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Salin Caption
                </button>
              </div>
              <div className="text-xs font-serif text-ink-secondary whitespace-pre-line leading-relaxed bg-white p-3 rounded border border-border">
                {socialContent.instagram_caption}
              </div>
            </div>
          </div>

        </div>
      ) : selectedFormatMode === 'press_conference' ? (
        /* PRESS CONFERENCE STATEMENT & Q&A VIEW */
        <div className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-subtle space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-primary uppercase">Format Brief Konferensi Pers & Pernyataan Sikap</span>
              <h2 className="text-xl font-bold text-ink-primary mt-1">{pressConferenceBrief.statement_title}</h2>
            </div>
            <button
              onClick={() => copyCustomFormat(`${pressConferenceBrief.statement_title}\n\n${pressConferenceBrief.opening_statement}\n\nPOIN ARGUMENTASI:\n${pressConferenceBrief.core_arguments.join('\n')}\n\nTUNTUTAN SIKAP:\n${pressConferenceBrief.demands_and_calls_to_action.join('\n')}`)}
              className="px-3 py-1.5 rounded-btn bg-stone-100 hover:bg-stone-200 text-xs font-semibold inline-flex items-center gap-1.5"
            >
              {copiedFormat ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFormat ? 'Tersalin!' : 'Salin Naskah Sikap'}</span>
            </button>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-ink-primary font-serif">
            <div className="p-4 rounded-card bg-red-50/50 border border-red-200/70 space-y-2">
              <div className="font-bold text-xs uppercase font-sans text-red-900">Pernyataan Pembuka (Opening Statement)</div>
              <p className="leading-relaxed text-justify">{renderParagraphWithCitations(pressConferenceBrief.opening_statement)}</p>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-xs uppercase font-sans text-ink-primary">Pokok Argumentasi Kerakyatan</div>
              <div className="space-y-2">
                {pressConferenceBrief.core_arguments.map((arg: string, idx: number) => (
                  <div key={idx} className="p-3 rounded bg-stone-50 border border-border leading-relaxed">
                    {renderParagraphWithCitations(arg)}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-xs uppercase font-sans text-primary">Tuntutan Konkret & Panggilan Aksi</div>
              <div className="space-y-2">
                {pressConferenceBrief.demands_and_calls_to_action.map((d: string, idx: number) => (
                  <div key={idx} className="p-3 rounded bg-amber-50/60 border border-amber-200 font-bold text-amber-950 flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="font-bold text-xs uppercase font-sans text-ink-primary">Panduan Tanya-Jawab Juru Bicara (Spokesperson Q&A)</div>
              <div className="space-y-3 font-sans">
                {pressConferenceBrief.spokesperson_qna.map((qna: { question: string; suggested_answer: string; source_basis: string }, idx: number) => (
                  <div key={idx} className="p-4 rounded-card bg-stone-50 border border-border space-y-2">
                    <div className="text-xs font-bold text-ink-primary flex items-center gap-1.5">
                      <span className="text-primary">Q{idx+1}:</span> {qna.question}
                    </div>
                    <div className="text-xs text-ink-secondary bg-white p-3 rounded border border-border leading-relaxed font-serif">
                      <strong className="font-sans text-ink-primary">Jawaban Disarankan: </strong>
                      "{qna.suggested_answer}"
                    </div>
                    <div className="text-[10px] font-mono text-ink-tertiary">
                      Dasar Evidensi: {qna.source_basis}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-card bg-stone-100 border border-border text-center text-xs font-bold text-ink-primary">
              {pressConferenceBrief.closing_summary}
            </div>
          </div>
        </div>
      ) : (
        /* DEFAULT: 21-CHAPTER ACADEMIC RESEARCH DOSSIER */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Table of Contents Sticky Drawer (4 Cols) */}
          <div className="lg:col-span-4 bg-surface rounded-card border border-border p-4 shadow-subtle space-y-3 sticky top-20 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center gap-2 pb-2 border-b border-border text-xs font-bold text-ink-primary uppercase tracking-wider">
              <ListOrdered className="w-4 h-4 text-primary" />
              <span>Daftar Isi (21 Bab)</span>
            </div>

            <div className="space-y-1 text-xs">
              {/* Quick anchors */}
              <button
                onClick={() => scrollToChapter('sec-ringkasan-eksekutif')}
                className="w-full text-left px-2 py-1.5 rounded transition-colors text-ink-secondary hover:bg-stone-100 font-semibold"
              >
                ★ Ringkasan Eksekutif & Data Kunci
              </button>

              {dossier.chapters.map((chap) => (
                <button
                  key={chap.id}
                  onClick={() => scrollToChapter(chap.id)}
                  className={`w-full text-left px-2 py-1.5 rounded transition-colors flex items-start gap-2 ${
                    activeChapterId === chap.id
                      ? 'bg-primary/10 text-primary font-bold border-l-2 border-primary'
                      : 'text-ink-secondary hover:bg-stone-100 hover:text-ink-primary'
                  }`}
                >
                  <span className="font-mono text-[10px] w-6 shrink-0 text-ink-tertiary">
                    {chap.number}.
                  </span>
                  <span className="line-clamp-1 leading-snug">
                    {chap.title}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-border space-y-2">
              <div className="text-[11px] text-ink-tertiary">
                Total Rujukan Sitasi: <strong className="text-ink-primary font-bold">{dossier.total_sources_cited} Sumber</strong>
              </div>
              <div className="text-[11px] text-ink-tertiary">
                Cakupan Sitasi Bukti: <strong className="text-emerald-700 font-bold">{dossier.citation_coverage}%</strong>
              </div>
            </div>
          </div>

          {/* RIGHT: The Academic Paper Document (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Paper Cover Header */}
            <div className="bg-surface rounded-card border border-border p-6 sm:p-8 shadow-subtle space-y-4 text-center border-t-4 border-t-primary">
              <div className="text-xs font-mono font-bold tracking-widest text-primary uppercase">
                Pusat Kajian & Riset Kebijakan Publik GMNI
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-ink-primary tracking-tight leading-tight">
                {dossier.issue_title}
              </h1>
              <p className="text-xs sm:text-sm text-ink-secondary max-w-xl mx-auto leading-relaxed">
                {dossier.issue_subtitle}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-3 text-[11px] text-ink-tertiary border-t border-border">
                <span>Lokus: <strong className="text-ink-primary">{dossier.location}</strong></span>
                <span>•</span>
                <span>Sektor: <strong className="text-ink-primary">{dossier.category}</strong></span>
                <span>•</span>
                <span>Diterbitkan: <strong className="text-ink-primary">{formatDateIndo(dossier.generated_at)}</strong></span>
                <span>•</span>
                <span>Oleh: <strong className="text-ink-primary">{dossier.generated_by}</strong></span>
              </div>
            </div>

            {/* SECTION: RINGKASAN EKSEKUTIF & DATA KUNCI */}
            <div id="sec-ringkasan-eksekutif" className="bg-surface rounded-card border border-border p-6 sm:p-7 shadow-subtle space-y-6">
              <div className="border-b border-border pb-3">
                <h2 className="text-base sm:text-lg font-bold text-ink-primary flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY)
                </h2>
                <p className="text-xs text-ink-secondary">Sintesis strategis persoalan, kelompok terdampak, dan rekomendasi awal</p>
              </div>

              <div className="text-sm text-ink-primary leading-relaxed space-y-3 font-serif">
                {renderParagraphWithCitations(dossier.executive_summary)}
              </div>

              {/* RESEARCH QUALITY SCORE CARD */}
              <div className="p-4 rounded-card bg-stone-50 border border-border space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-ink-primary uppercase tracking-wider">
                      Skor Kualitas Riset: {researchQuality.overall_score}/100
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                    TERUJI METODOLOGI
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-white border border-border">
                    <span className="text-ink-tertiary block text-[10px]">Keragaman Sumber</span>
                    <strong className="text-ink-primary font-bold">{researchQuality.source_diversity}%</strong>
                  </div>
                  <div className="p-2 rounded bg-white border border-border">
                    <span className="text-ink-tertiary block text-[10px]">Independensi</span>
                    <strong className="text-ink-primary font-bold">{researchQuality.source_independence}%</strong>
                  </div>
                  <div className="p-2 rounded bg-white border border-border">
                    <span className="text-ink-tertiary block text-[10px]">Cakupan Sitasi</span>
                    <strong className="text-emerald-700 font-bold">{researchQuality.citation_coverage}%</strong>
                  </div>
                  <div className="p-2 rounded bg-white border border-border">
                    <span className="text-ink-tertiary block text-[10px]">Kelengkapan Data</span>
                    <strong className="text-ink-primary font-bold">{researchQuality.data_completeness}%</strong>
                  </div>
                </div>
                <p className="text-[11px] text-ink-secondary italic leading-relaxed">
                  {researchQuality.human_explanation}
                </p>
              </div>

              {/* TABEL DATA KUANTITATIF & STATUS VERIFIKASI */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-ink-primary uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-primary" />
                    <span>Tabel Verifikasi Indikator & Data Empiris</span>
                  </div>
                  <span className="text-[10px] text-ink-tertiary font-normal">
                    Format: | Indikator | Nilai | Sumber | Tahun | Status |
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-border rounded-lg overflow-hidden">
                    <thead className="bg-stone-100 text-ink-primary font-bold">
                      <tr>
                        <th className="p-2.5 border-b border-border">Indikator</th>
                        <th className="p-2.5 border-b border-border">Nilai</th>
                        <th className="p-2.5 border-b border-border">Sumber / Rujukan</th>
                        <th className="p-2.5 border-b border-border">Tahun/Tanggal</th>
                        <th className="p-2.5 border-b border-border">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {dataTableItems.map((row, idx) => (
                        <tr key={idx} className="hover:bg-stone-50/80 transition-colors">
                          <td className="p-2.5 font-semibold text-ink-primary">{row.indicator}</td>
                          <td className="p-2.5 font-bold text-primary">{row.value}</td>
                          <td className="p-2.5 text-ink-secondary">
                            <span className="font-mono text-[10px] text-blue-700 font-bold mr-1">{row.source_badge}</span>
                            {row.source_name}
                          </td>
                          <td className="p-2.5 text-ink-tertiary">{row.date_or_year}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                              row.status === 'TERVERIFIKASI'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : row.status === 'SEBAGIAN'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-stone-100 text-stone-600 border border-stone-300'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* KEY DATA BOX TABLE */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs font-bold text-ink-primary uppercase tracking-wider">
                  <TrendingUp className="w-3.5 h-3.5 text-primary" />
                  <span>DATA KUNCI & INDIKATOR UTAMA</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-border rounded-lg overflow-hidden">
                    <thead className="bg-stone-100 text-ink-primary font-bold">
                      <tr>
                        <th className="p-2.5 border-b border-border">Parameter</th>
                        <th className="p-2.5 border-b border-border">Nilai / Indikator</th>
                        <th className="p-2.5 border-b border-border">Konteks Kebijakan</th>
                        <th className="p-2.5 border-b border-border">Rujukan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {dossier.key_data_box.map((k, idx) => (
                        <tr key={idx} className="hover:bg-stone-50/80 transition-colors">
                          <td className="p-2.5 font-semibold text-ink-primary">{k.parameter}</td>
                          <td className="p-2.5 font-bold text-primary">{k.value}</td>
                          <td className="p-2.5 text-ink-secondary">{k.context}</td>
                          <td className="p-2.5">
                            <button
                              onClick={() => handleOpenSourceDrawer(k.source_badge)}
                              className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-mono text-[11px] font-bold cursor-pointer"
                            >
                              {k.source_badge}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* BENANG MERAH & WHAT THIS MEANS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-card bg-amber-50/60 border border-amber-200/80 space-y-2">
                  <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-800" />
                    Pola Temuan (Benang Merah)
                  </div>
                  <div className="text-xs text-ink-primary leading-relaxed font-serif">
                    {renderParagraphWithCitations(dossier.pattern_interpretation)}
                  </div>
                </div>

                <div className="p-4 rounded-card bg-blue-50/60 border border-blue-200/80 space-y-2">
                  <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-800" />
                    Apa Arti Perkembangan Ini?
                  </div>
                  <div className="text-xs text-ink-primary leading-relaxed font-serif">
                    {renderParagraphWithCitations(dossier.what_this_means)}
                  </div>
                </div>
              </div>
            </div>

            {/* ALL 21 CHAPTERS */}
            {dossier.chapters.map((chap) => (
              <div
                key={chap.id}
                id={chap.id}
                className="bg-surface rounded-card border border-border p-6 sm:p-7 shadow-subtle space-y-5 transition-all"
              >
                {/* Chapter Title */}
                <div className="border-b border-border pb-3">
                  <div className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                    BAB {chap.number}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-ink-primary mt-0.5">
                    {chap.title}
                  </h3>
                  {chap.summary && (
                    <p className="text-xs text-ink-secondary italic mt-1">
                      {chap.summary}
                    </p>
                  )}
                </div>

                {/* Paragraphs */}
                <div className="text-sm text-ink-primary leading-relaxed space-y-3 font-serif">
                  {chap.paragraphs.map((p, idx) => (
                    <p key={idx} className="text-justify leading-relaxed">
                      {renderParagraphWithCitations(p)}
                    </p>
                  ))}
                </div>

                {/* Bullet Points */}
                {chap.bullet_points && chap.bullet_points.length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    {chap.bullet_points.map((bp, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-ink-primary bg-stone-50/60 p-3 rounded border border-border">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <div className="leading-relaxed font-serif">
                          {renderParagraphWithCitations(bp)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Subsections */}
                {chap.subsections && chap.subsections.length > 0 && (
                  <div className="space-y-4 pt-2">
                    {chap.subsections.map((sub, sIdx) => (
                      <div key={sIdx} className="space-y-2 bg-stone-50/40 p-4 rounded-card border border-border">
                        <div className="text-xs font-bold text-ink-primary">
                          {sub.subtitle}
                        </div>
                        <div className="space-y-2 text-xs text-ink-secondary font-serif">
                          {sub.content.map((item, iIdx) => (
                            <div key={iIdx} className="leading-relaxed">
                              {renderParagraphWithCitations(item)}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* CHAPTER XXI: SOURCE REGISTER CARDS */}
            <div className="bg-surface rounded-card border border-border p-6 sm:p-7 shadow-subtle space-y-5">
              <div className="border-b border-border pb-3">
                <div className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                  REGISTER LENGKAP
                </div>
                <h3 className="text-base sm:text-lg font-bold text-ink-primary mt-0.5">
                  Verifikasi Sitasi & Register Dokumen Sumber
                </h3>
                <p className="text-xs text-ink-secondary">
                  Klik kartu rujukan untuk membuka riwayat provenance dan data pendukung
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {dossier.sources_list.map((cit) => (
                  <button
                    key={cit.index}
                    onClick={() => handleOpenSourceDrawer(cit)}
                    className="text-left p-4 rounded-card border border-border bg-stone-50/60 hover:bg-stone-100 hover:border-primary/40 transition-all space-y-2 group shadow-2xs cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-mono text-[10px] font-bold rounded border border-blue-200">
                        {cit.badge}
                      </span>
                      <span className="text-[10px] text-ink-tertiary font-medium">
                        {cit.tier}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-ink-primary group-hover:text-primary transition-colors">
                      {cit.source_name}
                    </div>

                    <div className="text-[11px] text-ink-secondary line-clamp-2 italic font-serif">
                      "{cit.title}"
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-ink-tertiary pt-1 border-t border-border">
                      <span>{cit.published_at ? formatDateIndo(cit.published_at) : 'Tanggal tidak terdata'}</span>
                      <span className="inline-flex items-center gap-1 text-primary font-medium">
                        Detail <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Paper Signature */}
            <div className="p-6 bg-stone-100 rounded-card border border-border text-center space-y-2">
              <div className="text-xs font-bold text-ink-primary">
                RUANG ISU GMNI — PUSAT RISET & ADVOKASI KEBIJAKAN PUBLIK
              </div>
              <div className="text-[11px] text-ink-secondary italic">
                "Pejuang Pemikir – Pemikir Pejuang. Mengakar di tengah rakyat, membedah dengan ilmu, berjuang untuk keadilan."
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Interactive Source Register Drawer */}
      <SourceDrawer
        citation={selectedCitation}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Human Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsReviewModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-surface border border-border rounded-card shadow-2xl z-10 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold text-ink-primary">Verifikasi & Tinjauan Peneliti</h3>
              </div>
            </div>

            <p className="text-xs text-ink-secondary">
              Tandai berkas kajian ini sebagai naskah yang telah ditinjau dan diverifikasi kesahihan evidensinya oleh tim peneliti organisasi.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-ink-primary block mb-1">Nama Peneliti / Verifikator</label>
                <input 
                  type="text" 
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-border bg-white text-ink-primary font-medium"
                />
              </div>

              <div className="p-3 rounded bg-stone-50 border border-border space-y-1 text-[11px] text-ink-secondary">
                <div className="font-bold text-ink-primary mb-1">Checklist Standar Kualitas Riset:</div>
                <div>✓ Seluruh data kuantitatif memiliki rujukan rujukan pers/resmi</div>
                <div>✓ Klaim narasumber diatribusikan secara transparan</div>
                <div>✓ Pisau analisis Marhaenisme dan Trisakti diterapkan secara objektif</div>
                <div>✓ Cakupan sitasi memenuhi standar minimal ($\ge 90\%$)</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="px-3.5 py-1.5 rounded-btn bg-stone-100 text-ink-secondary text-xs font-semibold hover:bg-stone-200"
              >
                Batal
              </button>
              <button
                onClick={handleApplyReview}
                className="px-4 py-1.5 rounded-btn bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-subtle"
              >
                Tandai Terverifikasi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
