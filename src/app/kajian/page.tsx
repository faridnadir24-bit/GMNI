'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Printer, 
  Download, 
  Sparkles, 
  User, 
  Building2,
  ArrowRight
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
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-ink-primary">
              Arsip Bahan Kajian & Policy Brief
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 bg-stone-100 text-ink-secondary rounded border border-border">
              {kajianDocs.length} Dokumen
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
            Kumpulan naskah akademik, policy brief advokasi, dan position paper GMNI Wastukancana Purwakarta.
          </p>
        </div>

        <Link
          href="/ai-analyst"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-ink-primary hover:bg-black text-white text-xs font-semibold rounded-btn transition-colors shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Buat Bahan Kajian Baru</span>
        </Link>
      </div>

      {/* Kajian Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kajianDocs.map(doc => (
          <div
            key={doc.id}
            className="bg-surface rounded-card border border-border shadow-subtle hover:border-stone-400 hover:shadow-card-hover transition-all p-6 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-stone-100 text-primary border border-border font-mono">
                  {doc.status}
                </span>
                <span className="text-ink-tertiary font-mono">
                  {doc.date_created}
                </span>
              </div>

              <h3 
                onClick={() => handleOpenDoc(doc)}
                className="text-base font-bold text-ink-primary group-hover:text-primary transition-colors cursor-pointer leading-snug"
              >
                {doc.title}
              </h3>

              <p className="text-xs text-ink-secondary line-clamp-2 leading-relaxed">
                {doc.subtitle}
              </p>

              {/* Document Overview Summary */}
              <div className="p-3 bg-stone-50 rounded-btn border border-border/80 text-xs text-ink-secondary line-clamp-3 leading-relaxed">
                {doc.sections.latar_belakang}
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] text-ink-tertiary pt-1">
                <span className="font-medium text-ink-secondary">
                  Penyusun: {doc.author}
                </span>
                <span>·</span>
                <span>{doc.komisariat}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[11px] text-ink-tertiary">
                Format: 10 Bab Akademik
              </span>

              <button
                onClick={() => handleOpenDoc(doc)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-ink-primary hover:bg-black text-white text-xs font-semibold rounded-btn transition-colors"
              >
                <span>Buka & Cetak Naskah</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Modal Preview */}
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
