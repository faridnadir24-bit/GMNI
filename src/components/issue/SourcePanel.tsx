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

interface SourcePanelProps {
  issueId: string;
  sources: Source[];
}

export default function SourcePanel({ issueId, sources }: SourcePanelProps) {
  const { role, addSource } = useApp();
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceType, setNewSourceType] = useState<SourceType>('Official Source');
  const [newSummary, setNewSummary] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

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

  return (
    <div className="bg-surface rounded-card border border-border p-6 space-y-5 shadow-subtle">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-ink-primary">
              Rujukan Sumber & Indeks Kredibilitas
            </h3>
            <span className="text-xs text-ink-tertiary">
              ({sources.length} rujukan)
            </span>
          </div>
          <p className="text-xs text-ink-secondary mt-0.5">
            Dokumen regulasi, liputan media terverifikasi, dan data lapangan.
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

      {/* Methodology note */}
      <div className="text-[11px] text-ink-secondary bg-stone-50 p-3 rounded-btn border border-border/70 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-ink-tertiary shrink-0 mt-0.5" />
        <span>
          Skor kredibilitas adalah <strong>indikator internal sistem</strong> untuk mengukur reliabilitas dokumen sebelum dijadikan bahan kajian resmi.
        </span>
      </div>

      {/* Sources List */}
      <div className="space-y-3">
        {sources.length === 0 ? (
          <p className="text-xs text-ink-tertiary italic text-center py-4">
            Belum ada rujukan sumber yang ditautkan.
          </p>
        ) : (
          sources.map(source => (
            <div
              key={source.id}
              className="p-4 rounded-btn border border-border bg-stone-50/40 hover:bg-stone-50 transition-colors space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-2">
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
                  Penulis/Institusi: <span className="text-ink-secondary font-medium">{source.author_or_institution}</span>
                </span>

                {source.url && source.url !== '#' && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                  >
                    <span>Buka Rujukan</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

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
