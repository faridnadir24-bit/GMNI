'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  Plus, 
  X, 
  FileText, 
  Building2, 
  Newspaper, 
  Radio, 
  Info,
  Award
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

  const getSourceTypeIcon = (type: SourceType) => {
    switch (type) {
      case 'Official Source':
        return <Building2 className="w-4 h-4 text-blue-600" />;
      case 'Established Media':
        return <Newspaper className="w-4 h-4 text-emerald-600" />;
      case 'Local Media':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'Social Media':
      case 'Public Signal':
        return <Radio className="w-4 h-4 text-amber-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  const getCredibilityBadge = (score: number) => {
    if (score >= 90) return { label: 'Tingkat Kredibilitas Tinggi (Resmi)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 75) return { label: 'Tingkat Kredibilitas Sedang-Tinggi', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (score >= 50) return { label: 'Kredibilitas Lokal / Jurnalisme Warga', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Sinyal Awal Percakapan (Unverified)', color: 'text-slate-700 bg-slate-100 border-slate-200' };
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900 font-sans">
              Sumber Data & Sistem Kredibilitas
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              {sources.length} Sumber
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Indikator internal sistem untuk menilai reliabilitas dokumen regulasi, jurnalisme media, dan sinyal percakapan publik.
          </p>
        </div>

        {(role === 'admin' || role === 'researcher') && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors shrink-0 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Sumber</span>
          </button>
        )}
      </div>

      {/* Internal Credibility Disclaimer */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5 text-[11px] text-slate-600">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800">Catatan Metodologi:</span> Skor kredibilitas merupakan{' '}
          <span className="italic font-medium">indikator internal sistem</span> berbasis verifikasi institusi dan jejak rilis pers, bukan penetapan kebenaran mutlak. Media sosial diperlakukan sebagai sinyal awal dan wajib divalidasi silang.
        </div>
      </div>

      {/* Sources List */}
      <div className="space-y-3">
        {sources.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
            Belum ada sumber yang ditautkan pada isu ini.
          </div>
        ) : (
          sources.map(source => {
            const cred = getCredibilityBadge(source.credibility_score);

            return (
              <div
                key={source.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-white hover:bg-slate-50/50 space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getSourceTypeIcon(source.source_type)}
                    <span className="text-xs font-bold text-slate-800">
                      {source.source_name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200">
                      {source.source_type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cred.color}`}>
                      Skor: {source.credibility_score}/100
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatDateIndo(source.published_at)}
                    </span>
                  </div>
                </div>

                <h4 className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                  {source.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {source.summary}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    Penerbit / Penulis: <span className="font-medium text-slate-700">{source.author_or_institution}</span>
                  </span>

                  {source.url && source.url !== '#' && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-gmni-red hover:underline font-semibold text-xs"
                    >
                      <span>Buka Dokumen / Tautan</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Source Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="text-sm font-bold text-slate-900">
                Tambah Dokumen / Sumber Rujukan
              </h4>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSource} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kategori Sumber:
                </label>
                <select
                  value={newSourceType}
                  onChange={e => setNewSourceType(e.target.value as SourceType)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Official Source">🏛️ Sumber Resmi / Regulasi / Pemerintah (Skor 95)</option>
                  <option value="Established Media">📰 Media Nasional Kredibel (Skor 85)</option>
                  <option value="Local Media">📑 Media Lokal / Daerah (Skor 75)</option>
                  <option value="Social Media">📱 Media Sosial / Publikasi Komunitas (Skor 45)</option>
                  <option value="Public Signal">📡 Sinyal Publik / Forum Diskusi (Skor 50)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Judul Rilis / Dokumen:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Misal: Surat Edaran Penataan KJA Nomor 42..."
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Penerbit / Instansi / Media:
                </label>
                <input
                  type="text"
                  value={newSourceName}
                  onChange={e => setNewSourceName(e.target.value)}
                  placeholder="Misal: Perum Jasa Tirta II / Radar Purwakarta"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  URL / Tautan Sumber:
                </label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ringkasan Isi / Ekstrak Data:
                </label>
                <textarea
                  value={newSummary}
                  onChange={e => setNewSummary(e.target.value)}
                  placeholder="Poin-poin penting dalam dokumen ini..."
                  rows={3}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gmni-red hover:bg-red-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Simpan Sumber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
