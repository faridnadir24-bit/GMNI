'use client';

import React from 'react';
import { MapPin } from 'lucide-react';

export type TerritoryScope = 'purwakarta' | 'jabar' | 'nasional';

interface TerritorySelectorProps {
  selectedScope: TerritoryScope;
  onSelectScope: (scope: TerritoryScope) => void;
  selectedSubScope?: string;
  onSelectSubScope?: (subScope: string) => void;
  className?: string;
}

export default function TerritorySelector({
  selectedScope = 'purwakarta',
  onSelectScope,
  selectedSubScope,
  onSelectSubScope,
  className = '',
}: TerritorySelectorProps) {
  const primaryTerritories: { id: TerritoryScope; label: string; count: number }[] = [
    { id: 'purwakarta', label: 'Purwakarta', count: 32 },
    { id: 'jabar', label: 'Jawa Barat', count: 24 },
    { id: 'nasional', label: 'Nasional', count: 71 },
  ];

  const subTerritories: Record<TerritoryScope, string[]> = {
    purwakarta: [
      'Semua Kecamatan',
      'Jatiluhur',
      'Bungursari',
      'Wanayasa',
      'Purwakarta Kota',
      'Campaka',
      'Babakancikao',
      'Maniis',
      'Plered',
      'Sukatani',
    ],
    jabar: [
      'Semua Daerah',
      'Kabupaten Purwakarta',
      'Kabupaten Karawang',
      'Kabupaten Subang',
      'Kota Bandung',
      'Kabupaten Bekasi',
    ],
    nasional: [
      'Seluruh Indonesia',
      'Jawa & Bali',
      'Sumatra',
      'Kalimantan',
      'Nusa Tenggara (NTT)',
      'Sulawesi',
      'Papua',
    ],
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Top Level Territory Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-ink-secondary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
            Wilayah Pemantauan
          </span>
        </div>

        {/* Segmented Control */}
        <div className="flex items-center gap-1.5 p-1 bg-surface border border-border rounded-btn overflow-x-auto">
          {primaryTerritories.map(item => {
            const isActive = selectedScope === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectScope(item.id);
                  if (onSelectSubScope) onSelectSubScope(subTerritories[item.id][0]);
                }}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors shrink-0 ${
                  isActive
                    ? 'bg-ink-primary text-white font-semibold'
                    : 'bg-transparent text-ink-secondary hover:bg-muted border border-transparent'
                }`}
              >
                <span>{item.label}</span>
                <span className={`ml-1.5 text-[11px] ${isActive ? 'text-stone-300' : 'text-ink-tertiary'}`}>
                  ({item.count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-level Horizontal Pills */}
      {onSelectSubScope && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] text-ink-tertiary font-medium shrink-0 mr-1">
            {selectedScope === 'purwakarta' ? 'Kecamatan:' : selectedScope === 'jabar' ? 'Daerah:' : 'Wilayah:'}
          </span>
          {subTerritories[selectedScope].map(sub => {
            const isSubActive = selectedSubScope === sub || (!selectedSubScope && sub === subTerritories[selectedScope][0]);
            return (
              <button
                key={sub}
                onClick={() => onSelectSubScope(sub)}
                className={`px-2.5 py-1 rounded text-xs transition-colors shrink-0 ${
                  isSubActive
                    ? 'bg-stone-200 text-ink-primary font-semibold'
                    : 'bg-muted/80 text-ink-secondary hover:bg-muted hover:text-ink-primary'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
