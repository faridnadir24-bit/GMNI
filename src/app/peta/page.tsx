'use client';

import React, { useState } from 'react';
import { MapPin, Layers, Sparkles, Filter, ShieldCheck, ArrowRight } from 'lucide-react';
import IndonesiaMap from '@/components/map/IndonesiaMap';
import PurwakartaDistrictMap from '@/components/map/PurwakartaDistrictMap';
import { useApp } from '@/context/AppContext';

export default function PetaIsuPage() {
  const { issues } = useApp();
  const [activeTab, setActiveTab] = useState<'indonesia' | 'purwakarta'>('indonesia');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-gmni-red" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
              Peta Isu Geospasial Indonesia & Purwakarta
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visualisasi pemetaan isu berbasis teritori untuk mengarahkan lokus investigasi dan advokasi kader.
          </p>
        </div>

        {/* Level Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('indonesia')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'indonesia'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🇮🇩 Peta Nasional & Provinsi
          </button>

          <button
            onClick={() => setActiveTab('purwakarta')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'purwakarta'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔴 Fokus 17 Kecamatan Purwakarta
          </button>
        </div>
      </div>

      {/* Map Views */}
      <div className="space-y-8">
        {activeTab === 'indonesia' ? (
          <>
            <IndonesiaMap issues={issues} />
            <PurwakartaDistrictMap issues={issues} />
          </>
        ) : (
          <>
            <PurwakartaDistrictMap issues={issues} />
            <IndonesiaMap issues={issues} />
          </>
        )}
      </div>

    </div>
  );
}
