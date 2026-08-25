'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Radio, 
  ShieldAlert, 
  TrendingUp, 
  Search, 
  Filter, 
  MessageSquare, 
  Share2, 
  Heart, 
  AlertTriangle,
  ExternalLink,
  Flame,
  Hash,
  Sparkles,
  Info
} from 'lucide-react';
import { mockSignals } from '@/data/mockSignals';
import { Signal } from '@/types';

export default function PantauanMedsosPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const platforms = [
    { name: 'Instagram', growth: '+32%', count: '14.2K Sinyal', color: 'text-pink-600 bg-pink-50 border-pink-200' },
    { name: 'TikTok', growth: '+51%', count: '28.6K Sinyal', color: 'text-slate-900 bg-slate-100 border-slate-300' },
    { name: 'X / Twitter', growth: '+18%', count: '9.4K Sinyal', color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { name: 'YouTube', growth: '+12%', count: '3.1K Diskusi', color: 'text-red-600 bg-red-50 border-red-200' },
    { name: 'Forum Warga', growth: '+24%', count: '850 Laporan', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-6 h-6 text-gmni-red animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
              Pantauan Media Sosial & Sinyal Publik
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Sensor deteksi dini percakapan warganet, forum masyarakat, dan dinamika keresahan publik.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-slate-900 text-white px-3 py-1.5 rounded-xl">
            EARLY SIGNAL ENGINE
          </span>
        </div>
      </div>

      {/* MANDATORY ETHICAL WARNING BANNER (SECTION 16 & 32) */}
      <div className="p-4 bg-amber-50 border border-amber-300/80 rounded-2xl flex items-start gap-3 text-amber-950 shadow-2xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-amber-900">
            Prinsip Etika & Verifikasi Sinyal:
          </h4>
          <p className="leading-relaxed">
            "Data media sosial merupakan <strong>sinyal percakapan publik</strong> dan tidak otomatis menjadi fakta terverifikasi. 
            Sistem menggunakan sinyal ini semata-mata untuk early discovery / pemetaan keresahan masyarakat, 
            dan wajib divalidasi silang dengan sumber resmi sebelum dimasukkan ke dalam dokumen Bahan Kajian."
          </p>
        </div>
      </div>

      {/* Platform Growth Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {platforms.map(p => (
          <div
            key={p.name}
            className={`p-4 rounded-xl border ${p.color} space-y-2 shadow-2xs`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">{p.name}</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-white font-mono shadow-2xs">
                {p.growth}
              </span>
            </div>
            <div className="text-base sm:text-lg font-extrabold font-mono text-slate-800">
              {p.count}
            </div>
            <div className="text-[10px] text-slate-500">
              Pertumbuhan 7 hari
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Layout: Feeds + Trending Hashtags */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Signal Feeds with Filters */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-subtle space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari kata kunci percakapan, hashtag, atau wilayah..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400">Platform:</span>
                {['all', 'Instagram', 'TikTok', 'X', 'YouTube', 'Forum Warga'].map(plt => (
                  <button
                    key={plt}
                    onClick={() => setSelectedPlatform(plt)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                      selectedPlatform === plt
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {plt === 'all' ? 'Semua' : plt}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400">Sentimen:</span>
                <select
                  value={selectedSentiment}
                  onChange={e => setSelectedSentiment(e.target.value)}
                  className="p-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="all">Semua Sentimen</option>
                  <option value="Kritis / Resah">Kritis / Resah</option>
                  <option value="Marah / Protes">Marah / Protes</option>
                  <option value="Netral">Netral</option>
                  <option value="Positif">Positif</option>
                </select>
              </div>
            </div>
          </div>

          {/* Signals Stream List */}
          <div className="space-y-3">
            {filteredSignals.map(sig => (
              <div
                key={sig.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {sig.platform}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{sig.location_tag}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-400">{sig.timestamp}</span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    sig.sentiment.includes('Protes') || sig.sentiment.includes('Marah')
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : sig.sentiment.includes('Kritis')
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {sig.sentiment} ({sig.growth_rate})
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                  {sig.content}
                </p>

                {/* Hashtags & Keywords */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {sig.keywords.map((kw, i) => (
                    <span key={i} className="text-[10px] text-gmni-red bg-red-50 px-2 py-0.5 rounded-full border border-red-100 font-medium">
                      {kw}
                    </span>
                  ))}
                </div>

                {/* Engagement Footprint */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-slate-400" />
                      {sig.engagement.likes.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="w-3.5 h-3.5 text-slate-400" />
                      {sig.engagement.shares.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      {sig.engagement.comments.toLocaleString()}
                    </span>
                  </div>

                  {sig.issue_id && (
                    <Link
                      href={`/ai-analyst?issue=${sig.issue_id}`}
                      className="text-xs font-semibold text-gmni-red hover:underline inline-flex items-center gap-1"
                    >
                      <span>Validasi Silang dengan AI</span>
                      <Sparkles className="w-3 h-3 text-amber-500" />
                    </Link>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Right Side: Trending Hashtags & Public Sentiment Cloud */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Top Hashtags Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Hash className="w-4 h-4 text-gmni-red" />
              <h3 className="text-sm font-bold text-slate-900">
                Hashtag & Topik Tren Percakapan
              </h3>
            </div>

            <div className="space-y-2.5">
              {topHashtags.map((ht, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-red-50/50 rounded-xl border border-slate-200/80 transition-all group"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-gmni-red">
                      {ht.tag}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {ht.count} total engagement
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                    {ht.trend}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sinyal Ingestion Architecture Info */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Arsitektur Sensor Ingestion
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Arsitektur siap menerima multi-channel feeds: API resmi, RSS agregator berita daerah, aduan posko kader, dan public feeds untuk analisis terpadu.
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Status Konektor:</span>
              <span className="text-emerald-400 font-mono font-bold">READY (5 Channel)</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
