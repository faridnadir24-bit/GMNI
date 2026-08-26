'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowRight, GitCommit, Sparkles } from 'lucide-react';
import { Issue } from '@/types';
import LocationBadge from '@/components/ui/LocationBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatDateIndo } from '@/lib/utils';

interface FastChangingIssuesSectionProps {
  issues: Issue[];
}

export default function FastChangingIssuesSection({ issues }: FastChangingIssuesSectionProps) {
  // Sort by momentum and events activity
  const fastChanging = [...issues]
    .filter(i => (i.events && i.events.length > 1) || i.momentum_score >= 70)
    .sort((a, b) => (b.momentum_score || 0) - (a.momentum_score || 0))
    .slice(0, 3);

  if (fastChanging.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-stone-100 text-primary border border-border">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink-primary">
              Isu dengan Perubahan Tercepat
            </h2>
            <p className="text-xs text-ink-secondary">
              Berdasarkan penambahan rujukan berita, rilis resmi, dan eskalasi momentum kebijakan
            </p>
          </div>
        </div>

        <Link
          href="/pantauan?tab=changes"
          className="text-xs font-semibold text-primary hover:text-gmni-deep transition-colors inline-flex items-center gap-1 shrink-0"
        >
          <span>Pantau Perubahan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fastChanging.map(issue => (
          <div
            key={issue.id}
            className="bg-surface rounded-card border border-border p-4 shadow-subtle hover:border-stone-400 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-primary font-bold">
                  <span>Momentum: {issue.momentum_score}%</span>
                </div>
                <span className="text-[11px] font-mono text-ink-tertiary">
                  {issue.sources_count} rujukan
                </span>
              </div>

              <Link href={`/isu/${issue.slug}`} className="block group-hover:text-primary transition-colors">
                <h3 className="text-xs sm:text-sm font-bold text-ink-primary line-clamp-2 leading-snug">
                  {issue.title}
                </h3>
              </Link>

              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <LocationBadge location={issue.location} district={issue.district} size="sm" />
                <CategoryBadge category={issue.category} />
              </div>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-ink-tertiary">
              <span className="text-emerald-700 font-medium">
                {issue.what_changed?.change_highlights[0] || 'Pembaruan data terkini'}
              </span>
              <Link href={`/isu/${issue.slug}`} className="font-semibold text-primary hover:underline">
                Detail →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
