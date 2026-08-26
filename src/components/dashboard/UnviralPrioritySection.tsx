'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowRight, Sparkles, Scale } from 'lucide-react';
import { Issue } from '@/types';
import LocationBadge from '@/components/ui/LocationBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import ScoreIndicator from '@/components/ui/ScoreIndicator';

interface UnviralPrioritySectionProps {
  issues: Issue[];
}

export default function UnviralPrioritySection({ issues }: UnviralPrioritySectionProps) {
  const unviralIssues = issues.filter(i => i.is_unviral_priority || (i.impact_score >= 84 && i.momentum_score <= 82)).slice(0, 2);

  if (unviralIssues.length === 0) return null;

  return (
    <div className="bg-surface rounded-card border border-border p-6 space-y-4 shadow-subtle">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border pb-3">
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink-primary">
              Isu yang Patut Diperhatikan
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              Belum Viral · Dampak Tinggi
            </span>
          </div>
          <p className="text-xs text-ink-secondary">
            Persoalan dengan dampak kebijakan dan kerentanan sosial tinggi meskipun belum menjadi perbincangan luas di media sosial.
          </p>
        </div>

        <Link
          href="/isu?filter=unviral"
          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
        >
          <span>Lihat Semua</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {unviralIssues.map(issue => (
          <div
            key={issue.id}
            className="p-4 bg-stone-50/50 rounded-btn border border-border/80 hover:border-stone-400 transition-colors space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <LocationBadge location={issue.location} district={issue.district} size="sm" />
                <CategoryBadge category={issue.category} />
              </div>
              <span className="text-[11px] font-mono text-ink-tertiary">
                {issue.sources_count} Sumber Rujukan
              </span>
            </div>

            <div className="space-y-1">
              <Link href={`/isu/${issue.slug}`} className="group">
                <h4 className="text-sm font-bold text-ink-primary group-hover:text-primary transition-colors line-clamp-2">
                  {issue.title}
                </h4>
              </Link>
              <p className="text-xs text-ink-secondary line-clamp-2 leading-relaxed">
                {issue.description}
              </p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-border/60">
              <div className="grid grid-cols-3 gap-2 text-[11px] bg-white p-2 rounded border border-border/60">
                <div>
                  <span className="text-ink-tertiary block text-[10px]">Impact</span>
                  <strong className="text-primary font-mono">{issue.impact_score}/100</strong>
                </div>
                <div>
                  <span className="text-ink-tertiary block text-[10px]">Evidence</span>
                  <strong className="text-ink-primary font-mono">{issue.evidence_score}/100</strong>
                </div>
                <div>
                  <span className="text-ink-tertiary block text-[10px]">Confidence</span>
                  <strong className="text-ink-primary font-mono">{issue.confidence_score || 80}/100</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-ink-tertiary">
                {issue.why_rising?.factors[0] || 'Prioritas Advokasi Lapangan GMNI'}
              </span>
              <Link
                href={`/isu/${issue.slug}`}
                className="text-xs font-semibold text-ink-primary hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                <span>Telaah Isu</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
