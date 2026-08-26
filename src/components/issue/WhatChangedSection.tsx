'use client';

import React from 'react';
import { 
  GitCommit, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  AlertCircle, 
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { IssueChangeSummary, ChangeSeverity } from '@/types';
import { formatDateIndo } from '@/lib/utils';

interface WhatChangedSectionProps {
  changeSummary?: IssueChangeSummary;
  lastUpdatedAt: string;
}

export default function WhatChangedSection({ changeSummary, lastUpdatedAt }: WhatChangedSectionProps) {
  if (!changeSummary || !changeSummary.has_changes) {
    return (
      <div className="bg-surface rounded-card border border-border p-5 space-y-2 shadow-subtle">
        <div className="flex items-center gap-2 text-ink-primary font-bold text-sm">
          <GitCommit className="w-4 h-4 text-ink-tertiary" />
          <span>Apa yang Berubah?</span>
        </div>
        <p className="text-xs text-ink-secondary leading-relaxed">
          Belum ada perubahan signifikan sejak pembaruan rujukan terakhir.
        </p>
        <div className="text-[11px] text-ink-tertiary font-mono pt-1">
          Pembaruan Terakhir: {formatDateIndo(lastUpdatedAt)}
        </div>
      </div>
    );
  }

  const getSeverityBadge = (sev: ChangeSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-red-100 text-red-800 border border-red-200">Kritis</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-100 text-amber-800 border border-amber-200">Signifikan</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-blue-100 text-blue-800 border border-blue-200">Moderat</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-stone-100 text-stone-700 border border-stone-200">Rutin</span>;
    }
  };

  return (
    <div className="bg-surface rounded-card border border-border p-5 sm:p-6 space-y-4 shadow-subtle">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-stone-100 text-primary">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-ink-primary">
              Apa yang Berubah?
            </h3>
            <p className="text-[11px] text-ink-secondary">
              Evolusi informasi dan bukti baru sejak pemantauan awal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getSeverityBadge(changeSummary.change_severity)}
          <span className="text-[11px] font-mono text-ink-tertiary">
            {formatDateIndo(changeSummary.last_changed_at)}
          </span>
        </div>
      </div>

      {/* Delta Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        <div className="p-3 bg-stone-50/80 rounded-btn border border-border/80 space-y-0.5">
          <div className="text-[11px] text-ink-secondary">Sumber Baru</div>
          <div className="text-base font-bold font-mono text-ink-primary">
            +{changeSummary.new_sources_count}
          </div>
        </div>

        <div className="p-3 bg-stone-50/80 rounded-btn border border-border/80 space-y-0.5">
          <div className="text-[11px] text-ink-secondary">Rilis Resmi</div>
          <div className="text-base font-bold font-mono text-primary">
            +{changeSummary.new_official_statements}
          </div>
        </div>

        <div className="p-3 bg-stone-50/80 rounded-btn border border-border/80 space-y-0.5">
          <div className="text-[11px] text-ink-secondary">Fakta Terdata</div>
          <div className="text-base font-bold font-mono text-emerald-800">
            +{changeSummary.new_facts_count}
          </div>
        </div>

        <div className="p-3 bg-stone-50/80 rounded-btn border border-border/80 space-y-0.5">
          <div className="text-[11px] text-ink-secondary">Klaim Baru</div>
          <div className="text-base font-bold font-mono text-ink-primary">
            +{changeSummary.new_claims_count}
          </div>
        </div>
      </div>

      {/* Score Deltas Evolution */}
      {(changeSummary.confidence_delta || changeSummary.momentum_delta || changeSummary.priority_delta) && (
        <div className="p-3 bg-stone-50/50 rounded-btn border border-border/70 flex flex-wrap items-center justify-around gap-3 text-xs">
          {changeSummary.confidence_delta && (
            <div className="flex items-center gap-1.5">
              <span className="text-ink-secondary">Confidence:</span>
              <span className="font-mono font-semibold text-ink-tertiary">{changeSummary.confidence_delta.before}</span>
              <ArrowRight className="w-3 h-3 text-ink-tertiary" />
              <span className="font-mono font-bold text-emerald-800">{changeSummary.confidence_delta.after}</span>
            </div>
          )}

          {changeSummary.momentum_delta && (
            <div className="flex items-center gap-1.5">
              <span className="text-ink-secondary">Momentum:</span>
              <span className="font-mono font-semibold text-ink-tertiary">{changeSummary.momentum_delta.before}</span>
              <ArrowRight className="w-3 h-3 text-ink-tertiary" />
              <span className="font-mono font-bold text-ink-primary">{changeSummary.momentum_delta.after}</span>
            </div>
          )}

          {changeSummary.priority_delta && (
            <div className="flex items-center gap-1.5">
              <span className="text-ink-secondary">Prioritas:</span>
              <span className="font-mono font-semibold text-ink-tertiary">{changeSummary.priority_delta.before}</span>
              <ArrowRight className="w-3 h-3 text-ink-tertiary" />
              <span className="font-mono font-bold text-primary">{changeSummary.priority_delta.after}</span>
            </div>
          )}
        </div>
      )}

      {/* Highlights */}
      {changeSummary.change_highlights && changeSummary.change_highlights.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="text-xs font-semibold text-ink-primary">Catatan Perkembangan Terkini:</div>
          <ul className="space-y-1 text-xs text-ink-secondary">
            {changeSummary.change_highlights.map((h, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
