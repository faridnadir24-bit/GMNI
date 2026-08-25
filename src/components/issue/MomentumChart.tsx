'use client';

import React from 'react';

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

  return (
    <div className="bg-surface rounded-card border border-border p-6 space-y-5 shadow-subtle">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border pb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-ink-primary">
            Dinamika Atensi & Momentum Publik
          </h3>
          <p className="text-xs text-ink-secondary mt-0.5">
            Perkembangan frekuensi rujukan media dan atensi masyarakat 7 hari terakhir.
          </p>
        </div>

        <div className="text-xs font-mono font-semibold text-ink-primary">
          Tren: <span className="text-primary">{trend.percentage_change}</span> ({trend.trend_status})
        </div>
      </div>

      {/* Chart Visualizer */}
      <div className="space-y-2">
        <div className="flex items-end justify-between gap-3 h-36 pt-6 px-2 bg-stone-50/60 rounded-btn border border-border/60">
          {trend.values.map((val, idx) => {
            const heightPercent = Math.max(10, Math.round((val / maxValue) * 100));
            const isHighest = val === Math.max(...trend.values);

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] font-mono text-ink-tertiary group-hover:text-ink-primary transition-colors">
                  {val}
                </span>
                <div className="w-full max-w-[32px] flex items-end justify-center h-full">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-sm transition-all ${
                      isHighest
                        ? 'bg-primary'
                        : 'bg-stone-300 group-hover:bg-stone-400'
                    }`}
                  />
                </div>
                <span className="text-[10px] text-ink-tertiary mt-1">
                  {trend.labels[idx]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Commentary */}
      <div className="text-xs text-ink-secondary bg-stone-50 p-3.5 rounded-btn border border-border/70 leading-relaxed">
        <strong className="text-ink-primary font-medium">Analisis Tren:</strong> {trend.ai_commentary}
      </div>

    </div>
  );
}
