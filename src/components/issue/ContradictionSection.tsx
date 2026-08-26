'use client';

import React from 'react';
import { AlertTriangle, Scale, ExternalLink } from 'lucide-react';
import { Contradiction } from '@/types';
import { formatDateIndo } from '@/lib/utils';

interface ContradictionSectionProps {
  contradictions?: Contradiction[];
}

export default function ContradictionSection({ contradictions }: ContradictionSectionProps) {
  if (!contradictions || contradictions.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface rounded-card border border-border p-5 sm:p-6 space-y-4 shadow-subtle">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <div className="p-1.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
          <Scale className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-ink-primary">
            Uji Konsistensi & Perbedaan Data
          </h3>
          <p className="text-[11px] text-ink-secondary">
            Pencatatan ketidaksesuaian angka, klaim, atau pernyataan antar sumber rujukan
          </p>
        </div>
      </div>

      {/* Contradiction Cards */}
      <div className="space-y-3">
        {contradictions.map((c, idx) => (
          <div
            key={c.id || idx}
            className="p-4 bg-amber-50/40 rounded-btn border border-amber-200/80 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">
                {c.topic}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-100 text-amber-800 border border-amber-200">
                Perbedaan Terdeteksi
              </span>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Source A */}
              <div className="p-3 bg-white rounded-btn border border-border/80 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-ink-primary">{c.source_a.source_name}</span>
                  <span className="text-ink-tertiary">{formatDateIndo(c.source_a.published_at)}</span>
                </div>
                <p className="text-ink-secondary italic leading-relaxed">
                  "{c.source_a.statement}"
                </p>
              </div>

              {/* Source B */}
              <div className="p-3 bg-white rounded-btn border border-border/80 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-ink-primary">{c.source_b.source_name}</span>
                  <span className="text-ink-tertiary">{formatDateIndo(c.source_b.published_at)}</span>
                </div>
                <p className="text-ink-secondary italic leading-relaxed">
                  "{c.source_b.statement}"
                </p>
              </div>
            </div>

            {/* Explanation Note */}
            <div className="text-[11px] text-ink-secondary bg-white/70 p-2.5 rounded border border-amber-200/50 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <span>{c.discrepancy_explanation}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
