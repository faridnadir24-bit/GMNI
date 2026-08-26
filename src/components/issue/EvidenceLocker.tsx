'use client';

import React, { useState } from 'react';
import { ShieldCheck, ExternalLink, Info, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { Source, EvidenceBreakdown } from '@/types';
import { formatDateIndo } from '@/lib/utils';

interface EvidenceLockerProps {
  sources: Source[];
  evidenceBreakdown?: EvidenceBreakdown;
  confidenceScore?: number;
}

export default function EvidenceLocker({ sources, evidenceBreakdown, confidenceScore = 80 }: EvidenceLockerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Compute breakdown if not provided
  const breakdown = evidenceBreakdown || {
    official: sources.filter(s => s.source_type === 'Official Source').length,
    national_media: sources.filter(s => s.source_type === 'Established Media').length,
    local_media: sources.filter(s => s.source_type === 'Local Media').length,
    social: sources.filter(s => s.source_type === 'Social Media' || s.source_type === 'Public Signal').length,
    public_signal: 0,
    total: sources.length
  };

  return (
    <div className="bg-surface rounded-card border border-border p-5 space-y-4 shadow-subtle">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink-primary">
            Evidence Locker & Mutu Sumber
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 font-semibold text-ink-primary border border-border">
            {sources.length} Sumber Terdaftar
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-secondary">Confidence:</span>
          <span className="text-xs font-mono font-bold text-ink-primary px-2 py-0.5 bg-stone-100 rounded border border-border">
            {confidenceScore}/100
          </span>
        </div>
      </div>

      {/* Breakdown Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2.5 bg-stone-50 rounded border border-border text-center space-y-0.5">
          <div className="text-[10px] text-ink-tertiary uppercase font-medium">Rilis Resmi</div>
          <div className="text-base font-bold font-mono text-ink-primary">{breakdown.official}</div>
          <div className="text-[9px] text-emerald-700 font-mono">Skor Mutu: 95</div>
        </div>

        <div className="p-2.5 bg-stone-50 rounded border border-border text-center space-y-0.5">
          <div className="text-[10px] text-ink-tertiary uppercase font-medium">Media Nasional</div>
          <div className="text-base font-bold font-mono text-ink-primary">{breakdown.national_media}</div>
          <div className="text-[9px] text-blue-700 font-mono">Skor Mutu: 85</div>
        </div>

        <div className="p-2.5 bg-stone-50 rounded border border-border text-center space-y-0.5">
          <div className="text-[10px] text-ink-tertiary uppercase font-medium">Media Lokal</div>
          <div className="text-base font-bold font-mono text-ink-primary">{breakdown.local_media}</div>
          <div className="text-[9px] text-amber-700 font-mono">Skor Mutu: 75</div>
        </div>

        <div className="p-2.5 bg-stone-50 rounded border border-border text-center space-y-0.5">
          <div className="text-[10px] text-ink-tertiary uppercase font-medium">Sinyal Publik</div>
          <div className="text-base font-bold font-mono text-ink-primary">{breakdown.social + breakdown.public_signal}</div>
          <div className="text-[9px] text-stone-500 font-mono">Skor Mutu: 45</div>
        </div>
      </div>

      {/* Internal Indicator Disclaimer */}
      <div className="flex items-start gap-2 p-2.5 bg-stone-50/70 rounded border border-border/80 text-[11px] text-ink-tertiary">
        <Info className="w-3.5 h-3.5 text-ink-tertiary shrink-0 mt-0.5" />
        <span>
          Indikator internal sistem berdasarkan tipe sumber, bukan verifikasi kebenaran independen mutlak. Digunakan sebagai dasar pembobotan analisis AI.
        </span>
      </div>

      {/* Toggle Open Sources List */}
      <div className="pt-1">
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className="w-full py-2 px-3 bg-stone-50 hover:bg-stone-100 rounded text-xs font-semibold text-ink-primary border border-border flex items-center justify-between transition-colors"
        >
          <span>{isOpen ? 'Tutup Daftar Bukti Rujukan' : 'Buka & Periksa Daftar Bukti Rujukan'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isOpen && (
          <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
            {sources.map((src, idx) => (
              <div
                key={src.id || idx}
                className="p-3 bg-white rounded border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:border-stone-400 transition-colors"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-ink-tertiary font-bold">
                      [Source {String(idx + 1).padStart(2, '0')}]
                    </span>
                    <span className="font-semibold text-ink-primary truncate">
                      {src.source_name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-ink-secondary">
                      {src.source_type}
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-secondary truncate">
                    {src.title}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <span className="text-[10px] font-mono text-ink-tertiary">
                    {src.published_at ? formatDateIndo(src.published_at) : 'Terverifikasi'}
                  </span>
                  {src.url && src.url !== '#' && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded hover:bg-stone-100 text-ink-primary hover:text-primary transition-colors"
                      title="Buka tautan sumber"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
