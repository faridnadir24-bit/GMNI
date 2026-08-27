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
  TrendingUp
} from 'lucide-react';
import { ResearchDossier, Issue, DossierCitation } from '@/types';
import { formatDateIndo } from '@/lib/utils';
import { exportDossierToMarkdown, markDossierReviewed } from '@/lib/services/dossier-engine';
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
  const [activeChapterId, setActiveChapterId] = useState<string>(dossier.chapters[0]?.id || '');
  
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

      {/* Main Dossier Grid: TOC + Content Paper */}
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
                            className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-mono text-[11px] font-bold"
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
                  className="text-left p-4 rounded-card border border-border bg-stone-50/60 hover:bg-stone-100 hover:border-primary/40 transition-all space-y-2 group shadow-2xs"
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
