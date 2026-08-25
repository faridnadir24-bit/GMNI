'use client';

import React from 'react';
import Image from 'next/image';
import { Scale, BookOpen, ShieldCheck, HelpCircle, HeartHandshake } from 'lucide-react';
import { MarhaenismAnalysis as MarhaenismType } from '@/types';

interface MarhaenismAnalysisProps {
  analysis: MarhaenismType;
}

export default function MarhaenismAnalysis({ analysis }: MarhaenismAnalysisProps) {
  return (
    <div className="bg-gradient-to-b from-white to-red-50/20 rounded-2xl border border-red-200/80 shadow-subtle p-5 sm:p-6 space-y-6">
      
      {/* Header with GMNI Identity */}
      <div className="flex items-center justify-between border-b border-red-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-9 shrink-0">
            <Image
              src="/assets/gmni/logo-gmni.png"
              alt="Logo GMNI"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 font-sans">
                Pisau Analisis Perspektif GMNI & Marhaenisme
              </h3>
              <span className="text-[10px] font-bold bg-red-100 text-gmni-red border border-red-300 px-2 py-0.5 rounded uppercase">
                KERANGKA ORGANISASI
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Bukan propaganda partisan, melainkan framework akademis-ideologis untuk menguji keberpihakan kebijakan terhadap kaum Marhaen.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Pillars Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Sosio-Nasionalisme */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Sosio-Nasionalisme
            </h4>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {analysis.sosio_nasionalisme}
          </p>
        </div>

        {/* Sosio-Demokrasi */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Sosio-Demokrasi
            </h4>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {analysis.sosio_demokrasi}
          </p>
        </div>

        {/* Trisakti */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Kedaulatan Trisakti
            </h4>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {analysis.trisakti_perspective}
          </p>
        </div>

      </div>

      {/* Pembelaan Kaum Marhaen & Catatan Advokasi */}
      <div className="p-4 bg-red-50/80 rounded-xl border border-red-200 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-gmni-red">
          <HeartHandshake className="w-4 h-4" />
          <span>Fokus Pembelaan Kaum Marhaen (Rakyat Pekerja Kecil):</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
          {analysis.pro_poor_advocacy_notes}
        </p>
      </div>

      {/* Pertanyaan Kritis Dialektis */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="text-xs font-bold text-slate-900">
          Pertanyaan Kritis yang Wajib Dijawab Kader:
        </div>
        <ul className="space-y-1.5">
          {analysis.critical_questions.map((cq, idx) => (
            <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
              <span className="text-gmni-red font-bold font-mono">Q{idx + 1}.</span>
              <span>{cq}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
