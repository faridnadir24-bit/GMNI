'use client';

import React from 'react';
import { ResearchRecommendation } from '@/types';

interface AIRecommenderProps {
  recommendation: ResearchRecommendation;
  onProceedToKajian?: () => void;
}

export default function AIRecommender({ recommendation }: AIRecommenderProps) {
  return (
    <div className="bg-surface rounded-card border border-border p-6 space-y-5 shadow-subtle">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border pb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-ink-primary">
            Evaluasi Kelayakan Riset Kebijakan
          </h3>
          <p className="text-xs text-ink-secondary mt-0.5">
            Penilaian saintifik-advokasi apakah isu ini memenuhi standar untuk dijadikan bahan kajian resmi.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-ink-primary">
            Keputusan: <strong>{recommendation.verdict}</strong>
          </span>
          <span className="text-ink-tertiary">·</span>
          <span className="font-mono text-ink-secondary">
            Skor: {recommendation.score}/100
          </span>
        </div>
      </div>

      {/* Rubric Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 bg-stone-50/70 rounded-btn border border-border/80 space-y-1">
          <span className="text-ink-tertiary font-semibold uppercase text-[10px]">Relevansi Gerakan</span>
          <p className="text-ink-primary leading-snug">{recommendation.relevance_notes}</p>
        </div>
        <div className="p-3.5 bg-stone-50/70 rounded-btn border border-border/80 space-y-1">
          <span className="text-ink-tertiary font-semibold uppercase text-[10px]">Urgensi Waktu</span>
          <p className="text-ink-primary leading-snug">{recommendation.urgency_notes}</p>
        </div>
        <div className="p-3.5 bg-stone-50/70 rounded-btn border border-border/80 space-y-1">
          <span className="text-ink-tertiary font-semibold uppercase text-[10px]">Ketersediaan Data</span>
          <p className="text-ink-primary leading-snug">{recommendation.data_availability}</p>
        </div>
        <div className="p-3.5 bg-stone-50/70 rounded-btn border border-border/80 space-y-1">
          <span className="text-ink-tertiary font-semibold uppercase text-[10px]">Dampak Kaum Marhaen</span>
          <p className="text-ink-primary leading-snug">{recommendation.grassroots_impact}</p>
        </div>
        <div className="p-3.5 bg-stone-50/70 rounded-btn border border-border/80 space-y-1">
          <span className="text-ink-tertiary font-semibold uppercase text-[10px]">Potensi Advokasi</span>
          <p className="text-ink-primary leading-snug">{recommendation.policy_potential}</p>
        </div>
        <div className="p-3.5 bg-stone-50/70 rounded-btn border border-border/80 space-y-1">
          <span className="text-ink-tertiary font-semibold uppercase text-[10px]">Sudut Pandang Advokasi</span>
          <p className="text-ink-primary font-medium leading-snug">{recommendation.suggested_angle}</p>
        </div>
      </div>

    </div>
  );
}
