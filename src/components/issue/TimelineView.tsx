'use client';

import React from 'react';
import { Clock, ShieldAlert, FileText, Megaphone, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { TimelineEvent } from '@/types';

interface TimelineViewProps {
  events: TimelineEvent[];
}

export default function TimelineView({ events }: TimelineViewProps) {
  const getEventIcon = (type: TimelineEvent['event_type']) => {
    switch (type) {
      case 'discovery':
        return <Activity className="w-4 h-4 text-purple-600" />;
      case 'official_statement':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'media_surge':
        return <Megaphone className="w-4 h-4 text-amber-600" />;
      case 'public_protest':
        return <ShieldAlert className="w-4 h-4 text-red-600" />;
      case 'policy_action':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const getEventBadge = (type: TimelineEvent['event_type']) => {
    switch (type) {
      case 'discovery':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'official_statement':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'media_surge':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'public_protest':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'policy_action':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 sm:p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-700" />
            <h3 className="text-base font-bold text-slate-900 font-sans">
              Kronologi & Timeline Perkembangan Isu
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Rekam jejak kronologis otomatis berdasarkan data baru yang terverifikasi.
          </p>
        </div>
        <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200">
          {events.length} Peristiwa
        </span>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {events.map((event, idx) => (
          <div key={event.id} className="relative group">
            {/* Timeline node icon */}
            <div className="absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border-2 border-slate-300 group-hover:border-gmni-red flex items-center justify-center shadow-xs transition-colors">
              {getEventIcon(event.event_type)}
            </div>

            {/* Event Card */}
            <div className="bg-slate-50/70 group-hover:bg-slate-100/80 p-4 rounded-xl border border-slate-200/80 transition-all space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-900 font-mono tracking-tight">
                    {event.date}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getEventBadge(event.event_type)}`}>
                    {event.event_type.replace('_', ' ')}
                  </span>
                </div>

                <span className="text-[10px] text-slate-500 font-medium">
                  Rujukan: <span className="text-slate-700 font-semibold">{event.source_ref}</span>
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                {event.title}
              </h4>

              <p className="text-xs text-slate-600 leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
