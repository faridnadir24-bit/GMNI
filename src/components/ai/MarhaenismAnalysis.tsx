'use client';

import React from 'react';
import { MarhaenismAnalysis as MarhaenismType } from '@/types';

interface MarhaenismAnalysisProps {
  analysis: MarhaenismType;
}

export default function MarhaenismAnalysis({ analysis }: MarhaenismAnalysisProps) {
  return (
    <div className="bg-surface rounded-card border border-border p-6 space-y-6 shadow-subtle">
      
      {/* Header */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm sm:text-base font-bold text-ink-primary">
            Pisau Analisis Perspektif Marhaenisme GMNI
          </h3>
          <span className="text-[10px] font-semibold px-2 py-0.5 bg-stone-100 text-ink-secondary rounded border border-border">
            Kerangka Ideologis
          </span>
        </div>
        <p className="text-xs text-ink-secondary mt-0.5">
          Uji keberpihakan kebijakan terhadap kaum Marhaen (petani gurem, buruh rentan, dan rakyat pekerja kecil).
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-stone-50/70 border border-border rounded-btn space-y-1.5">
          <h4 className="font-bold text-ink-primary uppercase tracking-wider text-[11px]">
            Sosio-Nasionalisme
          </h4>
          <p className="text-ink-secondary leading-relaxed">
            {analysis.sosio_nasionalisme}
          </p>
        </div>

        <div className="p-4 bg-stone-50/70 border border-border rounded-btn space-y-1.5">
          <h4 className="font-bold text-ink-primary uppercase tracking-wider text-[11px]">
            Sosio-Demokrasi
          </h4>
          <p className="text-ink-secondary leading-relaxed">
            {analysis.sosio_demokrasi}
          </p>
        </div>

        <div className="p-4 bg-stone-50/70 border border-border rounded-btn space-y-1.5">
          <h4 className="font-bold text-ink-primary uppercase tracking-wider text-[11px]">
            Kedaulatan Trisakti
          </h4>
          <p className="text-ink-secondary leading-relaxed">
            {analysis.trisakti_perspective}
          </p>
        </div>
      </div>

      {/* Pembelaan Kaum Marhaen */}
      <div className="p-4 bg-stone-50 border border-border rounded-btn space-y-1.5 text-xs">
        <div className="font-semibold text-ink-primary">
          Fokus Pembelaan Kaum Marhaen:
        </div>
        <p className="text-ink-secondary leading-relaxed">
          {analysis.pro_poor_advocacy_notes}
        </p>
      </div>

      {/* Pertanyaan Kritis */}
      <div className="space-y-2 pt-2 border-t border-border text-xs">
        <div className="font-semibold text-ink-primary">
          Pertanyaan Dialektis untuk Forum Kajian:
        </div>
        <ul className="list-decimal pl-5 space-y-1 text-ink-secondary">
          {analysis.critical_questions.map((cq, idx) => (
            <li key={idx} className="leading-relaxed">{cq}</li>
          ))}
        </ul>
      </div>

    </div>
  );
}
