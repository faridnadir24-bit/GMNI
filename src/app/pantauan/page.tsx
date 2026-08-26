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
  Info,
  RefreshCw,
  Sparkles,
  Newspaper,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { mockSignals } from '@/data/mockSignals';
import { formatDateIndo } from '@/lib/utils';
import LocationBadge from '@/components/ui/LocationBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import StatusBadge from '@/components/ui/StatusBadge';

export default function PantauanMedsosPage() {
  const { issues, isSyncingNews, syncLiveNews, lastSyncedTime, isRealData } = useApp();
  const [activeTab, setActiveTab] = useState<'news' | 'signals'>('news');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const handleSync = async () => {
    const res = await syncLiveNews();
    setSyncStatusMsg(res.message);
    setTimeout(() => setSyncStatusMsg(null), 4000);
  };

  const platforms = [
    { name: 'Antara News', growth: '+42%', count: 'Liputan Resmi' },
    { name: 'Tempo Nasional', growth: '+28%', count: 'Investigasi' },
    { name: 'CNN Indonesia', growth: '+35%', count: 'Politik/Ekonomi' },
    { name: 'Republika', growth: '+15%', count: 'Daerah' },
    { name: 'Posko Kader', growth: '+50%', count: 'Purwakarta' },
  ];

  const topHashtags = [
    { tag: '#KJAJatiluhur', count: '18.4K', trend: '+45%' },
    { tag: '#BuruhPurwakarta', count: '12.1K', trend: '+38%' },
    { tag: '#PurwakartaTerkini', count: '9.8K', trend: '+22%' },
    { tag: '#WanayasaLahanTani', count: '6.4K', trend: '+52%' },
    { tag: '#KawasanIndustriBungursari', count: '8.7K', trend: '+30%' },
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

  const filteredNews = issues.filter(item => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.title.toLowerCase().includes(q) ||
             item.description.toLowerCase().includes(q) ||
             item.location.toLowerCase().includes(q) ||
             item.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-primary">
            Pantauan Berita Real-Time & Sinyal Publik
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
            Sistem agregasi informasi media massa daerah & nasional, deteksi sentimen, dan dinamika keresahan publik.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastSyncedTime && (
            <span className="text-[11px] font-mono text-ink-tertiary hidden sm:inline">
              Sinkronisasi: {lastSyncedTime} WIB
            </span>
          )}

          <button
            onClick={handleSync}
            disabled={isSyncingNews}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-btn border transition-all ${
              isSyncingNews
                ? 'bg-muted text-ink-secondary border-border cursor-not-allowed'
                : 'bg-primary text-white border-primary hover:bg-[#8F0D15] active:scale-95 shadow-subtle'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingNews ? 'animate-spin' : ''}`} />
            <span>{isSyncingNews ? 'Sedang Menarik Berita...' : 'Tarik Berita Real-Time'}</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      {syncStatusMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-btn flex items-center justify-between gap-2 text-emerald-800 text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncStatusMsg}</span>
          </div>
          <span className="font-mono text-[11px] text-emerald-700">Live DB</span>
        </div>
      )}

      {/* Mandatory Verification Principle Notice */}
      <div className="p-4 bg-stone-50 border border-border rounded-card flex items-start gap-3 text-ink-primary shadow-subtle">
        <Info className="w-4 h-4 text-ink-tertiary shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-semibold text-ink-primary">
            Prinsip Etika Verifikasi Informasi:
          </h4>
          <p className="text-ink-secondary leading-relaxed">
            Setiap berita dan sinyal publik yang ditarik oleh sistem AI Ruang Isu diklasifikasikan secara dialektis ke dalam <strong>Terkonfirmasi</strong>, <strong>Klaim</strong>, dan <strong>Perlu Verifikasi</strong>. Kader GMNI wajib memvalidasi data lapangan sebelum menyusun naskah advokasi kebijakan publik.
          </p>
        </div>
      </div>

      {/* Media & Platform Source Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {platforms.map(p => (
          <div key={p.name} className="p-3.5 bg-surface rounded-card border border-border space-y-1 shadow-subtle">
            <div className="text-xs font-semibold text-ink-primary">{p.name}</div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-ink-secondary">{p.count}</span>
              <span className="text-[11px] font-mono font-semibold text-primary">{p.growth}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Switcher: Berita Terkini vs Sinyal Publik */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('news')}
          className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'news'
              ? 'border-primary text-primary'
              : 'border-transparent text-ink-secondary hover:text-ink-primary'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>Berita & Isu Terpantau ({filteredNews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('signals')}
          className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'signals'
              ? 'border-primary text-primary'
              : 'border-transparent text-ink-secondary hover:text-ink-primary'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Sinyal Percakapan Warganet ({filteredSignals.length})</span>
        </button>
      </div>

      {/* TAB 1: BERITA & ISU TERPANTAU REAL-TIME */}
      {activeTab === 'news' && (
        <div className="space-y-4">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-ink-tertiary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari judul berita, topik kebijakan, atau lokus wilayah..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-muted/60 border border-border rounded-btn placeholder:text-ink-tertiary focus:outline-none focus:bg-surface focus:border-stone-400"
            />
          </div>

          {/* List of Issues */}
          <div className="space-y-3">
            {filteredNews.map(item => (
              <div
                key={item.id}
                className="p-5 bg-surface rounded-card border border-border shadow-subtle hover:border-stone-400 transition-colors space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <LocationBadge location={item.location} district={item.district} size="sm" />
                    <CategoryBadge category={item.category} />
                    <StatusBadge status={item.status} />
                  </div>
                  <span className="text-[11px] font-mono text-ink-tertiary">
                    Diperbarui {formatDateIndo(item.last_updated_at)}
                  </span>
                </div>

                <div className="space-y-1">
                  <Link href={`/isu/${item.slug}`} className="group">
                    <h3 className="text-base font-bold text-ink-primary group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-ink-secondary leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/80 text-xs">
                  <div className="flex items-center gap-3 text-ink-tertiary text-[11px]">
                    <span>{item.sources_count} Rujukan Media</span>
                    <span>·</span>
                    <span>Impact: <strong className="text-ink-primary">{item.impact_score}/100</strong></span>
                    <span>·</span>
                    <span>Evidence: <strong className="text-ink-primary">{item.evidence_score}/100</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/ai-analyst?issue=${item.id}`}
                      className="px-3 py-1 bg-muted hover:bg-stone-200 text-ink-primary text-xs font-semibold rounded-btn transition-colors"
                    >
                      Analisis AI
                    </Link>
                    <Link
                      href={`/isu/${item.slug}`}
                      className="px-3 py-1 bg-ink-primary hover:bg-black text-white text-xs font-semibold rounded-btn transition-colors"
                    >
                      Detail Isu
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: SINYAL PERCAKAPAN PUBLIK */}
      {activeTab === 'signals' && (
        <div className="space-y-6">
          
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
                    <span className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-ink-secondary border border-border">
                      Sentimen: {sig.sentiment}
                    </span>
                  </div>
                  <span className="text-ink-tertiary text-[11px] font-mono">{sig.timestamp}</span>
                </div>

                <p className="text-xs sm:text-sm text-ink-primary leading-relaxed">
                  {sig.content}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {sig.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-100 text-ink-secondary border border-border"
                    >
                      {kw}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-ink-secondary">
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-ink-tertiary" />
                      {sig.engagement.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="w-3.5 h-3.5 text-ink-tertiary" />
                      {sig.engagement.shares}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-ink-tertiary" />
                      {sig.engagement.comments}
                    </span>
                  </div>

                  <Link
                    href={`/isu${sig.issue_id ? `?id=${sig.issue_id}` : `?search=${encodeURIComponent(sig.keywords[0] || '')}`}`}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                  >
                    <span>Kaitkan ke Isu</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
