'use client';

import React from 'react';
import { MapPin, Globe, Compass, Navigation } from 'lucide-react';
import { WEST_JAVA_REGENCIES, PURWAKARTA_DISTRICTS, TerritoryScope } from '@/lib/services/territory-service';

export type { TerritoryScope };

interface TerritorySelectorProps {
  selectedScope: TerritoryScope;
  onSelectScope: (scope: TerritoryScope) => void;
  selectedSubScope?: string;
  onSelectSubScope?: (subScope: string) => void;
  counts?: {
    purwakarta?: number;
    jabar?: number;
    nasional?: number;
  };
  coverageSummary?: string;
  className?: string;
}

export default function TerritorySelector({
  selectedScope = 'purwakarta',
  onSelectScope,
  selectedSubScope,
  onSelectSubScope,
  counts = {},
  coverageSummary,
  className = '',
}: TerritorySelectorProps) {
  const primaryTerritories: { id: TerritoryScope; label: string; icon: any; count?: number }[] = [
    { id: 'purwakarta', label: 'Purwakarta', icon: MapPin, count: counts.purwakarta },
    { id: 'jabar', label: 'Jawa Barat (27 Kab/Kota)', icon: Compass, count: counts.jabar },
    { id: 'nasional', label: 'Nasional (38 Provinsi)', icon: Globe, count: counts.nasional },
  ];

  const subTerritories: Record<TerritoryScope, string[]> = {
    all: ['Semua Wilayah'],
    purwakarta: [
      'Semua Kecamatan',
      ...PURWAKARTA_DISTRICTS
    ],
    jabar: [
      'Semua Kabupaten / Kota',
      ...WEST_JAVA_REGENCIES.map(r => r.name)
    ],
    nasional: [
      'Seluruh Indonesia',
      'DKI Jakarta',
      'Jawa Barat',
      'Jawa Tengah',
      'Jawa Timur',
      'Banten',
      'Sumatra',
      'Kalimantan',
      'Sulawesi',
      'Bali & Nusa Tenggara',
      'Papua & Maluku'
    ],
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Top Level Territory Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-ink-primary">
            Cakupan Teritorial Pemantauan
          </span>
        </div>

        {/* Segmented Control */}
        <div className="flex items-center gap-1.5 p-1 bg-surface border border-border rounded-btn overflow-x-auto">
          {primaryTerritories.map(item => {
            const isActive = selectedScope === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectScope(item.id);
                  if (onSelectSubScope) onSelectSubScope(subTerritories[item.id][0]);
                }}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors shrink-0 inline-flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-ink-primary text-white font-semibold shadow-xs'
                    : 'bg-transparent text-ink-secondary hover:bg-stone-100 hover:text-ink-primary border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-ink-tertiary'}`} />
                <span>{item.label}</span>
                {typeof item.count === 'number' && (
                  <span className={`ml-1 text-[11px] font-mono ${isActive ? 'text-stone-300' : 'text-ink-tertiary'}`}>
                    ({item.count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-level Horizontal Pills */}
      {onSelectSubScope && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] text-ink-tertiary font-bold shrink-0 mr-1 uppercase tracking-wider">
            {selectedScope === 'purwakarta' ? 'Kecamatan:' : selectedScope === 'jabar' ? 'Daerah Jabar:' : 'Wilayah:'}
          </span>
          {subTerritories[selectedScope]?.map(sub => {
            const isSubActive = selectedSubScope === sub || (!selectedSubScope && sub === subTerritories[selectedScope][0]);
            return (
              <button
                key={sub}
                onClick={() => onSelectSubScope(sub)}
                className={`px-2.5 py-1 rounded text-xs transition-colors shrink-0 ${
                  isSubActive
                    ? 'bg-primary/10 text-primary font-bold border border-primary/30'
                    : 'bg-stone-100 text-ink-secondary hover:bg-stone-200/80 hover:text-ink-primary border border-border/50'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      )}

      {/* Honest Coverage Indicator Banner */}
      {coverageSummary && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-md bg-stone-100/90 border border-border/80 text-[11px] text-ink-secondary">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
            <span className="font-medium text-ink-primary">Indikator Cakupan Teritorial:</span>
            <span>{coverageSummary}</span>
          </div>
          <span className="text-ink-tertiary font-mono text-[10px] hidden sm:inline">
            Status Terhubung Basis Data
          </span>
        </div>
      )}
    </div>
  );
}
