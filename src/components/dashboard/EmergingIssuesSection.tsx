'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Issue } from '@/types';
import LocationBadge from '@/components/ui/LocationBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatDateIndo } from '@/lib/utils';

interface EmergingIssuesSectionProps {
  issues: Issue[];
}

export default function EmergingIssuesSection({ issues }: EmergingIssuesSectionProps) {
  // Emerging definition: first_detected_at within last 24h OR status is Emerging/Monitoring
  const emergingIssues = issues.filter(i => {
    const diffHours = (Date.now() - new Date(i.first_detected_at || i.last_updated_at).getTime()) / (1000 * 60 * 60);
    return i.status === 'Emerging' || diffHours <= 24;
  }).slice(0, 3);

  if (emergingIssues.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink-primary">
              Isu yang Baru Muncul (Deteksi 24 Jam)
            </h2>
            <p className="text-xs text-ink-secondary">
              Persoalan yang baru teridentifikasi dan sedang dalam tahap pengumpulan bukti awal
            </p>
          </div>
        </div>

        <Link
          href="/isu?status=emerging"
          className="text-xs font-semibold text-primary hover:text-gmni-deep transition-colors inline-flex items-center gap-1 shrink-0"
        >
          <span>Lihat Semua</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {emergingIssues.map(issue => (
          <div
            key={issue.id}
            className="bg-surface rounded-card border border-border p-4 shadow-subtle hover:border-stone-400 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <StatusBadge status={issue.status} />
                <span className="text-[11px] font-mono text-ink-tertiary">
                  Confidence: {issue.confidence_score || 50}%
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
              <span>{issue.sources_count} sumber terdaftar</span>
              <Link href={`/isu/${issue.slug}`} className="font-semibold text-primary hover:underline">
                Buka Isu →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
