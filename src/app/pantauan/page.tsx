'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  RefreshCw, 
  ExternalLink, 
  Search, 
  Filter, 
  Layers, 
  Radio, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  FileText,
  Check,
  GitCommit,
  Sparkles,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatDateIndo } from '@/lib/utils';
import CategoryBadge from '@/components/ui/CategoryBadge';
import LocationBadge from '@/components/ui/LocationBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import ScoreIndicator from '@/components/ui/ScoreIndicator';
import { mockSignals } from '@/data/mockSignals';
import { IssueEvent } from '@/types';

export default function PantauanPage() {
  const { issues, articles, syncLiveNews, isSyncingNews, lastSyncedTime } = useApp();
  const [activeViewMode, setActiveViewMode] = useState<'articles' | 'issues' | 'changes'>('articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [syncToast, setSyncToast] = useState<{ show: boolean; msg: string; count?: number } | null>(null);

  const handleManualSync = async () => {
    const result = await syncLiveNews();
    setSyncToast({
      show: true,
      msg: result.message,
      count: result.count,
    });
    setTimeout(() => {
      setSyncToast(null);
    }, 4500);
  };

  // Filter Articles
  const filteredArticles = articles.filter(art => {
    const matchQuery = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.source_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.category && art.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (art.location && art.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCategory = categoryFilter === 'all' || art.category === categoryFilter;
    const matchLocation = locationFilter === 'all' || (art.location && art.location.toLowerCase().includes(locationFilter.toLowerCase()));
    return matchQuery && matchCategory && matchLocation;
  });

  // Filter Issues
  const filteredIssues = issues.filter(iss => {
    const matchQuery = 
      iss.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iss.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iss.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iss.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = categoryFilter === 'all' || iss.category === categoryFilter;
    const matchLocation = locationFilter === 'all' || iss.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchQuery && matchCategory && matchLocation;
  });

  // Filter Changes (all events combined)
  const allEvents: { event: IssueEvent; issueSlug: string; issueTitle: string }[] = [];
  issues.forEach(iss => {
    (iss.events || []).forEach(ev => {
      allEvents.push({
        event: ev,
        issueSlug: iss.slug,
        issueTitle: iss.title,
      });
    });
  });

  const filteredChanges = allEvents
    .filter(item => {
      const matchQuery = 
        item.event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.issueTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.event.description && item.event.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchQuery;
    })
    .sort((a, b) => new Date(b.event.event_at).getTime() - new Date(a.event.event_at).getTime());

  const categories = ['all', 'Agraria', 'Ketenagakerjaan', 'Lingkungan', 'Pendidikan', 'Pemerintahan', 'Keamanan', 'Ekonomi', 'Sosial'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Toast Notification */}
      {syncToast && (
        <div className="fixed top-20 right-6 z-50 max-w-sm bg-stone-900 text-white p-4 rounded-card border border-stone-700 shadow-xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-xs font-bold">Sinkronisasi Selesai</div>
              <div className="text-[11px] text-stone-300 leading-relaxed">{syncToast.msg}</div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER WITH SYNC BUTTON */}
      <div className="bg-surface rounded-card border border-border p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
              Near Real-Time Intelligence
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-primary">
            Pusat Pantauan Berita & Isu Kebijakan
          </h1>
          <p className="text-xs text-ink-secondary">
            Aliran artikel berita terverifikasi, pengelompokan isu (ARTIKEL BARU ≠ ISU BARU), dan rekam jejak perubahan.
          </p>
        </div>

        {/* Sync Trigger & Time */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="text-right text-[11px] font-mono text-ink-tertiary">
            <div>Terakhir Sinkron: {lastSyncedTime ? `${lastSyncedTime} WIB` : '18:42 WIB'}</div>
            <div className="text-emerald-700 font-sans font-medium">● 9/9 Feed RSS Aktif (Pipeline Terhubung)</div>
          </div>
          <button
            onClick={handleManualSync}
            disabled={isSyncingNews}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-btn bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingNews ? 'animate-spin' : ''}`} />
            <span>{isSyncingNews ? 'Menarik Berita...' : 'Tarik Berita'}</span>
          </button>
        </div>
      </div>

      {/* DUAL MODE TOGGLE STRIP */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-2 rounded-card border border-border shadow-subtle">
        {/* Toggle [ Berita ] [ Isu ] [ Perubahan ] */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-btn w-full sm:w-auto">
          <button
            onClick={() => setActiveViewMode('articles')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded text-xs font-semibold transition-all ${
              activeViewMode === 'articles'
                ? 'bg-white text-ink-primary shadow-sm'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            Berita Masuk ({filteredArticles.length})
          </button>
          <button
            onClick={() => setActiveViewMode('issues')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded text-xs font-semibold transition-all ${
              activeViewMode === 'issues'
                ? 'bg-white text-ink-primary shadow-sm'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            Isu Aktif ({filteredIssues.length})
          </button>
          <button
            onClick={() => setActiveViewMode('changes')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded text-xs font-semibold transition-all ${
              activeViewMode === 'changes'
                ? 'bg-white text-ink-primary shadow-sm'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            Perubahan Terkini ({filteredChanges.length})
          </button>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-ink-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul, kata kunci, lokus..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-border rounded text-xs focus:bg-white focus:outline-none focus:border-stone-400 font-sans"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-stone-50 border border-border rounded text-xs text-ink-primary focus:outline-none"
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c === 'all' ? 'Semua Bidang' : c}
              </option>
            ))}
          </select>

          <select
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-stone-50 border border-border rounded text-xs text-ink-primary focus:outline-none"
          >
            <option value="all">Semua Wilayah</option>
            <option value="purwakarta">Purwakarta</option>
            <option value="jawa barat">Jawa Barat</option>
            <option value="nasional">Nasional</option>
          </select>
        </div>
      </div>

      {/* VIEW 1: BERITA (ARTICLES) */}
      {activeViewMode === 'articles' && (
        <div className="space-y-3">
          <div className="text-xs font-semibold text-ink-secondary flex items-center justify-between">
            <span>Daftar Artikel Masuk & Status Pengelompokan Isu</span>
            <span className="font-mono text-[11px]">{filteredArticles.length} artikel terdata</span>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="bg-surface rounded-card border border-border p-12 text-center space-y-3">
              <FileText className="w-8 h-8 text-ink-tertiary mx-auto" />
              <div className="text-sm font-semibold text-ink-primary">Belum ada artikel berita tersinkronisasi.</div>
              <p className="text-xs text-ink-secondary max-w-sm mx-auto">
                Klik tombol &quot;Tarik Berita&quot; di atas untuk menarik artikel berita dari Antara, Tempo, CNN, dan Republika.
              </p>
              <button
                onClick={handleManualSync}
                className="px-4 py-2 rounded-btn bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
              >
                Tarik Berita Sekarang
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredArticles.map(art => (
                <div
                  key={art.id}
                  className="bg-surface rounded-card border border-border p-4 hover:border-stone-400 transition-colors flex flex-col justify-between space-y-3 shadow-subtle"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-stone-100 font-semibold text-[10px] text-ink-primary border border-border">
                          {art.source_name}
                        </span>
                        {art.category && <CategoryBadge category={art.category} />}
                        {art.location && <LocationBadge location={art.location} size="sm" />}
                      </div>
                      <span className="text-[10px] font-mono text-ink-tertiary">
                        {formatDateIndo(art.published_at)}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-ink-primary leading-snug">
                      {art.title}
                    </h3>

                    <p className="text-xs text-ink-secondary line-clamp-2 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5 text-ink-tertiary">
                      {art.issue_id ? (
                        <span className="text-emerald-700 font-semibold inline-flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Tergabung ke Isu: {art.issue_title || 'Isu Terkait'}</span>
                        </span>
                      ) : (
                        <span>Siap dikelompokkan ke isu kebijakan</span>
                      )}
                    </div>

                    <a
                      href={art.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
                    >
                      <span>Buka Berita Asli</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: ISU AKTIF */}
      {activeViewMode === 'issues' && (
        <div className="space-y-3">
          <div className="text-xs font-semibold text-ink-secondary flex items-center justify-between">
            <span>Daftar Isu Kebijakan yang Sedang Dipantau</span>
            <span className="font-mono text-[11px]">{filteredIssues.length} isu aktif</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredIssues.map(issue => (
              <div
                key={issue.id}
                className="bg-surface rounded-card border border-border p-5 hover:border-stone-400 transition-all flex flex-col justify-between space-y-4 shadow-subtle group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={issue.status} />
                    <span className="text-[11px] font-mono text-ink-tertiary">
                      Confidence: {issue.confidence_score || 75}%
                    </span>
                  </div>

                  <Link href={`/isu/${issue.slug}`} className="block group-hover:text-primary transition-colors">
                    <h3 className="text-sm font-bold text-ink-primary line-clamp-2 leading-snug">
                      {issue.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-ink-secondary line-clamp-3 leading-relaxed">
                    {issue.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <LocationBadge location={issue.location} district={issue.district} size="sm" />
                    <CategoryBadge category={issue.category} />
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-ink-tertiary text-[11px] font-mono">
                    {issue.sources_count} Rujukan Media
                  </span>
                  <Link
                    href={`/isu/${issue.slug}`}
                    className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>Detail Isu</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: PERUBAHAN TERKINI (EVENTS TIMELINE) */}
      {activeViewMode === 'changes' && (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-ink-secondary flex items-center justify-between">
            <span>Kronologi Perubahan & Informasi Baru yang Masuk ke Sistem</span>
            <span className="font-mono text-[11px]">{filteredChanges.length} peristiwa tercatat</span>
          </div>

          {filteredChanges.length === 0 ? (
            <div className="bg-surface rounded-card border border-border p-12 text-center space-y-2">
              <GitCommit className="w-8 h-8 text-ink-tertiary mx-auto" />
              <div className="text-sm font-semibold text-ink-primary">Belum ada catatan peristiwa baru.</div>
              <p className="text-xs text-ink-secondary">
                Perubahan akan otomatis tercatat setiap kali artikel berita baru digabungkan ke dalam basis isu.
              </p>
            </div>
          ) : (
            <div className="bg-surface rounded-card border border-border p-5 divide-y divide-border shadow-subtle">
              {filteredChanges.map((item, idx) => (
                <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-stone-100 text-primary shrink-0 mt-0.5">
                      <GitCommit className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-ink-primary">{item.event.title}</span>
                        {item.event.source_name && (
                          <span className="px-1.5 py-0.5 rounded bg-stone-100 text-[10px] font-mono text-ink-secondary border border-border">
                            {item.event.source_name}
                          </span>
                        )}
                      </div>
                      {item.event.description && (
                        <p className="text-xs text-ink-secondary leading-relaxed">
                          {item.event.description}
                        </p>
                      )}
                      <div className="text-[11px] text-ink-tertiary font-mono">
                        Terkait Isu:{' '}
                        <Link href={`/isu/${item.issueSlug}`} className="text-primary hover:underline font-semibold font-sans">
                          {item.issueTitle}
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-ink-tertiary shrink-0 sm:text-right">
                    {formatDateIndo(item.event.event_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
