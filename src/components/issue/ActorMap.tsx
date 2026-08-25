'use client';

import React, { useState } from 'react';
import { Quote } from 'lucide-react';
import { Actor } from '@/types';

interface ActorMapProps {
  actors: Actor[];
}

export default function ActorMap({ actors }: ActorMapProps) {
  const [selectedActor, setSelectedActor] = useState<Actor | null>(actors[0] || null);

  return (
    <div className="bg-surface rounded-card border border-border p-6 space-y-6 shadow-subtle">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border pb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-ink-primary">
            Pemetaan Aktor & Pemangku Kepentingan
          </h3>
          <p className="text-xs text-ink-secondary mt-0.5">
            Analisis posisi kelembagaan, kepentingan, dan sikap para pihak terkait.
          </p>
        </div>
        <span className="text-xs font-mono text-ink-tertiary">
          {actors.length} Pihak Terlibat
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left: Actors List */}
        <div className="md:col-span-6 space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary mb-1">
            Daftar Aktor Kunci:
          </div>
          <div className="space-y-1.5">
            {actors.map(actor => {
              const isSelected = selectedActor?.id === actor.id;
              return (
                <div
                  key={actor.id}
                  onClick={() => setSelectedActor(actor)}
                  className={`p-3 rounded-btn border cursor-pointer transition-colors flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-stone-50 border-ink-primary shadow-subtle'
                      : 'bg-surface border-border hover:bg-stone-50/60'
                  }`}
                >
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-ink-primary">{actor.name}</h4>
                    <p className="text-ink-secondary text-[11px]">{actor.organization}</p>
                  </div>

                  <span className="text-[11px] font-medium text-ink-secondary px-2 py-0.5 rounded bg-muted border border-border">
                    {actor.stance}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Actor Details */}
        <div className="md:col-span-6 bg-stone-50/70 rounded-card p-5 border border-border space-y-4">
          {selectedActor ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between border-b border-border/80 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-ink-tertiary">Profil Aktor</span>
                  <h4 className="text-sm font-bold text-ink-primary mt-0.5">{selectedActor.name}</h4>
                  <p className="text-xs font-medium text-primary">{selectedActor.organization}</p>
                </div>

                <span className="text-[11px] font-semibold text-ink-primary bg-surface px-2 py-1 rounded border border-border">
                  Sikap: {selectedActor.stance}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-ink-tertiary">Peran:</span>
                  <p className="font-medium text-ink-primary mt-0.5">{selectedActor.role}</p>
                </div>
                <div>
                  <span className="text-ink-tertiary">Tingkat Pengaruh:</span>
                  <p className="font-medium text-ink-primary mt-0.5">{selectedActor.influence_level}</p>
                </div>
              </div>

              {/* Quote Statement */}
              <div className="p-3 bg-surface rounded-btn border border-border text-xs text-ink-secondary space-y-1">
                <div className="text-[10px] font-semibold uppercase text-ink-tertiary flex items-center gap-1">
                  <Quote className="w-3 h-3" />
                  <span>Kutipan Sikap / Pernyataan:</span>
                </div>
                <p className="italic leading-relaxed">
                  {selectedActor.statement}
                </p>
              </div>
            </div>
          ) : null}
        </div>

      </div>

    </div>
  );
}
