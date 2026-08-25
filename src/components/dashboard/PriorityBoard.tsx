'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { Issue } from '@/types';
import { formatDateIndo } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import LocationBadge from '@/components/ui/LocationBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import ScoreIndicator from '@/components/ui/ScoreIndicator';

interface PriorityBoardProps {
  issues: Issue[];
  title?: string;
  subtitle?: string;
  limit?: number;
}

export default function PriorityBoard({
  issues,
  title = "Isu Prioritas Pemantauan",
  subtitle = "Peringkat isu berdasarkan skor dampak kebijakan dan ketersediaan bukti sumber data.",
  limit
}: PriorityBoardProps) {
  const { savedIssueIds, toggleSaveIssue } = useApp();
  const displayIssues = limit ? issues.slice(0, limit) : issues;

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-ink-primary">
            {title}
          </h2>
          <p className="text-xs text-ink-secondary mt-0.5">
            {subtitle}
          </p>
        </div>

        <Link
          href="/isu"
          className="text-xs font-semibold text-primary hover:text-gmni-deep transition-colors inline-flex items-center gap-1 shrink-0"
        >
          <span>Buka Semua Isu</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayIssues.map(issue => {
          const isSaved = savedIssueIds.includes(issue.id);
          const isHighPriority = issue.priority_level === 'Tinggi' || issue.impact_score >= 85;

          return (
            <div
              key={issue.id}
              className="bg-surface rounded-card border border-border p-5 shadow-subtle hover:border-stone-400 hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Meta Top: Status & Priority */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={issue.status} />
                    {isHighPriority && (
                      <span className="text-[11px] font-semibold text-primary">
                        Prioritas Tinggi
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleSaveIssue(issue.id)}
                    className="text-ink-tertiary hover:text-primary transition-colors p-1"
                    title={isSaved ? "Hapus dari pantauan tersimpan" : "Simpan ke daftar pantauan"}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-4 h-4 text-primary fill-primary" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Title */}
                <Link href={`/isu/${issue.slug}`} className="block group-hover:text-primary transition-colors">
                  <h3 className="text-sm sm:text-base font-bold text-ink-primary leading-snug">
                    {issue.title}
                  </h3>
                </Link>

                {/* Location & Category Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <LocationBadge location={issue.location} district={issue.district} size="sm" />
                  <CategoryBadge category={issue.category} />
                </div>

                {/* Summary */}
                <p className="text-xs text-ink-secondary line-clamp-2 leading-relaxed">
                  {issue.description}
                </p>
              </div>

              {/* Score Indicators Matrix */}
              <div className="space-y-3 pt-3 border-t border-border/80">
                <div className="space-y-2 bg-stone-50/60 p-3 rounded-btn border border-border/60">
                  <ScoreIndicator label="Impact Score" score={issue.impact_score} accent={issue.impact_score >= 85} />
                  <ScoreIndicator label="Evidence Score" score={issue.evidence_score} />
                  <ScoreIndicator label="Momentum" score={issue.momentum_score} />
                </div>

                {/* Footnote meta */}
                <div className="flex items-center justify-between text-[11px] text-ink-tertiary">
                  <span>{issue.sources_count} sumber</span>
                  <span>Diperbarui {formatDateIndo(issue.last_updated_at)}</span>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <Link
                    href={`/ai-analyst?issue=${issue.id}`}
                    className="flex-1 text-center py-2 px-3 bg-ink-primary hover:bg-black text-white text-xs font-semibold rounded-btn transition-colors"
                  >
                    Analisis
                  </Link>

                  <Link
                    href={`/isu/${issue.slug}`}
                    className="py-2 px-3 bg-surface hover:bg-muted text-ink-primary text-xs font-medium rounded-btn border border-border transition-colors"
                  >
                    Detail
                  </Link>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}
