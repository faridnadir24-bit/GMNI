'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  MapPin, 
  Activity, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Database,
  Flame,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { Issue } from '@/types';
import { getStatusBadgeStyle, formatDateIndo } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

interface PriorityBoardProps {
  issues: Issue[];
  title?: string;
  subtitle?: string;
  limit?: number;
}

export default function PriorityBoard({
  issues,
  title = "Isu yang Perlu Diperhatikan",
  subtitle = "Peringkat isu berdasarkan kalkulasi Impact, Evidence, dan Momentum perhatian publik.",
  limit
}: PriorityBoardProps) {
  const router = useRouter();
  const { savedIssueIds, toggleSaveIssue } = useApp();

  const displayIssues = limit ? issues.slice(0, limit) : issues;

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-sans">
              {title}
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 bg-red-50 text-gmni-red border border-red-200 rounded-full">
              {issues.length} Prioritas
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {subtitle}
          </p>
        </div>

        <Link
          href="/isu"
          className="inline-flex items-center gap-1 text-xs font-semibold text-gmni-red hover:text-red-700 transition-colors"
        >
          <span>Lihat Semua Isu</span>
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
              className="bg-white rounded-xl border border-slate-200 shadow-subtle hover:shadow-card-hover hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden group relative"
            >
              {/* Top Accent Bar */}
              <div className={`h-1 w-full ${isHighPriority ? 'bg-gmni-red' : 'bg-slate-300'}`} />

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                
                {/* Header Badge & Action */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {isHighPriority && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-red-600 text-white uppercase tracking-wider">
                          🔴 PRIORITAS TINGGI
                        </span>
                      )}
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadgeStyle(issue.status)}`}>
                        {issue.status}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleSaveIssue(issue.id)}
                      className="text-slate-400 hover:text-gmni-red transition-colors p-1"
                      title={isSaved ? "Hapus dari pantauan tersimpan" : "Simpan ke daftar pantauan"}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-gmni-red fill-gmni-red" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Title */}
                  <Link href={`/isu/${issue.slug}`} className="block group-hover:text-gmni-red transition-colors">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                      {issue.title}
                    </h3>
                  </Link>

                  {/* Region & Category Meta */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-[11px] text-slate-500">
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                      <MapPin className="w-3 h-3 text-red-500" />
                      {issue.location} {issue.district ? `(${issue.district})` : ''}
                    </span>
                    <span>•</span>
                    <span className="text-slate-600 truncate">{issue.category}</span>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {issue.description}
                  </p>
                </div>

                {/* Score Indicators Matrix */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white p-1.5 rounded border border-slate-200/80 shadow-2xs">
                      <div className="text-[10px] text-slate-500 font-medium">Impact</div>
                      <div className="text-xs font-bold text-red-700 font-mono">
                        {issue.impact_score}<span className="text-[9px] font-normal text-slate-400">/100</span>
                      </div>
                    </div>
                    <div className="bg-white p-1.5 rounded border border-slate-200/80 shadow-2xs">
                      <div className="text-[10px] text-slate-500 font-medium">Evidence</div>
                      <div className="text-xs font-bold text-slate-800 font-mono">
                        {issue.evidence_score}<span className="text-[9px] font-normal text-slate-400">/100</span>
                      </div>
                    </div>
                    <div className="bg-white p-1.5 rounded border border-slate-200/80 shadow-2xs">
                      <div className="text-[10px] text-slate-500 font-medium">Momentum</div>
                      <div className="text-xs font-bold text-amber-700 font-mono">
                        {issue.momentum_score}<span className="text-[9px] font-normal text-slate-400">/100</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span className="inline-flex items-center gap-1">
                      <Database className="w-3 h-3 text-slate-400" />
                      {issue.sources_count} Sumber Data
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3" />
                      Update: {formatDateIndo(issue.last_updated_at)}
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-1 flex items-center gap-2">
                  <Link
                    href={`/ai-analyst?issue=${issue.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Analisis Isu</span>
                  </Link>

                  <Link
                    href={`/isu/${issue.slug}`}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200"
                    title="Buka Lembar Fakta & Detail"
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
