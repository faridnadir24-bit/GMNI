'use client';

import React from 'react';
import { HelpCircle, Copy, Check, Sparkles, Compass } from 'lucide-react';

interface AIResearchQuestionsProps {
  questions: { dimension: string; question: string; priority: string }[];
}

export default function AIResearchQuestions({ questions }: AIResearchQuestionsProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const text = questions.map((q, idx) => `${idx + 1}. [${q.dimension}] ${q.question}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 sm:p-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-gmni-red" />
            <h3 className="text-base font-bold text-slate-900 font-sans">
              8 Dimensi Pertanyaan Kajian Dialektis
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Panduan pertanyaan kritis untuk membedah akar masalah, celah kebijakan, dan advokasi lapangan.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200 shrink-0"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Tersalin' : 'Salin Pertanyaan'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {questions.map((q, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/60 hover:bg-slate-50 transition-all space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gmni-red font-mono">
                {q.dimension}
              </span>
              <span className="text-[9px] font-semibold px-2 py-0.2 rounded bg-slate-200 text-slate-700">
                Prioritas {q.priority}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-slate-800 leading-snug">
              {q.question}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
