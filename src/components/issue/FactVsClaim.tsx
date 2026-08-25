'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ShieldCheck, 
  ExternalLink, 
  Plus, 
  X,
  Filter,
  Info
} from 'lucide-react';
import { Claim, ClaimType } from '@/types';
import { useApp } from '@/context/AppContext';

interface FactVsClaimProps {
  issueId: string;
  claims: Claim[];
}

export default function FactVsClaim({ issueId, claims }: FactVsClaimProps) {
  const { role, addClaim } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'all' | ClaimType>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<ClaimType>('fact');
  const [newSourceName, setNewSourceName] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const filteredClaims = claims.filter(c => {
    if (selectedFilter === 'all') return true;
    return c.type === selectedFilter;
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 sm:p-6 space-y-6">
      
      {/* Header & Principle Explanation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900 font-sans">
              Klasifikasi Fakta vs Klaim vs Belum Terverifikasi
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
              FITUR WAJIB
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Memisahkan fakta terkonfirmasi dari pernyataan sepihak dan spekulasi media sosial guna mencegah distorsi data dalam kajian.
          </p>
        </div>

        {(role === 'admin' || role === 'researcher') && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors shrink-0 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Temuan</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            selectedFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Semua ({claims.length})
        </button>

        <button
          onClick={() => setSelectedFilter('fact')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            selectedFilter === 'fact'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>✅ Terkonfirmasi ({countFact})</span>
        </button>

        <button
          onClick={() => setSelectedFilter('claim')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            selectedFilter === 'claim'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>⚠️ Klaim / Pernyataan ({countClaim})</span>
        </button>

        <button
          onClick={() => setSelectedFilter('unverified')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            selectedFilter === 'unverified'
              ? 'bg-slate-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>❓ Belum Terverifikasi ({countUnverified})</span>
        </button>
      </div>

      {/* Claims List */}
      <div className="space-y-3">
        {filteredClaims.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Info className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">
              Tidak ada data temuan untuk kategori ini.
            </p>
          </div>
        ) : (
          filteredClaims.map(claim => {
            let badgeBg = 'bg-emerald-50 border-emerald-200 text-emerald-900';
            let icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
            let label = 'TERKONFIRMASI';
            let labelStyle = 'bg-emerald-100 text-emerald-800 border-emerald-300';

            if (claim.type === 'claim') {
              badgeBg = 'bg-amber-50/70 border-amber-200 text-amber-950';
              icon = <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
              label = 'KLAIM / PERNYATAAN';
              labelStyle = 'bg-amber-100 text-amber-900 border-amber-300';
            } else if (claim.type === 'unverified') {
              badgeBg = 'bg-slate-50 border-slate-200 text-slate-900';
              icon = <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />;
              label = 'BELUM TERVERIFIKASI';
              labelStyle = 'bg-slate-200 text-slate-700 border-slate-300';
            }

            return (
              <div
                key={claim.id}
                className={`p-4 rounded-xl border ${badgeBg} transition-all space-y-2.5`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    {icon}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${labelStyle}`}>
                      {label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                    <span>Keyakinan:</span>
                    <span className="font-bold text-slate-700">{claim.confidence_score}%</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed pl-6.5">
                  {claim.content}
                </p>

                <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-600 gap-1 pl-6.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700">Sumber:</span>
                    <span>{claim.source_name}</span>
                    {claim.source_url && (
                      <a
                        href={claim.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gmni-red hover:underline inline-flex items-center gap-0.5 ml-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {claim.verification_notes && (
                    <span className="italic text-slate-500 text-[10px]">
                      Catatan: {claim.verification_notes}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Claim Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="text-sm font-bold text-slate-900">
                Tambah Fakta / Klaim / Catatan Lapangan
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddClaim} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Klasifikasi Status:
                </label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value as ClaimType)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="fact">✅ Terkonfirmasi (Dokumen / Sumber Resmi)</option>
                  <option value="claim">⚠️ Klaim / Pernyataan Narasumber</option>
                  <option value="unverified">❓ Belum Terverifikasi (Sinyal Medsos / Desas-desus)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Isi Temuan / Pernyataan:
                </label>
                <textarea
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Tuliskan temuan atau data yang diperoleh..."
                  rows={3}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Sumber / Instansi:
                </label>
                <input
                  type="text"
                  value={newSourceName}
                  onChange={e => setNewSourceName(e.target.value)}
                  placeholder="Misal: Humas Polres Purwakarta / Surat Terbuka Serikat"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Catatan Verifikasi (Opsional):
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="Misal: Nomor surat edaran, tanggal rilis, atau hasil cek lapangan..."
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gmni-red hover:bg-red-700 text-white rounded-lg font-semibold shadow-xs"
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
