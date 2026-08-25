'use client';

import React from 'react';
import { Award, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { ResearchRecommendation } from '@/types';

interface AIRecommenderProps {
  recommendation: ResearchRecommendation;
  onProceedToKajian?: () => void;
}

export default function AIRecommender({ recommendation, onProceedToKajian }: AIRecommenderProps) {
  const getVerdictBadge = (verdict: ResearchRecommendation['verdict']) => {
    switch (verdict) {
      case 'Sangat Layak':
        return {
          badge: 'bg-emerald-600 text-white',
          box: 'bg-emerald-50 border-emerald-200 text-emerald-900',
          desc: 'Memenuhi seluruh kriteria strategis organisasi: lokus teritorial, urgensi waktu, dan ketersediaan data primer.',
        };
      case 'Layak':
        return {
          badge: 'bg-blue-600 text-white',
          box: 'bg-blue-50 border-blue-200 text-blue-900',
          desc: 'Layak dikaji dengan rekomendasi pengumpulan data sekunder tambahan.',
        };
      case 'Perlu Pemantauan':
        return {
          badge: 'bg-amber-600 text-white',
          box: 'bg-amber-50 border-amber-200 text-amber-900',
          desc: 'Isu masih dalam tahap awal eskalasi; disarankan memantau perkembangan dalam 7 hari.',
        };
      default:
        return {
          badge: 'bg-slate-600 text-white',
          box: 'bg-slate-100 border-slate-200 text-slate-800',
          desc: 'Data belum memadai untuk perumusan policy paper.',
        };
    }
  };

  const vInfo = getVerdictBadge(recommendation.verdict);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 sm:p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900 font-sans">
              Rekomendasi AI: Kelayakan Sebagai Bahan Kajian
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Penilaian saintifik-advokasi apakah isu ini memenuhi standar untuk dijadikan riset dan policy paper resmi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${vInfo.badge}`}>
            {recommendation.verdict}
          </span>
          <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2.5 py-1 rounded-full">
            Skor {recommendation.score}/100
          </span>
        </div>
      </div>

      {/* Rubric Score Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <span className="font-bold text-slate-700">Relevansi Gerakan:</span>
          <p className="text-slate-600 leading-snug">{recommendation.relevance_notes}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <span className="font-bold text-slate-700">Urgensi Waktu:</span>
          <p className="text-slate-600 leading-snug">{recommendation.urgency_notes}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <span className="font-bold text-slate-700">Ketersediaan Data:</span>
          <p className="text-slate-600 leading-snug">{recommendation.data_availability}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <span className="font-bold text-slate-700">Dampak Kaum Marhaen:</span>
          <p className="text-slate-600 leading-snug">{recommendation.grassroots_impact}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <span className="font-bold text-slate-700">Potensi Advokasi Kebijakan:</span>
          <p className="text-slate-600 leading-snug">{recommendation.policy_potential}</p>
        </div>
        <div className="p-3 bg-red-50/60 rounded-xl border border-red-200 space-y-1">
          <span className="font-bold text-gmni-red">Sudut Pandang yang Disarankan:</span>
          <p className="text-slate-800 font-medium leading-snug">{recommendation.suggested_angle}</p>
        </div>
      </div>

    </div>
  );
}
