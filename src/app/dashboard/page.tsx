'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  FileText, 
  Radio, 
  ArrowRight,
  BookmarkCheck
} from 'lucide-react';
import StatCards from '@/components/dashboard/StatCards';
import PriorityBoard from '@/components/dashboard/PriorityBoard';
import UnviralPrioritySection from '@/components/dashboard/UnviralPrioritySection';
import EmergingIssuesSection from '@/components/dashboard/EmergingIssuesSection';
import FastChangingIssuesSection from '@/components/dashboard/FastChangingIssuesSection';
import TerritorySelector, { TerritoryScope } from '@/components/ui/TerritorySelector';
import LocationBadge from '@/components/ui/LocationBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import { useApp } from '@/context/AppContext';

export default function DashboardPage() {
  const { issues, articles, syncLiveNews, isSyncingNews } = useApp();
  const [selectedTerritory, setSelectedTerritory] = useState<TerritoryScope>('purwakarta');
  const [selectedSubTerritory, setSelectedSubTerritory] = useState<string>('Semua Kecamatan');

  const filteredIssues = issues.filter(issue => {
    if (selectedTerritory === 'purwakarta') {
      const matchTerritory = issue.location.toLowerCase().includes('purwakarta');
      if (!matchTerritory) return false;
      if (selectedSubTerritory && selectedSubTerritory !== 'Semua Kecamatan') {
        return issue.district?.toLowerCase().includes(selectedSubTerritory.toLowerCase());
      }
      return true;
    }
    if (selectedTerritory === 'jabar') {
      return issue.province.toLowerCase().includes('jawa barat');
    }
    if (selectedTerritory === 'nasional') {
      return issue.location.toLowerCase().includes('nasional');
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-primary">
            Pantauan Isu Hari Ini
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
            Pusat pemantauan dinamika isu sosial-politik, rujukan sumber, dan persiapan bahan kajian.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => syncLiveNews()}
            disabled={isSyncingNews}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-btn border transition-all ${
              isSyncingNews
                ? 'bg-muted text-ink-secondary border-border cursor-not-allowed'
                : 'bg-primary text-white border-primary hover:bg-[#8F0D15] active:scale-95 shadow-subtle'
            }`}
            title="Tarik berita real-time langsung dari RSS media daerah & nasional"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isSyncingNews ? 'animate-spin' : ''}`} />
            <span>{isSyncingNews ? 'Menarik Berita...' : 'Tarik Berita Terbaru'}</span>
          </button>

          <Link
            href="/ai-analyst"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-ink-primary hover:bg-black text-white text-xs font-semibold rounded-btn transition-colors"
          >
            <span>AI Analyst</span>
          </Link>

          <Link
            href="/kajian"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-surface hover:bg-muted text-ink-primary text-xs font-medium rounded-btn border border-border transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-ink-secondary" />
            <span>Bahan Kajian</span>
          </Link>
        </div>
      </div>

      {/* ROW 1: Territory Selector */}
      <TerritorySelector
        selectedScope={selectedTerritory}
        onSelectScope={setSelectedTerritory}
        selectedSubScope={selectedSubTerritory}
        onSelectSubScope={setSelectedSubTerritory}
      />

      {/* ROW 2: Summary Metrics Strip */}
      <StatCards />

      {/* ROW 3: Emerging Issues (< 24h) & Fast Changing Issues */}
      <EmergingIssuesSection issues={filteredIssues} />
      <FastChangingIssuesSection issues={filteredIssues} />

      {/* ROW 4: Isu yang Patut Diperhatikan (Belum Viral · Dampak Tinggi) */}
      <UnviralPrioritySection issues={filteredIssues} />

      {/* ROW 5: Main Issue List + Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main: Priority Issues Board */}
        <div className="lg:col-span-8 space-y-6">
          <PriorityBoard
            issues={filteredIssues}
            title={`Isu Prioritas · ${selectedTerritory === 'purwakarta' ? 'Purwakarta' : selectedTerritory === 'jabar' ? 'Jawa Barat' : 'Nasional'}`}
            subtitle={`Menampilkan ${filteredIssues.length} isu terpantau pada wilayah yang dipilih.`}
          />
        </div>

        {/* Side: Sinyal Publik & Aktivitas Terbaru */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Public Signal Stream / Live News Stream */}
          <div className="bg-surface rounded-card border border-border p-5 space-y-4 shadow-subtle">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-ink-secondary" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-primary">
                  Arus Berita Terverifikasi
                </h3>
              </div>
              <Link href="/pantauan" className="text-xs text-primary hover:underline font-medium">
                Semua
              </Link>
            </div>

            <div className="space-y-3">
              {articles.length > 0 ? (
                articles.slice(0, 3).map(art => (
                  <div
                    key={art.id}
                    className="p-3 bg-stone-50/70 rounded-btn border border-border/70 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-ink-primary">{art.source_name}</span>
                      <span className="text-ink-tertiary">{art.location || 'Nasional'}</span>
                    </div>

                    <p className="text-ink-secondary leading-snug font-medium line-clamp-2">
                      {art.title}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-ink-tertiary pt-0.5">
                      <span>Kategori: {art.category || 'Umum'}</span>
                      <span className="font-mono text-emerald-700 font-medium">Terverifikasi</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-ink-tertiary">
                  Belum ada berita terindeks.
                </div>
              )}
            </div>

            <p className="text-[11px] text-ink-tertiary italic pt-1">
              Data ditarik secara berkala dari portal berita daerah & nasional terpercaya.
            </p>
          </div>

          {/* Research Recommendation Side Box */}
          <div className="bg-surface rounded-card border border-border p-5 space-y-3 shadow-subtle">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-primary">
              Rekomendasi Riset Minggu Ini
            </h3>
            
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-ink-primary">
                Penataan Zonasi KJA & Obvitnas Jatiluhur
              </div>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Telah memenuhi kriteria ketersediaan data primer dan urgensi advokasi nelayan lokal.
              </p>
            </div>

            <Link
              href="/ai-analyst?issue=issue-pwk-01"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline pt-1"
            >
              <span>Buka Analisis Isu Jatiluhur</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
