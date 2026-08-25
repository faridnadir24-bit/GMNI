'use client';

import React from 'react';
import { Sparkles, HelpCircle, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { IssueAISummary } from '@/types';

interface AISummarizerProps {
  summary: IssueAISummary;
}

export default function AISummarizer({ summary }: AISummarizerProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
        <div className="p-2 rounded-lg bg-red-50 text-gmni-red">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 font-sans">
            Ringkasan Eksekutif & Struktur Fakta AI
          </h3>
          <p className="text-xs text-slate-500">
            Dihasilkan berdasarkan sintesis sumber primer tanpa membuat fakta palsu atau halusinasi angka.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Apa yang Terjadi? */}
        <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <span className="w-2 h-2 rounded-full bg-gmni-red" />
            <span>Apa yang Sebenarnya Terjadi?</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {summary.what_happened}
          </p>
        </div>

        {/* Mengapa Penting? */}
        <div className="space-y-2 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            <span>Mengapa Isu Ini Penting & Berdampak Luas?</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {summary.why_important}
          </p>
        </div>

      </div>

      {/* Siapa yang Terdampak? */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
          <Users className="w-4 h-4 text-purple-600" />
          <span>Siapa Kelompok Masyarakat yang Terdampak?</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {summary.who_is_affected.map((affected, idx) => (
            <div key={idx} className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl text-xs text-purple-950 flex items-start gap-2">
              <span className="font-bold text-purple-600">•</span>
              <span>{affected}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pihak Terlibat & Data Gap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
        
        {/* Pihak Terlibat */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-900">
            Pihak & Institusi yang Terlibat:
          </div>
          <div className="space-y-2">
            {summary.key_stakeholders.map((sh, idx) => (
              <div key={idx} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs">
                <span className="font-bold text-slate-800">{sh.category}:</span>{' '}
                <span className="text-slate-600">{sh.entities.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hal yang Belum Diketahui / Celah Data */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>Hal yang Belum Diketahui (Data Gap):</span>
          </div>
          <div className="space-y-2">
            {summary.unknown_gaps.map((gap, idx) => (
              <div key={idx} className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                <span className="font-bold text-amber-700">?</span>
                <span>{gap}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
