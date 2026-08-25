'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Layers, ArrowUpRight, Flame, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { Issue } from '@/types';

interface IndonesiaMapProps {
  issues: Issue[];
  onSelectRegion?: (region: string) => void;
}

type MapMode = 'count' | 'impact' | 'urgency' | 'momentum';

export default function IndonesiaMap({ issues, onSelectRegion }: IndonesiaMapProps) {
  const [selectedMode, setSelectedMode] = useState<MapMode>('count');
  const [activeRegion, setActiveRegion] = useState<string>('Purwakarta');

  const regionData = [
    { id: 'Purwakarta', name: 'Kab. Purwakarta (Prioritas 1)', province: 'Jawa Barat', issuesCount: 32, avgImpact: 88, avgUrgency: 85, avgMomentum: 80, badge: 'Lokus Utama' },
    { id: 'Jawa Barat', name: 'Jawa Barat (Prioritas 2)', province: 'Jawa Barat', issuesCount: 24, avgImpact: 80, avgUrgency: 78, avgMomentum: 72, badge: 'Regional' },
    { id: 'DKI Jakarta', name: 'DKI Jakarta', province: 'DKI Jakarta', issuesCount: 18, avgImpact: 78, avgUrgency: 72, avgMomentum: 68, badge: 'Pusat Kebijakan' },
    { id: 'Jawa Tengah', name: 'Jawa Tengah', province: 'Jawa Tengah', issuesCount: 12, avgImpact: 72, avgUrgency: 70, avgMomentum: 62, badge: 'Regional' },
    { id: 'Jawa Timur', name: 'Jawa Timur', province: 'Jawa Timur', issuesCount: 11, avgImpact: 74, avgUrgency: 69, avgMomentum: 60, badge: 'Regional' },
    { id: 'Sumatra', name: 'Sumatra (Riau / Jambi / Sumsel)', province: 'Sumatra', issuesCount: 14, avgImpact: 93, avgUrgency: 88, avgMomentum: 80, badge: 'Karhutla' },
    { id: 'Kalimantan', name: 'Kalimantan (Kalbar / Kaltim)', province: 'Kalimantan', issuesCount: 9, avgImpact: 86, avgUrgency: 80, avgMomentum: 74, badge: 'Konsesi & Hutan' },
    { id: 'Sulawesi', name: 'Sulawesi', province: 'Sulawesi', issuesCount: 6, avgImpact: 70, avgUrgency: 65, avgMomentum: 58, badge: 'Agraria & Tambang' },
    { id: 'Bali & NTB', name: 'Bali & NTB', province: 'Kepulauan Nusa Tenggara', issuesCount: 5, avgImpact: 68, avgUrgency: 64, avgMomentum: 55, badge: 'Pariwisata & Adat' },
    { id: 'NTT', name: 'Nusa Tenggara Timur (Flores)', province: 'NTT', issuesCount: 7, avgImpact: 87, avgUrgency: 92, avgMomentum: 71, badge: 'Bencana Gempa' },
    { id: 'Papua', name: 'Papua', province: 'Papua', issuesCount: 5, avgImpact: 82, avgUrgency: 80, avgMomentum: 65, badge: 'HAM & Kesejahteraan' },
  ];

  const getMetricValue = (reg: typeof regionData[0]) => {
    switch (selectedMode) {
      case 'count':
        return `${reg.issuesCount} Isu`;
      case 'impact':
        return `Impact: ${reg.avgImpact}/100`;
      case 'urgency':
        return `Urgensi: ${reg.avgUrgency}/100`;
      case 'momentum':
        return `Momentum: ${reg.avgMomentum}/100`;
    }
  };

  const getIntensityColor = (reg: typeof regionData[0]) => {
    if (reg.id === 'Purwakarta') return 'bg-red-600 text-white border-red-700 shadow-md ring-2 ring-red-400/50';
    if (reg.avgImpact >= 85 || reg.issuesCount >= 20) return 'bg-red-500 text-white border-red-600';
    if (reg.avgImpact >= 75 || reg.issuesCount >= 10) return 'bg-amber-500 text-white border-amber-600';
    return 'bg-slate-700 text-white border-slate-800';
  };

  const currentActive = regionData.find(r => r.id === activeRegion) || regionData[0];
  const relatedIssues = issues.filter(i => 
    i.location.toLowerCase().includes(activeRegion.toLowerCase()) || 
    i.province.toLowerCase().includes(activeRegion.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 sm:p-6 space-y-6">
      
      {/* Header & Mode Switchers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gmni-red" />
            <h3 className="text-base font-bold text-slate-900 font-sans">
              Peta Sebaran Isu Sosial-Politik Nusantara
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Hierarki pemantauan berbasis geospasial dari basis Purwakarta hingga cakupan nasional.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <span className="text-[10px] font-bold text-slate-400 px-2 uppercase">Mode:</span>
          {(['count', 'impact', 'urgency', 'momentum'] as MapMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedMode === mode
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {mode === 'count' ? 'Jumlah Isu' : mode === 'impact' ? 'Impact Score' : mode === 'urgency' ? 'Urgensi' : 'Momentum'}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Region Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Map Grid / Regional Nodes */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Klik Wilayah untuk Membuka Detail Isu:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {regionData.map(reg => {
              const isSelected = activeRegion === reg.id;
              return (
                <button
                  key={reg.id}
                  onClick={() => {
                    setActiveRegion(reg.id);
                    if (onSelectRegion) onSelectRegion(reg.id);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between h-24 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-red-500 shadow-md'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold line-clamp-1">
                      {reg.id}
                    </span>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                      isSelected ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {reg.badge}
                    </span>
                  </div>

                  <div>
                    <div className={`text-xs font-extrabold font-mono ${
                      isSelected ? 'text-red-400' : 'text-gmni-red'
                    }`}>
                      {getMetricValue(reg)}
                    </div>
                    <div className={`text-[10px] truncate ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                      {reg.province}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Region Detailed Drawer */}
        <div className="lg:col-span-5 bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Laporan Wilayah Terpilih
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  {currentActive.name}
                </h4>
                <p className="text-xs text-slate-500">
                  {currentActive.province}
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-white text-slate-800 border px-2 py-1 rounded">
                {currentActive.issuesCount} Isu
              </span>
            </div>

            {/* Region Stats */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Rata-rata Dampak</span>
                <span className="font-bold text-red-700 font-mono">{currentActive.avgImpact}/100</span>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Tingkat Urgensi</span>
                <span className="font-bold text-amber-700 font-mono">{currentActive.avgUrgency}/100</span>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Dinamika Momentum</span>
                <span className="font-bold text-slate-800 font-mono">{currentActive.avgMomentum}/100</span>
              </div>
            </div>

            {/* Issues in this region */}
            <div className="space-y-2 pt-2">
              <div className="text-[11px] font-bold text-slate-700">
                Isu Kunci di {currentActive.id}:
              </div>
              {relatedIssues.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  Data detail isu sedang dalam proses sinkronisasi tim intelijen.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {relatedIssues.slice(0, 3).map(iss => (
                    <Link
                      key={iss.id}
                      href={`/isu/${iss.slug}`}
                      className="block p-2.5 bg-white rounded-lg border border-slate-200 hover:border-gmni-red transition-all group"
                    >
                      <div className="text-xs font-semibold text-slate-900 group-hover:text-gmni-red line-clamp-1">
                        {iss.title}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                        <span>{iss.category}</span>
                        <span>•</span>
                        <span className="text-red-600 font-bold font-mono">Impact: {iss.impact_score}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <Link
              href={`/isu?location=${currentActive.id.toLowerCase()}`}
              className="text-xs font-semibold text-gmni-red hover:underline inline-flex items-center gap-1"
            >
              <span>Filter Semua Isu {currentActive.id}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
