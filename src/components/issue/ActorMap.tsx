'use client';

import React, { useState } from 'react';
import { Users, Building2, Shield, UserCheck, AlertCircle, Quote, ArrowRightLeft } from 'lucide-react';
import { Actor } from '@/types';

interface ActorMapProps {
  actors: Actor[];
}

export default function ActorMap({ actors }: ActorMapProps) {
  const [selectedActor, setSelectedActor] = useState<Actor | null>(actors[0] || null);

  const getStanceBadge = (stance: Actor['stance']) => {
    switch (stance) {
      case 'Proaktif':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Kritis':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'Reaktif':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Terdampak':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-800" />
            <h3 className="text-base font-bold text-slate-900 font-sans">
              Peta Aktor & Relasi Pemangku Kepentingan
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visualisasi posisi kelembagaan, kepentingan, dan dinamika sikap para pihak yang terlibat.
          </p>
        </div>
        <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200">
          {actors.length} Entitas
        </span>
      </div>

      {/* Network Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Side: Actor Nodes List */}
        <div className="md:col-span-6 space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Pilih Aktor untuk Melihat Detail Sikap:
          </div>
          <div className="space-y-2">
            {actors.map(actor => {
              const isSelected = selectedActor?.id === actor.id;
              return (
                <div
                  key={actor.id}
                  onClick={() => setSelectedActor(actor)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-red-50/60 border-gmni-red ring-1 ring-gmni-red shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected
                        ? 'bg-gmni-red text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {actor.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {actor.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {actor.organization}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getStanceBadge(actor.stance)}`}>
                      {actor.stance}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Selected Actor Detail Inspector */}
        <div className="md:col-span-6 bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col justify-between space-y-4">
          {selectedActor ? (
            <>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Profil & Sikap Kelembagaan
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                      {selectedActor.name}
                    </h4>
                    <p className="text-xs text-gmni-red font-semibold">
                      {selectedActor.organization}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStanceBadge(selectedActor.stance)}`}>
                    Posisi: {selectedActor.stance}
                  </span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200/80 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Peran dalam Isu:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{selectedActor.role}</p>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium">Tingkat Pengaruh Kebijakan:</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{selectedActor.influence_level}</p>
                  </div>
                </div>

                {/* Statement Quote */}
                <div className="p-3.5 bg-white rounded-lg border border-slate-200 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                    <Quote className="w-3.5 h-3.5 text-slate-400" />
                    <span>Pernyataan Terbuka / Posisi Sikap:</span>
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    {selectedActor.statement}
                  </p>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-200 flex items-center justify-between">
                <span>Relasi kuasa tercatat dalam database</span>
                <span className="font-mono">ID: {selectedActor.id}</span>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-xs text-slate-400">
              Pilih salah satu aktor untuk melihat profil hubungan.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
