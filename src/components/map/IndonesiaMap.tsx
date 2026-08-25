'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { Issue } from '@/types';
import LocationBadge from '@/components/ui/LocationBadge';
import StatusBadge from '@/components/ui/StatusBadge';

interface IndonesiaMapProps {
  issues: Issue[];
  onSelectRegion?: (region: string) => void;
}

type MapMode = 'count' | 'impact' | 'urgency' | 'momentum';

export default function IndonesiaMap({ issues, onSelectRegion }: IndonesiaMapProps) {
  const [selectedMode, setSelectedMode] = useState<MapMode>('count');
  const [activeRegion, setActiveRegion] = useState<string>('Purwakarta');

  const regionData = [
    { id: 'Purwakarta', name: 'Kabupaten Purwakarta', province: 'Jawa Barat', issuesCount: 32, avgImpact: 88, avgUrgency: 85, avgMomentum: 80, badge: 'Lokus Utama' },
    { id: 'Jawa Barat', name: 'Jawa Barat', province: 'Jawa Barat', issuesCount: 24, avgImpact: 80, avgUrgency: 78, avgMomentum: 72, badge: 'Regional' },
    { id: 'DKI Jakarta', name: 'DKI Jakarta', province: 'DKI Jakarta', issuesCount: 18, avgImpact: 78, avgUrgency: 72, avgMomentum: 68, badge: 'Pusat' },
    { id: 'Jawa Tengah', name: 'Jawa Tengah', province: 'Jawa Tengah', issuesCount: 12, avgImpact: 72, avgUrgency: 70, avgMomentum: 62, badge: 'Regional' },
    { id: 'Jawa Timur', name: 'Jawa Timur', province: 'Jawa Timur', issuesCount: 11, avgImpact: 74, avgUrgency: 69, avgMomentum: 60, badge: 'Regional' },
    { id: 'Sumatra', name: 'Sumatra', province: 'Sumatra', issuesCount: 14, avgImpact: 93, avgUrgency: 88, avgMomentum: 80, badge: 'Karhutla' },
    { id: 'Kalimantan', name: 'Kalimantan', province: 'Kalimantan', issuesCount: 9, avgImpact: 86, avgUrgency: 80, avgMomentum: 74, badge: 'Konsesi' },
    { id: 'Sulawesi', name: 'Sulawesi', province: 'Sulawesi', issuesCount: 6, avgImpact: 70, avgUrgency: 65, avgMomentum: 58, badge: 'Agraria' },
    { id: 'Bali & NTB', name: 'Bali & NTB', province: 'Kep. Nusa Tenggara', issuesCount: 5, avgImpact: 68, avgUrgency: 64, avgMomentum: 55, badge: 'Adat' },
    { id: 'NTT', name: 'Nusa Tenggara Timur', province: 'NTT', issuesCount: 7, avgImpact: 87, avgUrgency: 92, avgMomentum: 71, badge: 'Bencana' },
    { id: 'Papua', name: 'Papua', province: 'Papua', issuesCount: 5, avgImpact: 82, avgUrgency: 80, avgMomentum: 65, badge: 'Kesejahteraan' },
  ];

  const getMetricValue = (reg: typeof regionData[0]) => {
    switch (selectedMode) {
      case 'count':
        return `${reg.issuesCount} Isu`;
      case 'impact':
        return `Impact: ${reg.avgImpact}`;
      case 'urgency':
        return `Urgensi: ${reg.avgUrgency}`;
      case 'momentum':
        return `Momentum: ${reg.avgMomentum}`;
    }
  };

  const currentActive = regionData.find(r => r.id === activeRegion) || regionData[0];
  const relatedIssues = issues.filter(i => 
    i.location.toLowerCase().includes(activeRegion.toLowerCase()) || 
    i.province.toLowerCase().includes(activeRegion.toLowerCase())
  );

  return (
    <div className="bg-surface rounded-card border border-border shadow-subtle p-6 space-y-6">
      
      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-border pb-4">
        <div>
          <h3 className="text-base font-bold text-ink-primary">
            Peta Sebaran Isu Geospasial
          </h3>
          <p className="text-xs text-ink-secondary mt-0.5">
            Hierarki pemantauan wilayah dari Kabupaten Purwakarta hingga cakupan nasional.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 p-1 bg-stone-50 border border-border rounded-btn">
          {(['count', 'impact', 'urgency', 'momentum'] as MapMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                selectedMode === mode
                  ? 'bg-surface text-ink-primary font-semibold border border-border shadow-2xs'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              {mode === 'count' ? 'Jumlah' : mode === 'impact' ? 'Impact' : mode === 'urgency' ? 'Urgensi' : 'Momentum'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Region Buttons + Selected Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Region Buttons Grid */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary">
            Pilih Wilayah:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {regionData.map(reg => {
              const isSelected = activeRegion === reg.id;
              const isPurwakarta = reg.id === 'Purwakarta';

              return (
                <button
                  key={reg.id}
                  onClick={() => {
                    setActiveRegion(reg.id);
                    if (onSelectRegion) onSelectRegion(reg.id);
                  }}
                  className={`p-3 rounded-btn border text-left transition-colors flex flex-col justify-between h-20 ${
                    isSelected
                      ? 'bg-stone-100 border-ink-primary shadow-subtle'
                      : 'bg-surface border-border hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-bold leading-tight ${isPurwakarta ? 'text-primary' : 'text-ink-primary'}`}>
                      {reg.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-ink-tertiary">
                    <span>{getMetricValue(reg)}</span>
                    <span className="text-[10px] uppercase font-sans text-ink-secondary">{reg.badge}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Region Issues Summary */}
        <div className="lg:col-span-5 bg-stone-50/70 rounded-card p-5 border border-border space-y-4">
          <div className="space-y-1 border-b border-border pb-3">
            <span className="text-[10px] uppercase font-semibold text-ink-tertiary">Wilayah Terpilih</span>
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-ink-primary">{currentActive.name}</h4>
              <span className="text-xs font-mono font-semibold text-primary">{currentActive.issuesCount} Isu</span>
            </div>
            <p className="text-xs text-ink-secondary">
              Provinsi / Region: {currentActive.province}
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase text-ink-tertiary">
              Isu Utama di Wilayah Ini:
            </span>

            {relatedIssues.length === 0 ? (
              <p className="text-xs text-ink-tertiary italic">Tidak ada isu spesifik yang terdaftar pada database mock.</p>
            ) : (
              <div className="space-y-2">
                {relatedIssues.slice(0, 3).map(iss => (
                  <Link
                    key={iss.id}
                    href={`/isu/${iss.slug}`}
                    className="block p-2.5 bg-surface rounded-btn border border-border hover:border-stone-400 transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-ink-primary line-clamp-1">{iss.title}</span>
                      <StatusBadge status={iss.status} />
                    </div>
                    <div className="text-[11px] text-ink-secondary flex items-center justify-between">
                      <span>Impact: {iss.impact_score}/100</span>
                      <span className="text-primary font-medium flex items-center gap-0.5">
                        Lihat <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
