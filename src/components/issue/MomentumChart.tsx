'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus, Sparkles, Activity, Info } from 'lucide-react';

interface MomentumChartProps {
  trend: {
    labels: string[];
    values: number[];
    percentage_change: string;
    trend_status: 'Naik' | 'Stabil' | 'Menurun';
    ai_commentary: string;
  };
}

export default function MomentumChart({ trend }: MomentumChartProps) {
  const maxValue = Math.max(...trend.values, 100);

  const getStatusBadge = () => {
    switch (trend.trend_status) {
      case 'Naik':
        return {
          icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,
          badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          text: 'Tren Meningkat Tajam',
        };
      case 'Menurun':
        return {
          icon: <TrendingDown className="w-4 h-4 text-slate-600" />,
          badge: 'bg-slate-100 text-slate-700 border-slate-200',
          text: 'Tren Mereda',
        };
      default:
        return {
          icon: <Minus className="w-4 h-4 text-amber-600" />,
          badge: 'bg-amber-50 text-amber-800 border-amber-200',
          text: 'Stabil / Terjaga',
        };
    }
  };

  const status = getStatusBadge();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900 font-sans">
              Momentum & Perkembangan Perhatian Publik
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Indeks dinamika atensi media massa, laporan warga, dan sinyal percakapan publik dari hari ke hari.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${status.badge}`}>
            {status.icon}
            <span>{trend.percentage_change} ({status.text})</span>
          </div>
        </div>
      </div>

      {/* Chart Visualizer */}
      <div className="space-y-2">
        <div className="flex items-end justify-between gap-2 h-44 sm:h-48 pt-6 px-2 bg-slate-50/70 rounded-xl border border-slate-100">
          {trend.values.map((val, idx) => {
            const heightPercent = Math.max(12, Math.round((val / maxValue) * 100));
            const isHighest = val === Math.max(...trend.values);

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                  {val}
                </div>
                <div className="w-full max-w-[40px] flex items-end justify-center h-full">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-md transition-all duration-500 ${
                      isHighest
                        ? 'bg-gmni-red shadow-sm'
                        : 'bg-slate-300 group-hover:bg-slate-400'
                    }`}
                  />
                </div>
                <div className="text-[10px] sm:text-xs font-medium text-slate-500 mt-1 truncate">
                  {trend.labels[idx]}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 px-2">
          <span>← Sumbu Waktu (7 Hari Terakhir)</span>
          <span>Sumbu Nilai (Frekuensi Sinyal & Rujukan) →</span>
        </div>
      </div>

      {/* AI Explanation Banner */}
      <div className="p-4 bg-gradient-to-r from-amber-50/80 to-red-50/50 rounded-xl border border-amber-200/80 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Analisis AI Momentum:</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed pl-5.5">
          {trend.ai_commentary}
        </p>
      </div>

    </div>
  );
}
