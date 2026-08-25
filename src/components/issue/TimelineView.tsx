'use client';

import React from 'react';
import { TimelineEvent } from '@/types';

interface TimelineViewProps {
  events: TimelineEvent[];
}

export default function TimelineView({ events }: TimelineViewProps) {
  return (
    <div className="bg-surface rounded-card border border-border p-6 space-y-6 shadow-subtle">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-ink-primary">
            Kronologi & Linimasa Isu
          </h3>
          <p className="text-xs text-ink-secondary mt-0.5">
            Rangkaian peristiwa dari deteksi awal hingga perkembangan terkini.
          </p>
        </div>
        <span className="text-xs font-mono text-ink-tertiary">
          {events.length} Peristiwa
        </span>
      </div>

      <div className="relative pl-4 space-y-6 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:bg-border">
        {events.map(event => (
          <div key={event.id} className="relative pl-5 space-y-1 group">
            {/* Small dot node */}
            <div className="absolute -left-4 top-1.5 w-2 h-2 rounded-full bg-stone-300 group-hover:bg-primary transition-colors ring-4 ring-surface" />

            <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-ink-primary">
                  {event.date}
                </span>
                <span className="text-[10px] text-ink-tertiary uppercase">
                  · {event.event_type.replace('_', ' ')}
                </span>
              </div>

              <span className="text-[11px] text-ink-tertiary">
                Rujukan: <span className="text-ink-secondary">{event.source_ref}</span>
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-semibold text-ink-primary leading-snug">
              {event.title}
            </h4>

            <p className="text-xs text-ink-secondary leading-relaxed">
              {event.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
