'use client';

import React from 'react';

interface ScoreIndicatorProps {
  label: string;
  score: number;
  max?: number;
  accent?: boolean;
}

export default function ScoreIndicator({
  label,
  score,
  max = 100,
  accent = false,
}: ScoreIndicatorProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((score / max) * 100)));

  return (
    <div className="space-y-1 text-xs">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-ink-secondary">{label}</span>
        <span className={`font-mono font-semibold ${accent ? 'text-primary' : 'text-ink-primary'}`}>
          {score}
        </span>
      </div>
      <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
        <div
          style={{ width: `${percentage}%` }}
          className={`h-full rounded-full transition-all duration-300 ${
            accent ? 'bg-primary' : 'bg-stone-700'
          }`}
        />
      </div>
    </div>
  );
}
