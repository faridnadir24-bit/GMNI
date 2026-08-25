'use client';

import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import IndonesiaMap from '@/components/map/IndonesiaMap';
import PurwakartaDistrictMap from '@/components/map/PurwakartaDistrictMap';
import { useApp } from '@/context/AppContext';

export default function PetaIsuPage() {
  const { issues } = useApp();
  const [activeTab, setActiveTab] = useState<'purwakarta' | 'indonesia'>('purwakarta');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-primary">
            Peta Sebaran Isu Geospasial
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
            Visualisasi pemetaan isu berbasis teritori untuk mengarahkan lokus investigasi dan advokasi kader.
          </p>
        </div>

        {/* Level Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-surface border border-border rounded-btn">
          <button
            onClick={() => setActiveTab('purwakarta')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeTab === 'purwakarta'
                ? 'bg-ink-primary text-white font-semibold'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            Fokus 17 Kecamatan Purwakarta
          </button>

          <button
            onClick={() => setActiveTab('indonesia')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeTab === 'indonesia'
                ? 'bg-ink-primary text-white font-semibold'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            Peta Nasional & Provinsi
          </button>
        </div>
      </div>

      {/* Map Views */}
      <div className="space-y-8">
        {activeTab === 'purwakarta' ? (
          <>
            <PurwakartaDistrictMap issues={issues} />
            <IndonesiaMap issues={issues} />
          </>
        ) : (
          <>
            <IndonesiaMap issues={issues} />
            <PurwakartaDistrictMap issues={issues} />
          </>
        )}
      </div>

    </div>
  );
}
