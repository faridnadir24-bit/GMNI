'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Radio, 
  Search, 
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  Share2,
  Heart,
  Info
} from 'lucide-react';
import { mockSignals } from '@/data/mockSignals';

export default function PantauanMedsosPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const platforms = [
    { name: 'Instagram', growth: '+32%', count: '14.2K sinyal' },
    { name: 'TikTok', growth: '+51%', count: '28.6K sinyal' },
    { name: 'X / Twitter', growth: '+18%', count: '9.4K sinyal' },
    { name: 'YouTube', growth: '+12%', count: '3.1K diskusi' },
    { name: 'Forum Warga', growth: '+24%', count: '850 laporan' },
  ];

  const topHashtags = [
    { tag: '#KJAJatiluhur', count: '18.4K', trend: '+45%' },
    { tag: '#BuruhPurwakarta', count: '12.1K', trend: '+38%' },
    { tag: '#PurwakartaTerkini', count: '9.8K', trend: '+22%' },
    { tag: '#WanayasaLahanTani', count: '6.4K', trend: '+52%' },
    { tag: '#Karhutla2026', count: '45.2K', trend: '+42%' },
    { tag: '#JalurCikopoBegal', count: '5.1K', trend: '+29%' },
  ];

  const filteredSignals = mockSignals.filter(sig => {
    if (selectedPlatform !== 'all' && sig.platform !== selectedPlatform) return false;
    if (selectedSentiment !== 'all' && sig.sentiment !== selectedSentiment) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = sig.content.toLowerCase().includes(q) || 
                    sig.keywords.some(k => k.toLowerCase().includes(q)) ||
                    sig.location_tag.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-primary">
            Pantauan Percakapan & Sinyal Publik
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
            Sensor deteksi dini percakapan warganet, forum masyarakat, dan dinamika keresahan publik.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-stone-100 text-ink-secondary border border-border">
            Data Prototipe · Indikator Awal
          </span>
        </div>
      </div>

      {/* Mandatory Verification Principle Notice */}
      <div className="p-4 bg-stone-50 border border-border rounded-card flex items-start gap-3 text-ink-primary shadow-subtle">
        <Info className="w-4 h-4 text-ink-tertiary shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-semibold text-ink-primary">
            Prinsip Etika Verifikasi:
          </h4>
          <p className="text-ink-secondary leading-relaxed">
            Data percakapan media sosial merupakan sinyal awal dinamika masyarakat dan <strong>tidak otomatis menjadi fakta hukum</strong>. Seluruh sinyal wajib divalidasi silang dengan rilis resmi dan bukti lapangan sebelum dituangkan ke dalam Bahan Kajian.
          </p>
        </div>
      </div>

      {/* Platform Growth Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {platforms.map(p => (
          <div key={p.name} className="p-3.5 bg-surface rounded-card border border-border space-y-1 shadow-subtle">
            <div className="text-xs font-semibold text-ink-primary">{p.name}</div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-ink-secondary">{p.count}</span>
              <span className="text-[11px] font-mono font-semibold text-emerald-700">{p.growth}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Trending Topics & Hashtags */}
      <div className="bg-surface rounded-card border border-border p-5 space-y-3 shadow-subtle">
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
          Topik & Tagar Perbincangan Terkini
        </div>
        <div className="flex flex-wrap gap-2">
          {topHashtags.map(h => (
            <div
              key={h.tag}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-btn bg-stone-50 border border-border text-xs text-ink-primary"
            >
              <span className="font-semibold">{h.tag}</span>
              <span className="text-[11px] text-ink-tertiary">{h.count}</span>
              <span className="text-[10px] text-emerald-700 font-mono font-medium">{h.trend}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feed Filters & Search */}
      <div className="bg-surface p-4 rounded-card border border-border space-y-3 shadow-subtle">
        <div className="relative">
          <Search className="w-4 h-4 text-ink-tertiary absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari konten sinyal publik, tagar, atau lokus wilayah..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-muted/60 border border-border rounded-btn placeholder:text-ink-tertiary focus:outline-none focus:bg-surface focus:border-stone-400"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-ink-tertiary uppercase">Platform:</span>
            <select
              value={selectedPlatform}
              onChange={e => setSelectedPlatform(e.target.value)}
              className="p-1.5 bg-surface border border-border rounded-btn text-xs font-medium text-ink-primary"
            >
              <option value="all">Semua Platform</option>
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="X">X (Twitter)</option>
              <option value="YouTube">YouTube</option>
              <option value="Forum Warga">Forum Warga</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-ink-tertiary uppercase">Sentimen:</span>
            <select
              value={selectedSentiment}
              onChange={e => setSelectedSentiment(e.target.value)}
              className="p-1.5 bg-surface border border-border rounded-btn text-xs font-medium text-ink-primary"
            >
              <option value="all">Semua Sentimen</option>
              <option value="Negatif">Negatif (Keresahan)</option>
              <option value="Kritis">Kritis</option>
              <option value="Netral">Netral</option>
              <option value="Positif">Positif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Signals Feed List */}
      <div className="space-y-3">
        {filteredSignals.map(sig => (
          <div
            key={sig.id}
            className="p-5 bg-surface rounded-card border border-border shadow-subtle hover:border-stone-400 transition-colors space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-ink-primary">{sig.platform}</span>
                <span className="text-ink-tertiary">·</span>
                <span className="text-ink-secondary">{sig.location_tag}</span>
                <span className="text-[10px] px-2 py-0.2 rounded bg-stone-100 text-ink-secondary border border-border">
                  Sentimen: {sig.sentiment}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-ink-tertiary font-mono">
                <span>{sig.growth_rate} perbincangan</span>
                <span>·</span>
                <span>{new Date(sig.timestamp).toLocaleTimeString('id-ID')} WIB</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-ink-primary leading-relaxed">
              "{sig.content}"
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border text-[11px] text-ink-tertiary">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <Heart className="w-3 h-3" /> {sig.engagement.likes.toLocaleString('id-ID')}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> {sig.engagement.comments.toLocaleString('id-ID')}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Share2 className="w-3 h-3" /> {sig.engagement.shares.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {sig.keywords.map(k => (
                  <span key={k} className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-ink-secondary">
                    #{k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
