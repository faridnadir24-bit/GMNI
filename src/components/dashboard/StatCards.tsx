'use client';

import React from 'react';
import { Layers, Sparkles, TrendingUp, AlertTriangle, MapPin, ShieldAlert } from 'lucide-react';

interface StatCardsProps {
  totalIssues?: number;
  newIssues?: number;
  developingIssues?: number;
  priorityIssues?: number;
  purwakartaIssues?: number;
}

export default function StatCards({
  totalIssues = 127,
  newIssues = 18,
  developingIssues = 11,
  priorityIssues = 7,
  purwakartaIssues = 32,
}: StatCardsProps) {
  const stats = [
    {
      title: 'Total Isu Dipantau',
      value: totalIssues,
      change: '+14 bulan ini',
      icon: Layers,
      color: 'text-slate-900',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      description: 'Lokal Purwakarta, Jabar & Nasional',
    },
    {
      title: 'Isu Baru Terdeteksi',
      value: newIssues,
      change: '48 jam terakhir',
      icon: Sparkles,
      color: 'text-blue-600',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      description: 'Sinyal awal & rilis pers terkini',
    },
    {
      title: 'Sedang Berkembang',
      value: developingIssues,
      change: 'Eskalasi tinggi',
      icon: TrendingUp,
      color: 'text-amber-600',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      description: 'Perhatian publik meningkat',
    },
    {
      title: 'Prioritas Kajian',
      value: priorityIssues,
      change: 'Rekomendasi AI',
      icon: AlertTriangle,
      color: 'text-gmni-red',
      badgeColor: 'bg-red-50 text-gmni-red border-red-200 ring-1 ring-red-500/20',
      description: 'Kriteria advokasi mendesak',
    },
    {
      title: 'Fokus Purwakarta',
      value: purwakartaIssues,
      change: 'Basis Teritorial',
      icon: MapPin,
      color: 'text-emerald-700',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      description: 'Jatiluhur, Bungursari, Wanayasa, dll',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle hover:border-slate-300 hover:shadow-card-hover transition-all relative overflow-hidden group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-500 line-clamp-1">
                {stat.title}
              </span>
              <div className={`p-1.5 rounded-lg ${stat.badgeColor} shrink-0`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans ${stat.color}`}>
                {stat.value}
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                entri
              </span>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
              <span className="text-slate-500 font-medium truncate">
                {stat.description}
              </span>
              <span className="text-slate-400 shrink-0 font-mono">
                {stat.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
