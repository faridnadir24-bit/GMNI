'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Newspaper, 
  Radio, 
  FileText, 
  ExternalLink, 
  Search, 
  Info
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatDateIndo } from '@/lib/utils';

export default function SumberPage() {
  const { sources } = useApp();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const credibilityTiers = [
    { type: 'Official Source', label: 'Sumber Resmi / Lembaga Negara', score: '95/100', icon: Building2, desc: 'Pemerintah daerah, BUMN, BNPB, BMKG, BPS, Polri, DPR, Perda, Putusan Pengadilan' },
    { type: 'Established Media', label: 'Media Nasional Terverifikasi', score: '85/100', icon: Newspaper, desc: 'Media arus utama nasional terdaftar di Dewan Pers dengan kode etik jurnalistik' },
    { type: 'Local Media', label: 'Media Lokal & Regional', score: '75/100', icon: FileText, desc: 'Media massa daerah Purwakarta & Jawa Barat yang meliput dinamika akar rumput' },
    { type: 'Public Signal', label: 'Sinyal Publik & Komunitas', score: '50/100', icon: Radio, desc: 'Forum warga, aduan langsung ke posko kader, laporan komunitas desa' },
    { type: 'Social Media', label: 'Media Sosial (Indikator Awal)', score: '45/100', icon: Radio, desc: 'Instagram, TikTok, X, YouTube — indikator atensi publik awal, wajib validasi silang' },
  ];

  const filteredSources = sources.filter(s => {
    if (selectedType !== 'all' && s.source_type !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = s.title.toLowerCase().includes(q) ||
                    s.source_name.toLowerCase().includes(q) ||
                    s.summary.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-ink-primary">
              Registri Sumber Data & Kredibilitas
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 bg-stone-100 text-ink-secondary rounded border border-border">
              {sources.length} Sumber Terdata
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
            Standar kurasi data, metodologi pembobotan reliabilitas rujukan, dan transparansi rilis informasi.
          </p>
        </div>
      </div>

      {/* Internal Credibility Disclaimer */}
      <div className="p-4 bg-stone-50 border border-border rounded-card flex items-start gap-3 shadow-subtle">
        <Info className="w-4 h-4 text-ink-tertiary shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-ink-secondary leading-relaxed">
          <h4 className="font-semibold text-ink-primary">
            Prinsip Metodologi Kredibilitas:
          </h4>
          <p>
            Skor kredibilitas merupakan <strong>indikator internal sistem</strong> yang dirancang untuk mengukur tingkat verifikasi dokumen, bukan kebenaran mutlak. Informasi dari media sosial diperlakukan sebagai <strong>sinyal awal</strong> dan tidak otomatis dianggap sebagai fakta terkonfirmasi sampai divalidasi silang.
          </p>
        </div>
      </div>

      {/* Credibility Tiers Matrix */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
          Standar Klasifikasi Reliabilitas:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {credibilityTiers.map((tier, idx) => {
            const Icon = tier.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-btn border border-border bg-surface space-y-2 shadow-subtle"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-ink-secondary" />
                    <span className="text-xs font-bold text-ink-primary">{tier.label}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-primary">
                    {tier.score}
                  </span>
                </div>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  {tier.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-surface p-4 rounded-card border border-border space-y-3 shadow-subtle">
        <div className="relative">
          <Search className="w-4 h-4 text-ink-tertiary absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari nama penerbit rujukan, judul dokumen, atau kata kunci..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-muted/60 border border-border rounded-btn placeholder:text-ink-tertiary focus:outline-none focus:bg-surface focus:border-stone-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs pt-1">
          <span className="text-[11px] font-semibold text-ink-tertiary uppercase">Filter Kategori:</span>
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="p-1.5 bg-surface border border-border rounded-btn text-xs font-medium text-ink-primary"
          >
            <option value="all">Semua Kategori</option>
            <option value="Official Source">Official Source</option>
            <option value="Established Media">Established Media</option>
            <option value="Local Media">Local Media</option>
            <option value="Public Signal">Public Signal</option>
            <option value="Social Media">Social Media</option>
          </select>
        </div>
      </div>

      {/* Sources Table / List */}
      <div className="space-y-3">
        {filteredSources.map(source => (
          <div
            key={source.id}
            className="p-5 bg-surface rounded-card border border-border shadow-subtle hover:border-stone-400 transition-colors space-y-2.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-ink-primary">{source.source_name}</span>
                <span className="text-[10px] px-2 py-0.2 rounded bg-stone-100 text-ink-secondary border border-border">
                  {source.source_type}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-ink-tertiary font-mono">
                <span>Skor Kredibilitas: <strong className="text-primary font-bold">{source.credibility_score}/100</strong></span>
                <span>·</span>
                <span>{formatDateIndo(source.published_at)}</span>
              </div>
            </div>

            <h4 className="text-sm font-semibold text-ink-primary leading-snug">
              {source.title}
            </h4>

            <p className="text-xs text-ink-secondary leading-relaxed">
              {source.summary}
            </p>

            <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
              <span className="text-ink-tertiary">
                Institusi / Penulis: <span className="text-ink-secondary font-medium">{source.author_or_institution}</span>
              </span>

              {source.url && source.url !== '#' && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                >
                  <span>Buka Berkas Asli</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
