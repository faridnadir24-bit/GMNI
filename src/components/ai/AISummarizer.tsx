'use client';

import React from 'react';
import { IssueAISummary } from '@/types';

interface AISummarizerProps {
  summary: IssueAISummary;
}

export default function AISummarizer({ summary }: AISummarizerProps) {
  return (
    <div className="bg-surface rounded-card border border-border p-6 space-y-6 shadow-subtle">
      
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h3 className="text-sm sm:text-base font-bold text-ink-primary">
          Ringkasan Eksekutif & Struktur Fakta
        </h3>
        <p className="text-xs text-ink-secondary mt-0.5">
          Sintesis data berbasis sumber rujukan terverifikasi.
        </p>
      </div>

      <div className="space-y-5 text-xs sm:text-sm">
        
        {/* Apa yang terjadi */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-primary">
            1. Peristiwa Pokok
          </h4>
          <p className="text-ink-secondary leading-relaxed">
            {summary.what_happened}
          </p>
        </div>

        {/* Mengapa penting */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-primary">
            2. Signifikansi & Dampak Kebijakan
          </h4>
          <p className="text-ink-secondary leading-relaxed">
            {summary.why_important}
          </p>
        </div>

        {/* Kelompok terdampak */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-primary">
            3. Kelompok Masyarakat Terdampak
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-ink-secondary text-xs">
            {summary.who_is_affected.map((aff, idx) => (
              <li key={idx}>{aff}</li>
            ))}
          </ul>
        </div>

        {/* Celah Data */}
        <div className="space-y-2 pt-2 border-t border-border">
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-primary">
            4. Celah Informasi (Data Gap)
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-ink-secondary text-xs">
            {summary.unknown_gaps.map((gap, idx) => (
              <li key={idx}>{gap}</li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
}
