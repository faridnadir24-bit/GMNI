'use client';

import React from 'react';
import { Clock, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { IssueEvent } from '@/types';
import { formatDateIndo } from '@/lib/utils';

interface IssueEventsTimelineProps {
  events?: IssueEvent[];
}

export default function IssueEventsTimeline({ events = [] }: IssueEventsTimelineProps) {
  if (!events || events.length === 0) return null;

  return (
    <div className="bg-surface rounded-card border border-border p-5 space-y-4 shadow-subtle">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink-primary">
            Perkembangan Isu (Activity Timeline)
          </h3>
        </div>
        <span className="text-[11px] font-mono text-ink-tertiary">
          {events.length} Peristiwa
        </span>
      </div>

      <div className="space-y-3">
        {events.map((evt, idx) => {
          const dateObj = new Date(evt.event_at);
          const timeStr = isNaN(dateObj.getTime())
            ? '18:42 WIB'
            : dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
          const dateStr = isNaN(dateObj.getTime()) ? '26 Agustus 2026' : formatDateIndo(evt.event_at);

          return (
            <div
              key={evt.id || idx}
              className="flex items-start gap-3 p-3 rounded bg-stone-50/60 border border-border/80 text-xs"
            >
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />

              <div className="flex-1 space-y-0.5 min-w-0">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-bold text-ink-primary">
                    {evt.title}
                  </span>
                  <span className="text-[10px] font-mono text-ink-tertiary">
                    {dateStr} · {timeStr}
                  </span>
                </div>

                {evt.description && (
                  <p className="text-[11px] text-ink-secondary leading-relaxed">
                    {evt.description}
                  </p>
                )}

                {evt.source_name && (
                  <div className="text-[10px] text-ink-tertiary pt-0.5">
                    Sumber: <span className="text-ink-secondary font-medium">{evt.source_name}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
