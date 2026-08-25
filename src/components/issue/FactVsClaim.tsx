'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  Plus, 
  X
} from 'lucide-react';
import { Claim, ClaimType } from '@/types';
import { useApp } from '@/context/AppContext';

interface FactVsClaimProps {
  issueId: string;
  claims: Claim[];
}

export default function FactVsClaim({ issueId, claims }: FactVsClaimProps) {
  const { role, addClaim } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | ClaimType>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<ClaimType>('fact');
  const [newSourceName, setNewSourceName] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const filteredClaims = claims.filter(c => {
    if (activeFilter === 'all') return true;
    return c.type === activeFilter;
  });

  const countFact = claims.filter(c => c.type === 'fact').length;
  const countClaim = claims.filter(c => c.type === 'claim').length;
  const countUnverified = claims.filter(c => c.type === 'unverified').length;

  const handleAddClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || !newSourceName.trim()) return;

    const claim: Claim = {
      id: `claim-${Date.now()}`,
      issue_id: issueId,
      content: newContent,
      type: newType,
      source_name: newSourceName,
      source_type: 'Official',
      verification_notes: newNotes,
      confidence_score: newType === 'fact' ? 95 : newType === 'claim' ? 60 : 30
    };

    addClaim(claim);
    setIsAddModalOpen(false);
    setNewContent('');
    setNewSourceName('');
    setNewNotes('');
  };

  return (
    <div className="bg-surface rounded-card border border-border p-6 space-y-6 shadow-subtle">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-ink-primary">
              Klasifikasi Temuan: Fakta vs Klaim
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-muted text-ink-secondary rounded border border-border">
              Prinsip Verifikasi
            </span>
          </div>
          <p className="text-xs text-ink-secondary mt-1">
            Memisahkan temuan terkonfirmasi dari pernyataan sepihak dan informasi yang belum terbukti.
          </p>
        </div>

        {(role === 'admin' || role === 'researcher') && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-ink-primary hover:bg-black text-white rounded-btn transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Temuan</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border pb-3 text-xs">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-btn font-medium transition-colors ${
            activeFilter === 'all'
              ? 'bg-ink-primary text-white font-semibold'
              : 'text-ink-secondary hover:bg-muted'
          }`}
        >
          Semua ({claims.length})
        </button>

        <button
          onClick={() => setActiveFilter('fact')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn font-medium transition-colors ${
            activeFilter === 'fact'
              ? 'bg-stone-200 text-ink-primary font-semibold'
              : 'text-ink-secondary hover:bg-muted'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span>Terkonfirmasi ({countFact})</span>
        </button>

        <button
          onClick={() => setActiveFilter('claim')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn font-medium transition-colors ${
            activeFilter === 'claim'
              ? 'bg-stone-200 text-ink-primary font-semibold'
              : 'text-ink-secondary hover:bg-muted'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          <span>Klaim / Pernyataan ({countClaim})</span>
        </button>

        <button
          onClick={() => setActiveFilter('unverified')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn font-medium transition-colors ${
            activeFilter === 'unverified'
              ? 'bg-stone-200 text-ink-primary font-semibold'
              : 'text-ink-secondary hover:bg-muted'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
          <span>Belum Terverifikasi ({countUnverified})</span>
        </button>
      </div>

      {/* Claims List */}
      <div className="space-y-2.5">
        {filteredClaims.length === 0 ? (
          <p className="text-xs text-ink-tertiary italic py-4 text-center">
            Tidak ada temuan dalam kategori ini.
          </p>
        ) : (
          filteredClaims.map(claim => {
            let dotColor = 'bg-emerald-600';
            let label = 'Terkonfirmasi';

            if (claim.type === 'claim') {
              dotColor = 'bg-amber-600';
              label = 'Klaim / Pernyataan';
            } else if (claim.type === 'unverified') {
              dotColor = 'bg-stone-400';
              label = 'Belum Terverifikasi';
            }

            return (
              <div
                key={claim.id}
                className="p-4 rounded-btn border border-border bg-stone-50/50 hover:bg-stone-50 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                    <span className="font-semibold text-ink-primary">{label}</span>
                  </div>
                  <span className="text-ink-tertiary font-mono">
                    Keyakinan: {claim.confidence_score}%
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-ink-primary leading-relaxed">
                  {claim.content}
                </p>

                <div className="pt-1.5 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-ink-secondary gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-ink-tertiary">Sumber:</span>
                    <span className="font-medium text-ink-primary">{claim.source_name}</span>
                    {claim.source_url && (
                      <a
                        href={claim.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-0.5 ml-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {claim.verification_notes && (
                    <span className="text-ink-tertiary italic text-[10px]">
                      Catatan: {claim.verification_notes}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-surface rounded-card p-6 shadow-card border border-border space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h4 className="text-sm font-bold text-ink-primary">
                Tambah Temuan Fakta atau Klaim
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-ink-tertiary hover:text-ink-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddClaim} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-ink-secondary mb-1">
                  Status Temuan:
                </label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value as ClaimType)}
                  className="w-full p-2 bg-surface border border-border rounded-btn text-xs"
                >
                  <option value="fact">Terkonfirmasi (Dokumen / Data Resmi)</option>
                  <option value="claim">Klaim / Pernyataan Narasumber</option>
                  <option value="unverified">Belum Terverifikasi (Sinyal Publik)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-ink-secondary mb-1">
                  Uraian Temuan:
                </label>
                <textarea
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Tuliskan temuan atau data yang diperoleh..."
                  rows={3}
                  className="w-full p-2 bg-surface border border-border rounded-btn text-xs focus:outline-none focus:border-stone-400"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-ink-secondary mb-1">
                  Nama Sumber / Instansi:
                </label>
                <input
                  type="text"
                  value={newSourceName}
                  onChange={e => setNewSourceName(e.target.value)}
                  placeholder="Misal: Humas Polres Purwakarta / Surat Terbuka Serikat"
                  className="w-full p-2 bg-surface border border-border rounded-btn text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-ink-secondary mb-1">
                  Catatan Verifikasi:
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="Nomor surat edaran, tanggal rilis, atau hasil cek lapangan..."
                  className="w-full p-2 bg-surface border border-border rounded-btn text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 bg-muted hover:bg-stone-200 text-ink-primary rounded-btn font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-ink-primary hover:bg-black text-white rounded-btn font-semibold"
                >
                  Simpan Temuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
