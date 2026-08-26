'use client';

import React, { useState } from 'react';
import { ShieldCheck, HelpCircle, Check, AlertTriangle, X, Info } from 'lucide-react';
import { ConfidenceExplanation } from '@/types';

interface ConfidenceExplainerProps {
  confidenceMeta?: ConfidenceExplanation;
  score?: number;
}

export default function ConfidenceExplainer({ confidenceMeta, score = 75 }: ConfidenceExplainerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const displayScore = confidenceMeta?.score ?? score;

  const getScoreColor = (val: number) => {
    if (val >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (val >= 60) return 'text-amber-800 bg-amber-50 border-amber-200';
    return 'text-stone-700 bg-stone-50 border-stone-200';
  };

  return (
    <div className="relative inline-block">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-btn border text-xs font-semibold transition-all hover:scale-105 ${getScoreColor(displayScore)}`}
        title="Klik untuk melihat rincian kalkulasi tingkat keyakinan bukti"
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Confidence: {displayScore}/100</span>
        <HelpCircle className="w-3 h-3 opacity-60 ml-0.5" />
      </button>

      {/* Popover Modal / Dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm sm:static sm:inset-auto sm:p-0 sm:bg-transparent">
          <div className="bg-surface rounded-card border border-border p-5 shadow-xl space-y-4 max-w-md w-full sm:absolute sm:top-8 sm:left-0 sm:z-50 sm:w-80 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <div className="flex items-center gap-1.5 font-bold text-xs text-ink-primary">
                <Info className="w-4 h-4 text-primary" />
                <span>Transparansi Skor Keyakinan</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-ink-tertiary hover:text-ink-primary p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Score & Summary */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-ink-primary">
                  {displayScore}
                </span>
                <span className="text-xs text-ink-secondary">/ 100 ({confidenceMeta?.level || 'Tinggi'})</span>
              </div>
              <p className="text-[11px] text-ink-secondary leading-relaxed">
                {confidenceMeta?.explanation || 'Tingkat keyakinan dihitung berdasarkan keberadaan sumber resmi, keragaman media independen, dan ketiadaan kontradiksi data.'}
              </p>
            </div>

            {/* Breakdown Factors List */}
            {confidenceMeta?.factors && confidenceMeta.factors.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-semibold text-ink-primary">Faktor Penentu:</div>
                <ul className="space-y-1.5">
                  {confidenceMeta.factors.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs">
                      {f.positive ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div className="leading-tight">
                        <div className="font-medium text-ink-primary">{f.label}</div>
                        <div className="text-[10px] text-ink-tertiary">{f.value}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Footer Disclaimer */}
            <div className="pt-2 border-t border-border text-[10px] text-ink-tertiary italic">
              *Indikator internal sistem pemantauan untuk mengukur kecukupan bukti sebelum penyusunan bahan kajian.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
