'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, ShieldAlert } from 'lucide-react';
import { Issue } from '@/types';
import { computeRadarPurwakarta } from '@/lib/services/issue-priority';

interface PurwakartaDistrictMapProps {
  issues: Issue[];
}

export default function PurwakartaDistrictMap({ issues }: PurwakartaDistrictMapProps) {
  const districts = computeRadarPurwakarta(issues);
  const [activeKecamatan, setActiveKecamatan] = useState<string>(districts[0]?.name || 'Jatiluhur');

  const selectedDist = districts.find(d => d.name.toLowerCase() === activeKecamatan.toLowerCase()) || districts[0];

  return (
    <div className="bg-surface rounded-card border border-border shadow-subtle p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-ink-primary">
              Radar Purwakarta: Pemetaan 17 Kecamatan
            </h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-stone-100 text-primary border border-border rounded">
              Basis Teritorial GMNI
            </span>
          </div>
          <p className="text-xs text-ink-secondary mt-0.5">
            Kompilasi pemantauan isu teritorial di 17 kecamatan Kabupaten Purwakarta berbasis data aktual.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-stone-100 border border-border font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-primary" />
            17 Kecamatan Terpantau
          </span>
        </div>
      </div>

      {/* Grid of 17 Sub-districts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {districts.map(d => {
          const isSelected = activeKecamatan.toLowerCase() === d.name.toLowerCase();
          return (
            <button
              key={d.name}
              onClick={() => setActiveKecamatan(d.name)}
              className={`text-left p-2.5 rounded-btn border text-xs transition-all ${
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                  : 'bg-stone-50/60 hover:bg-stone-100/80 border-border text-ink-primary'
              }`}
            >
              <div className="flex items-center justify-between font-semibold truncate">
                <span className="truncate">{d.name}</span>
                {d.priorityCount > 0 && (
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ml-1 ${isSelected ? 'bg-amber-400' : 'bg-primary'}`} />
                )}
              </div>
              <div className="flex items-center justify-between text-[10px] mt-1 opacity-80">
                <span>{d.issuesCount} Isu</span>
                <span className="font-mono">{d.momentumGrowth}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Kecamatan Drilldown Box */}
      {selectedDist && (
        <div className="p-4 bg-stone-50 rounded-btn border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-bold text-ink-primary">
                Kecamatan {selectedDist.name}
              </h4>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                selectedDist.status === 'Kritis' ? 'bg-red-50 text-primary border-red-200' :
                selectedDist.status === 'Tinggi' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                Status: {selectedDist.status}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white text-ink-secondary border border-border">
                Dominan: {selectedDist.dominantCategory}
              </span>
            </div>
            
            <p className="text-xs text-ink-secondary">
              Isu Utama: <strong className="text-ink-primary">{selectedDist.topIssueTitle}</strong> ({selectedDist.issuesCount} isu terdata, {selectedDist.priorityCount} prioritas riset).
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Link
              href={selectedDist.topIssueSlug ? `/isu/${selectedDist.topIssueSlug}` : `/isu?search=${encodeURIComponent(selectedDist.name)}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-white hover:bg-stone-100 text-ink-primary border border-border text-xs font-semibold shadow-subtle transition-colors"
            >
              <span>Telusuri Teritorial {selectedDist.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
