'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Printer, Users, HelpCircle, FileText, AlertCircle, Share2 } from 'lucide-react';
import { DiscussionBrief, Issue } from '@/types';
import { formatDateIndo } from '@/lib/utils';

interface DiscussionBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  brief: DiscussionBrief | null;
  issue: Issue;
}

export default function DiscussionBriefModal({
  isOpen,
  onClose,
  brief,
  issue
}: DiscussionBriefModalProps) {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !brief) return null;

  const handleCopy = () => {
    const formattedText = `*BAHAN DISKUSI KADER GMNI KOMISARIAT WASTUKANCANA*
*Pusat Pemantauan & Pengembangan Isu (RUANG ISU)*
--------------------------------------------------
*TOPIK:* ${brief.issue_title}
*LOKUS:* ${issue.location}${issue.district ? ` (${issue.district})` : ''}
*TANGGAL:* ${formatDateIndo(brief.generated_at)}

*1. RINGKASAN EKSEKUTIF:*
${brief.executive_summary}

*2. 5 PERTANYAAN PEMANTIK DISKUSI:*
${brief.five_discussion_questions.join('\n')}

*3. 5 FAKTA POKOK TERKONFIRMASI:*
${brief.five_key_facts.map((f, i) => `${i + 1}. ${f}`).join('\n')}

*4. 3 TITIK KRITIS YANG PERLU DIVERIFIKASI (DATA GAP):*
${brief.three_data_gaps.join('\n')}

*5. SUDUT PANDANG AKTOR TERKAIT:*
${brief.three_stakeholder_angles.map(a => `• ${a.stakeholder}: ${a.perspective}`).join('\n')}

*6. KESIMPULAN AWAL & REKOMENDASI DISKUSI:*
${brief.initial_conclusion}
--------------------------------------------------
"Pejuang Pemikir – Pemikir Pejuang"`;

    navigator.clipboard.writeText(formattedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface rounded-card border border-border w-full max-w-3xl shadow-xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-primary rounded text-white">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                Bahan Diskusi Kader Komisariat
              </h3>
              <p className="text-[11px] text-stone-300">
                Format 1-Halaman untuk Kajian & Diskusi Terfokus
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-1.5 text-stone-300 hover:text-white hover:bg-stone-800 rounded transition-colors text-xs flex items-center gap-1"
              title="Salin ke Clipboard"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{isCopied ? 'Tersalin' : 'Salin'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-1.5 text-stone-300 hover:text-white hover:bg-stone-800 rounded transition-colors text-xs flex items-center gap-1"
              title="Cetak Dokumen"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Cetak</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto text-ink-primary print:max-h-none print:p-0">
          
          {/* Document Top */}
          <div className="border-b border-border pb-4 space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-primary font-semibold">
              GMNI Komisariat Wastukancana – Ruang Isu
            </div>
            <h2 className="text-lg sm:text-xl font-bold leading-snug">
              {brief.issue_title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-ink-secondary pt-1 font-mono">
              <span>Lokus: {issue.location}{issue.district ? ` (${issue.district})` : ''}</span>
              <span>·</span>
              <span>Diterbitkan: {formatDateIndo(brief.generated_at)}</span>
            </div>
          </div>

          {/* 1. Ringkasan */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-secondary flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" />
              <span>1. Ringkasan Isu</span>
            </h4>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed bg-stone-50 p-3.5 rounded border border-border/80">
              {brief.executive_summary}
            </p>
          </div>

          {/* 2. Pertanyaan Diskusi */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-secondary flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
              <span>2. 5 Pertanyaan Pemantik Diskusi</span>
            </h4>
            <div className="space-y-2">
              {brief.five_discussion_questions.map((q, idx) => (
                <div key={idx} className="p-3 bg-red-50/40 rounded border border-red-100 text-xs sm:text-sm text-ink-primary font-medium">
                  {q}
                </div>
              ))}
            </div>
          </div>

          {/* 3. Fakta Terkonfirmasi & Data Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fakta */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-secondary">
                3. Fakta Kunci Terkonfirmasi
              </h4>
              <ul className="space-y-1.5 text-xs text-ink-secondary">
                {brief.five_key_facts.map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-stone-50/60 p-2 rounded border border-border/60">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Data Gaps */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-secondary">
                4. Data Gap (Titik Investigasi)
              </h4>
              <ul className="space-y-1.5 text-xs text-ink-secondary">
                {brief.three_data_gaps.map((gap, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-amber-50/40 p-2 rounded border border-amber-200/60 text-amber-900">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Sudut Pandang Aktor */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-secondary">
              5. Sudut Pandang Stakeholder
            </h4>
            <div className="space-y-2">
              {brief.three_stakeholder_angles.map((ang, idx) => (
                <div key={idx} className="p-3 bg-stone-50 rounded border border-border/80 space-y-1 text-xs">
                  <div className="font-bold text-ink-primary">{ang.stakeholder}</div>
                  <div className="text-ink-secondary">{ang.perspective}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Kesimpulan */}
          <div className="p-4 bg-stone-900 text-stone-100 rounded-card space-y-1.5 text-xs">
            <div className="font-bold uppercase tracking-wider text-[11px] text-stone-300">
              Kesimpulan Awal & Rekomendasi Forum
            </div>
            <p className="leading-relaxed text-stone-200">
              {brief.initial_conclusion}
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-border flex items-center justify-between text-xs text-ink-secondary">
          <span className="font-mono text-[11px]">
            "Pejuang Pemikir – Pemikir Pejuang"
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-ink-primary font-medium rounded-btn transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
