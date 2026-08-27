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
  ListOrdered
} from 'lucide-react';
import { ResearchDossier, Issue } from '@/types';
import { formatDateIndo } from '@/lib/utils';
import { exportDossierToMarkdown } from '@/lib/services/dossier-engine';

interface DossierViewProps {
  dossier: ResearchDossier;
  issue: Issue;
  onRefreshDossier?: () => void;
  isRefreshing?: boolean;
}

export default function DossierView({
  dossier,
  issue,
  onRefreshDossier,
  isRefreshing = false
}: DossierViewProps) {
  const [copiedMd, setCopiedMd] = useState(false);
  const [activeChapterId, setActiveChapterId] = useState<string>(dossier.chapters[0]?.id || '');

  const handleExportMarkdown = () => {
    const mdContent = exportDossierToMarkdown(dossier);
    
    // Download file
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DOSSIER_${issue.slug || issue.id}.md`);
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

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="bg-surface rounded-card border border-border p-4 sm:p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded text-[10px] font-bold font-mono uppercase tracking-wider">
              AI Research Dossier · 18 Bab
            </span>
            <span className="text-xs font-mono text-ink-tertiary">
              Versi {dossier.version}.0
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-ink-primary">
            Berkas Riset & Advokasi Kebijakan
          </h2>
          <p className="text-xs text-ink-secondary">
            Disusun secara deterministik berbasis rujukan media, klaim faktual, dan rekam linimasa terverifikasi.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {onRefreshDossier && (
            <button
              onClick={onRefreshDossier}
              disabled={isRefreshing}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-ink-primary rounded-btn text-xs font-semibold inline-flex items-center gap-1.5 transition-colors border border-border disabled:opacity-50"
              title="Perbarui data dossier"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Memperbarui...' : 'Perbarui Dossier'}</span>
            </button>
          )}

          <button
            onClick={handleExportMarkdown}
            className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-btn text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
            <span>{copiedMd ? 'Tersalin & Terunduh' : 'Ekspor Markdown (.md)'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-ink-primary rounded-btn text-xs font-semibold inline-flex items-center gap-1.5 transition-colors border border-border"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Naskah</span>
          </button>
        </div>
      </div>

      {/* Quality Gate Warning Banner */}
      {dossier.quality_warning && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-card flex items-start gap-3 text-amber-900 text-xs leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="font-bold">Peringatan Kualitas & Kehati-hatian Metodologis</div>
            <div>{dossier.quality_warning}</div>
          </div>
        </div>
      )}

      {/* Staleness Banner if out of sync */}
      {dossier.is_stale && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-card flex items-center justify-between gap-3 text-blue-900 text-xs">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{dossier.staleness_reason || 'Terdapat data/rujukan baru yang belum dikompilasi ke dalam dossier ini.'}</span>
          </div>
          {onRefreshDossier && (
            <button
              onClick={onRefreshDossier}
              className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded text-[11px] font-semibold shrink-0"
            >
              Sinkronkan Sekarang
            </button>
          )}
        </div>
      )}

      {/* Table of Contents Quick Nav */}
      <div className="bg-surface rounded-card border border-border p-4 shadow-subtle space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border text-xs text-ink-secondary">
          <div className="flex items-center gap-2 font-bold text-ink-primary">
            <ListOrdered className="w-4 h-4 text-primary" />
            <span>Daftar Isi 18 Bab Kajian</span>
          </div>
          <span className="text-[11px] font-mono text-ink-tertiary">
            {dossier.chapters.length} Bab Terstruktur
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5 text-xs">
          {dossier.chapters.map(chap => (
            <button
              key={chap.id}
              onClick={() => scrollToChapter(chap.id)}
              className={`p-2 rounded text-left truncate transition-colors border text-[11px] ${
                activeChapterId === chap.id
                  ? 'bg-stone-900 text-white border-stone-900 font-semibold shadow-sm'
                  : 'bg-stone-50/60 hover:bg-stone-100 border-border/80 text-ink-primary'
              }`}
            >
              <div className="font-mono text-[10px] opacity-70">BAB {chap.number}</div>
              <div className="truncate font-medium">{chap.title}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Dossier Chapters Document View */}
      <div className="bg-surface rounded-card border border-border shadow-subtle divide-y divide-border overflow-hidden">
        
        {/* Document Header Cover */}
        <div className="p-6 sm:p-8 bg-stone-50/60 space-y-3 border-b border-border">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-ink-tertiary">
            <span>DOKUMEN RISET KEBIJAKAN GMNI WASTUKANCANA</span>
            <span>{formatDateIndo(dossier.generated_at)}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-ink-primary leading-snug">
            {dossier.issue_title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-ink-secondary pt-2 border-t border-border/80">
            <div>Disusun: {dossier.generated_by}</div>
            <div>·</div>
            <div>Keyakinan Evidensi: {dossier.confidence_at_generation}%</div>
            <div>·</div>
            <div>Sitasi Terindeks: {dossier.total_sources_cited} Sumber</div>
          </div>
        </div>

        {/* Chapters Content */}
        {dossier.chapters.map(chap => (
          <article 
            key={chap.id} 
            id={chap.id}
            className="p-6 sm:p-8 space-y-4 scroll-mt-20 hover:bg-stone-50/30 transition-colors"
          >
            {/* Chapter Heading */}
            <div className="space-y-1 pb-2 border-b border-border/80">
              <div className="text-xs font-mono font-bold text-primary tracking-wider">
                BAB {chap.number}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-ink-primary">
                {chap.title}
              </h3>
              {chap.summary && (
                <p className="text-xs text-ink-tertiary italic">
                  {chap.summary}
                </p>
              )}
            </div>

            {/* Paragraphs */}
            {chap.paragraphs && chap.paragraphs.length > 0 && (
              <div className="space-y-3 text-xs sm:text-sm text-ink-secondary leading-relaxed">
                {chap.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
            )}

            {/* Bullet points */}
            {chap.bullet_points && chap.bullet_points.length > 0 && (
              <ul className="space-y-2 text-xs sm:text-sm text-ink-secondary bg-stone-50/60 p-4 rounded-card border border-border/60">
                {chap.bullet_points.map((b, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Subsections */}
            {chap.subsections && chap.subsections.length > 0 && (
              <div className="space-y-3 pt-2">
                {chap.subsections.map((sub, sIdx) => (
                  <div key={sIdx} className="p-4 bg-stone-50 rounded border border-border space-y-2">
                    <h4 className="font-bold text-xs sm:text-sm text-ink-primary">
                      {sub.subtitle}
                    </h4>
                    <ul className="space-y-1 text-xs text-ink-secondary">
                      {sub.content.map((c, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-1.5">
                          <span className="text-stone-400 mt-0.5">–</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Citations list for Chapter XVIII */}
            {chap.citations && chap.citations.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {chap.citations.map(cit => (
                  <div key={cit.source_id} className="p-3 bg-stone-50 rounded border border-border space-y-1 text-xs">
                    <div className="flex items-center justify-between font-mono text-[11px] text-ink-tertiary">
                      <span className="font-bold text-primary">{cit.badge}</span>
                      <span>{cit.tier}</span>
                    </div>
                    <div className="font-semibold text-ink-primary">
                      {cit.source_name}
                    </div>
                    <div className="text-ink-secondary text-[11px] line-clamp-2">
                      "{cit.title}"
                    </div>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-ink-tertiary">
                      <span>{cit.published_at ? formatDateIndo(cit.published_at) : 'Tanggal tidak terdata'}</span>
                      {cit.url && cit.url !== '#' && (
                        <a 
                          href={cit.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-0.5"
                        >
                          <span>Buka Rujukan</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </article>
        ))}

        {/* Document Footer Note */}
        <div className="p-6 bg-stone-900 text-stone-300 text-center space-y-1 text-xs">
          <div className="font-mono text-[11px] tracking-wider text-stone-400 uppercase">
            Ruang Isu GMNI Wastukancana – Purwakarta
          </div>
          <div className="text-stone-100 font-semibold">
            "Pejuang Pemikir – Pemikir Pejuang"
          </div>
        </div>

      </div>

    </div>
  );
}
