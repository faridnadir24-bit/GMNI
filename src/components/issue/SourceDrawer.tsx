'use client';

import React from 'react';
import { X, ExternalLink, ShieldCheck, AlertTriangle, HelpCircle, FileText, Calendar, Building, Globe, CheckCircle2 } from 'lucide-react';
import { DossierCitation } from '@/types';
import { formatDateIndo } from '@/lib/utils';

interface SourceDrawerProps {
  citation: DossierCitation | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SourceDrawer({ citation, isOpen, onClose }: SourceDrawerProps) {
  if (!isOpen || !citation) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUPPORTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            TERKONFIRMASI (SUPPORTED)
          </span>
        );
      case 'PARTIALLY_SUPPORTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            SEBAGIAN DIDUKUNG
          </span>
        );
      case 'CONFLICTING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            SENGKETA DATA (CONFLICTING)
          </span>
        );
      case 'UNVERIFIED':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-300">
            <HelpCircle className="w-3.5 h-3.5" />
            SINYAL PUBLIK / BELUM TERVERIFIKASI
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-lg bg-surface border-l border-border h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-border bg-stone-50 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                {citation.badge.replace(/[\[\]]/g, '')}
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink-primary">Register Provenance Sumber</h3>
                <p className="text-[11px] text-ink-tertiary">Verifikasi Bukti & Rekam Rujukan Pers</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-ink-tertiary hover:text-ink-primary hover:bg-stone-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-5 space-y-6">
            {/* Status & Credibility */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
                Status Verifikasi Bukti
              </div>
              <div>{getStatusBadge(citation.verification_status)}</div>

              <div className="p-3.5 rounded-card bg-stone-50 border border-border space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ink-secondary font-medium">Skor Kredibilitas Sumber:</span>
                  <span className="font-bold text-ink-primary">{citation.credibility_score}/100</span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      citation.credibility_score >= 80 ? 'bg-emerald-600' : 
                      citation.credibility_score >= 60 ? 'bg-amber-600' : 'bg-stone-500'
                    }`}
                    style={{ width: `${citation.credibility_score}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Source Details */}
            <div className="space-y-4">
              <div className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
                Rincian Metadata Rujukan
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-xs text-ink-tertiary flex items-center gap-1 mb-1">
                    <FileText className="w-3.5 h-3.5" /> Judul Dokumen / Artikel
                  </div>
                  <div className="font-semibold text-ink-primary leading-snug">
                    "{citation.title}"
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <div className="text-xs text-ink-tertiary flex items-center gap-1 mb-1">
                      <Building className="w-3.5 h-3.5" /> Penerbit / Media
                    </div>
                    <div className="font-semibold text-ink-primary">
                      {citation.source_name}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-ink-tertiary flex items-center gap-1 mb-1">
                      <Globe className="w-3.5 h-3.5" /> Klasifikasi Sumber
                    </div>
                    <div className="font-semibold text-ink-primary">
                      {citation.tier}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <div className="text-xs text-ink-tertiary flex items-center gap-1 mb-1">
                      <Calendar className="w-3.5 h-3.5" /> Tanggal Terbit
                    </div>
                    <div className="text-ink-secondary text-xs">
                      {citation.published_at ? formatDateIndo(citation.published_at) : 'Tanggal tidak terdata'}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-ink-tertiary flex items-center gap-1 mb-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Diindeks Pada
                    </div>
                    <div className="text-ink-secondary text-xs">
                      {citation.retrieved_at ? formatDateIndo(citation.retrieved_at) : 'Aktual'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Claims Supported */}
            {citation.supported_claims && citation.supported_claims.length > 0 && (
              <div className="space-y-2.5 pt-2 border-t border-border">
                <div className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">
                  Klaim / Poin Informasi yang Didukung
                </div>
                <div className="space-y-2">
                  {citation.supported_claims.map((claim, idx) => (
                    <div key={idx} className="p-3 rounded bg-amber-50/50 border border-amber-200/60 text-xs text-ink-primary leading-relaxed">
                      "{claim}"
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-border bg-stone-50 space-y-2">
          {citation.url && citation.url !== '#' ? (
            <a
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-btn bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors shadow-subtle"
            >
              <span>Buka Tautan Rujukan Asli</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <div className="text-center text-xs text-ink-tertiary italic">
              Dokumen rujukan internal tersimpan dalam basis data Ruang Isu.
            </div>
          )}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-btn bg-white border border-border text-xs font-semibold text-ink-secondary hover:text-ink-primary hover:bg-stone-100 transition-colors"
          >
            Tutup Drawer
          </button>
        </div>
      </div>
    </div>
  );
}
