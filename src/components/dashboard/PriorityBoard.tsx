'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Bookmark, BookmarkCheck, AlertTriangle, RefreshCw } from 'lucide-react';
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
  const { savedIssueIds, toggleSaveIssue, isLoadingDb, dataStatus, refreshDbData } = useApp();
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

      {isLoadingDb && displayIssues.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface rounded-card border border-border p-5 shadow-subtle space-y-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-12 bg-muted rounded w-full" />
              <div className="h-16 bg-stone-100 rounded" />
            </div>
          ))}
        </div>
      ) : dataStatus === 'error' && displayIssues.length === 0 ? (
        <div className="bg-surface rounded-card border border-red-200 p-8 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
          <p className="text-sm font-semibold text-ink-primary">Data pantauan belum dapat dimuat</p>
          <p className="text-xs text-ink-secondary max-w-sm mx-auto">Terjadi kendala saat menghubungkan ke basis data server. Silakan muat ulang.</p>
          <button
            onClick={() => refreshDbData()}
            className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-btn hover:bg-stone-800 inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Muat Ulang Data</span>
          </button>
        </div>
      ) : displayIssues.length === 0 ? (
        <div className="bg-surface rounded-card border border-border p-8 text-center space-y-2">
          <p className="text-sm font-semibold text-ink-primary">Belum ada isu terpantau</p>
          <p className="text-xs text-ink-secondary">Basis data sedang terhubung. Jalankan sinkronisasi berita untuk memuat isu baru.</p>
        </div>
      ) : (
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
                  <h3 className="text-sm sm:text-base font-bold text-ink-primary line-clamp-2 leading-snug">
                    {issue.title}
                  </h3>
                </Link>

                {/* Description */}
                <p className="text-xs text-ink-secondary line-clamp-3 leading-relaxed">
                  {issue.description}
                </p>

                {/* Badges: Location & Category */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <LocationBadge location={issue.location} district={issue.district} size="sm" />
                  <CategoryBadge category={issue.category} />
                </div>
              </div>

              {/* Score Strip */}
              <div className="pt-3 border-t border-border space-y-3">
                <div className="grid grid-cols-4 gap-1.5 text-center bg-stone-50/60 p-2 rounded border border-border/60">
                  <ScoreIndicator label="Dampak" score={issue.impact_score} />
                  <ScoreIndicator label="Bukti" score={issue.evidence_score} />
                  <ScoreIndicator label="Momentum" score={issue.momentum_score} />
                  <ScoreIndicator label="Keyakinan" score={issue.confidence_score || 75} />
                </div>

                {/* Card Bottom: Sources Count & Date */}
                <div className="flex items-center justify-between text-[11px] text-ink-tertiary">
                  <span className="font-mono">
                    {issue.sources_count} Rujukan Media
                  </span>
                  <span>
                    {formatDateIndo(issue.last_updated_at)}
                  </span>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
