'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Printer, 
  Download, 
  ExternalLink, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  User, 
  Building2,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import KajianDocModal from '@/components/ai/KajianDocModal';
import { BahanKajianDocument } from '@/types';

export default function BahanKajianPage() {
  const { kajianDocs } = useApp();
  const [selectedDoc, setSelectedDoc] = useState<BahanKajianDocument | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDoc = (doc: BahanKajianDocument) => {
    setSelectedDoc(doc);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-gmni-red" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
              Arsip Bahan Kajian & Policy Brief
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
              {kajianDocs.length} Dokumen Resmi
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kumpulan naskah akademik, policy brief advokasi, dan position paper GMNI Wastukancana Purwakarta.
          </p>
        </div>

        <Link
          href="/ai-analyst"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gmni-red hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Buat Bahan Kajian Baru dengan AI</span>
        </Link>
      </div>

      {/* Kajian Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {kajianDocs.map(doc => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-subtle hover:border-slate-300 hover:shadow-card-hover transition-all p-6 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-red-50 text-gmni-red border border-red-200 font-mono">
                  {doc.status}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {doc.date_created}
                </span>
              </div>

              <h3 
                onClick={() => handleOpenDoc(doc)}
                className="text-base font-bold text-slate-900 group-hover:text-gmni-red transition-colors cursor-pointer leading-snug"
              >
                {doc.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {doc.subtitle}
              </p>

              {/* Document Overview Summary */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 line-clamp-3 leading-relaxed">
                {doc.sections.latar_belakang}
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <User className="w-3 h-3" />
                  {doc.author}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {doc.komisariat}
                </span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handleOpenDoc(doc)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Baca & Cetak Naskah</span>
              </button>

              <Link
                href={`/isu/${doc.issue_id === 'issue-pwk-01' ? 'keamanan-pengawasan-kawasan-waduk-jatiluhur' : 'perlindungan-hak-buruh-outsourcing-kbi-purwakarta'}`}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors border border-slate-200"
                title="Buka Lembar Fakta Isu"
              >
                Isu Terkait
              </Link>
            </div>

          </div>
        ))}
      </div>

      {/* Modal Kajian Preview */}
      {selectedDoc && (
        <KajianDocModal
          doc={selectedDoc}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

    </div>
  );
}
