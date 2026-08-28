'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Newspaper, 
  Radio, 
  FileText, 
  ExternalLink, 
  Plus, 
  X, 
  Info
} from 'lucide-react';
import { Source, SourceType } from '@/types';
import { formatDateIndo } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

import SourceDrawer from './SourceDrawer';
import { DossierCitation } from '@/types';

interface SourcePanelProps {
  issueId: string;
  sources: Source[];
}

export default function SourcePanel({ issueId, sources }: SourcePanelProps) {
  const { role, addSource } = useApp();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<DossierCitation | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceType, setNewSourceType] = useState<SourceType>('Official Source');
  const [newSummary, setNewSummary] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  const officialCount = sources.filter(s => s.source_type === 'Official Source' || (s.source_name || '').toLowerCase().includes('antara') || (s.source_name || '').toLowerCase().includes('pemkab') || (s.source_name || '').toLowerCase().includes('resmi')).length;
  const nationalCount = sources.filter(s => s.source_type === 'Established Media' || (s.source_name || '').toLowerCase().includes('kompas') || (s.source_name || '').toLowerCase().includes('detik') || (s.source_name || '').toLowerCase().includes('tempo')).length;
  const localCount = sources.filter(s => s.source_type === 'Local Media' || (s.source_name || '').toLowerCase().includes('radar') || (s.source_name || '').toLowerCase().includes('purwakarta')).length;
  const socialCount = sources.filter(s => s.source_type === 'Social Media' || s.source_type === 'Public Signal' || (s.source_name || '').toLowerCase().includes('x.com') || (s.source_name || '').toLowerCase().includes('instagram')).length;
  const regionalCount = Math.max(0, sources.length - officialCount - nationalCount - localCount - socialCount);

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSourceName.trim()) return;

    let credScore = 80;
    if (newSourceType === 'Official Source') credScore = 95;
    else if (newSourceType === 'Established Media') credScore = 85;
    else if (newSourceType === 'Local Media') credScore = 75;
    else if (newSourceType === 'Social Media') credScore = 45;
    else if (newSourceType === 'Public Signal') credScore = 50;

    const source: Source = {
      id: `src-${Date.now()}`,
      issue_id: issueId,
      title: newTitle,
      url: newUrl || '#',
      source_name: newSourceName,
      source_type: newSourceType,
      credibility_score: credScore,
      published_at: new Date().toISOString(),
      summary: newSummary,
      author_or_institution: newAuthor || newSourceName
    };

    addSource(source);
    setIsAddOpen(false);
    setNewTitle('');
    setNewUrl('');
    setNewSourceName('');
    setNewSummary('');
    setNewAuthor('');
  };

  const getSourceIcon = (type: SourceType) => {
    switch (type) {
      case 'Official Source':
        return <Building2 className="w-4 h-4 text-ink-primary" />;
      case 'Established Media':
      case 'Local Media':
        return <Newspaper className="w-4 h-4 text-ink-primary" />;
      default:
        return <Radio className="w-4 h-4 text-ink-secondary" />;
    }
  };

  const openSourceDrawer = (source: Source, index: number) => {
    const isHttps = source.url && source.url.startsWith('https://') && !source.url.includes('localhost');
    const isSocial = source.source_type === 'Social Media' || source.source_type === 'Public Signal';
    
    setSelectedCitation({
      source_id: source.id,
      index: index + 1,
      badge: `[Sumber ${String(index + 1).padStart(2, '0')}]`,
      source_name: source.source_name,
      title: source.title,
      published_at: source.published_at,
      author: source.author_or_institution || 'Penulis tidak tercantum',
      url: source.url,
      tier: source.source_type,
      source_type: isSocial ? 'SOCIAL_SIGNAL' : source.source_type === 'Official Source' ? 'OFFICIAL' : source.source_type === 'Established Media' ? 'NATIONAL_MEDIA' : 'LOCAL_MEDIA',
      location: 'Jawa Barat / Nasional',
      verification_status: isSocial ? 'UNVERIFIED' : isHttps ? 'SUPPORTED' : 'PARTIALLY_SUPPORTED',
      credibility_score: source.credibility_score || 80,
      supported_facts: [`[F0${index + 1}] Fakta peristiwa terindeks dari publikasi ${source.source_name}.`],
      claims_from_source: [`[C0${index + 1}] Pernyataan dan rilis penanganan dari ${source.author_or_institution || source.source_name}.`],
      ingestion_timestamp: source.published_at || new Date().toISOString()
    });
  };

  return (
    <div className="bg-surface rounded-card border border-border p-6 space-y-5 shadow-subtle">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-ink-primary">
              SUMBER & BUKTI TERVERIFIKASI
            </h3>
            <span className="text-xs text-ink-tertiary">
              ({sources.length} total sumber)
            </span>
          </div>
          <p className="text-xs text-ink-secondary mt-0.5">
            Register rujukan pers independen, dokumen rilis resmi, dan data lapangan.
          </p>
        </div>

        {(role === 'admin' || role === 'researcher') && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-ink-primary hover:bg-black text-white rounded-btn transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Rujukan</span>
          </button>
        )}
      </div>

      {/* Summary Classification Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
        <div className="p-2.5 bg-stone-50 rounded border border-border">
          <div className="text-[10px] text-ink-tertiary uppercase font-medium">Total Sumber</div>
          <div className="text-base font-bold font-mono text-ink-primary">{sources.length}</div>
        </div>
        <div className="p-2.5 bg-stone-50 rounded border border-border">
          <div className="text-[10px] text-ink-tertiary uppercase font-medium">Sumber Resmi</div>
          <div className="text-base font-bold font-mono text-emerald-700">{officialCount}</div>
        </div>
        <div className="p-2.5 bg-stone-50 rounded border border-border">
          <div className="text-[10px] text-ink-tertiary uppercase font-medium">Media Nasional</div>
          <div className="text-base font-bold font-mono text-blue-700">{nationalCount}</div>
        </div>
        <div className="p-2.5 bg-stone-50 rounded border border-border">
          <div className="text-[10px] text-ink-tertiary uppercase font-medium">Media Regional/Lokal</div>
          <div className="text-base font-bold font-mono text-amber-700">{regionalCount + localCount}</div>
        </div>
        <div className="p-2.5 bg-stone-50 rounded border border-border">
          <div className="text-[10px] text-ink-tertiary uppercase font-medium">Social Signal</div>
          <div className="text-base font-bold font-mono text-stone-500">{socialCount}</div>
        </div>
      </div>

      {/* Methodology note */}
      <div className="text-[11px] text-ink-secondary bg-stone-50 p-3 rounded-btn border border-border/70 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-ink-tertiary shrink-0 mt-0.5" />
        <span>
          Klik pada setiap kartu rujukan untuk membuka <strong>Register Provenance Sumber</strong> dan memeriksa detail metadata, status verifikasi, serta tautan artikel asli.
        </span>
      </div>

      {/* Sources List */}
      <div className="space-y-3">
        {sources.length === 0 ? (
          <p className="text-xs text-ink-tertiary italic text-center py-4">
            Belum ada rujukan sumber yang ditautkan.
          </p>
        ) : (
          sources.map((source, idx) => (
            <div
              key={source.id || idx}
              onClick={() => openSourceDrawer(source, idx)}
              className="p-4 rounded-btn border border-border bg-stone-50/40 hover:bg-stone-100/70 cursor-pointer transition-colors space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary font-mono font-bold rounded text-[11px]">
                    [Sumber {String(idx + 1).padStart(2, '0')}]
                  </span>
                  {getSourceIcon(source.source_type)}
                  <span className="font-bold text-ink-primary">
                    {source.source_name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-ink-secondary border border-border">
                    {source.source_type}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-ink-tertiary font-mono">
                  <span>Kredibilitas: <strong className="text-ink-primary">{source.credibility_score}/100</strong></span>
                  <span>·</span>
                  <span>{formatDateIndo(source.published_at)}</span>
                </div>
              </div>

              <h4 className="text-xs sm:text-sm font-semibold text-ink-primary leading-snug">
                {source.title}
              </h4>

              <p className="text-xs text-ink-secondary leading-relaxed">
                {source.summary}
              </p>

              <div className="pt-1.5 border-t border-border/60 flex items-center justify-between text-[11px]">
                <span className="text-ink-tertiary">
                  Penulis/Institusi: <span className="text-ink-secondary font-medium">{source.author_or_institution || 'Penulis tidak tercantum'}</span>
                </span>

                <span className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                  <span>Periksa Register Sumber</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Interactive Source Drawer */}
      <SourceDrawer
        citation={selectedCitation}
        isOpen={Boolean(selectedCitation)}
        onClose={() => setSelectedCitation(null)}
      />

      {/* Add Source Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-surface rounded-card p-6 shadow-card border border-border space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h4 className="text-sm font-bold text-ink-primary">
                Tambah Rujukan Sumber Data
              </h4>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-ink-tertiary hover:text-ink-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSource} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-ink-secondary mb-1">
                  Kategori Sumber:
                </label>
                <select
                  value={newSourceType}
                  onChange={e => setNewSourceType(e.target.value as SourceType)}
                  className="w-full p-2 bg-surface border border-border rounded-btn text-xs"
                >
                  <option value="Official Source">Sumber Resmi / Lembaga Negara (Skor 95)</option>
                  <option value="Established Media">Media Nasional Kredibel (Skor 85)</option>
                  <option value="Local Media">Media Lokal / Regional (Skor 75)</option>
                  <option value="Public Signal">Sinyal Publik / Aduan Warga (Skor 50)</option>
                  <option value="Social Media">Media Sosial (Skor 45)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-ink-secondary mb-1">
                  Judul Dokumen / Rilis:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Misal: Surat Edaran Penataan KJA Nomor 42..."
                  className="w-full p-2 bg-surface border border-border rounded-btn text-xs focus:outline-none focus:border-stone-400"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-ink-secondary mb-1">
                  Penerbit / Instansi:
                </label>
                <input
                  type="text"
                  value={newSourceName}
                  onChange={e => setNewSourceName(e.target.value)}
                  placeholder="Misal: Perum Jasa Tirta II / Polres Purwakarta"
                  className="w-full p-2 bg-surface border border-border rounded-btn text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-ink-secondary mb-1">
                  Tautan Dokumen / URL:
                </label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2 bg-surface border border-border rounded-btn text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-ink-secondary mb-1">
                  Ringkasan Rujukan:
                </label>
                <textarea
                  value={newSummary}
                  onChange={e => setNewSummary(e.target.value)}
                  placeholder="Poin-poin penting dalam dokumen ini..."
                  rows={3}
                  className="w-full p-2 bg-surface border border-border rounded-btn text-xs focus:outline-none focus:border-stone-400"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-2 bg-muted hover:bg-stone-200 text-ink-primary rounded-btn font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-ink-primary hover:bg-black text-white rounded-btn font-semibold"
                >
                  Simpan Rujukan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
