'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface StatCardsProps {
  totalIssues?: number;
  newIssues?: number;
  developingIssues?: number;
  priorityIssues?: number;
  purwakartaIssues?: number;
}

export default function StatCards(props: StatCardsProps) {
  const { issues, isLoadingDb, dataStatus, syncStatus, lastSyncedTime, refreshDbData } = useApp();

  const total = props.totalIssues ?? (issues.length > 0 ? issues.length : (syncStatus?.total_issues ?? 0));
  const newCount = props.newIssues ?? issues.filter(i => {
    const diffHours = (Date.now() - new Date(i.first_detected_at || i.last_updated_at).getTime()) / (1000 * 60 * 60);
    return diffHours <= 24 || isNaN(diffHours);
  }).length;
  const developing = props.developingIssues ?? issues.filter(i => i.status === 'Developing').length;
  const priority = props.priorityIssues ?? issues.filter(i => (i.priority_score && i.priority_score >= 85) || i.priority_level === 'Tinggi' || i.impact_score >= 85).length;
  const purwakarta = props.purwakartaIssues ?? issues.filter(i => i.location.toLowerCase().includes('purwakarta')).length;

  const metrics = [
    { label: 'Isu Dipantau', value: total, note: 'Basis data aktif' },
    { label: 'Baru (24 Jam)', value: newCount, note: 'Deteksi terkini' },
    { label: 'Sedang Berkembang', value: developing, note: 'Eskalasi publik' },
    { label: 'Prioritas Kajian', value: priority, note: 'Rekomendasi riset', accent: true },
    { label: 'Fokus Purwakarta', value: purwakarta, note: 'Basis teritorial' },
  ];

  return (
    <div className="bg-surface border border-border rounded-card p-4 sm:p-5 shadow-subtle space-y-3">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border text-xs text-ink-secondary">
        <div className="flex items-center gap-2">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-ink-primary">
            Ringkasan Pantauan Isu
          </span>
          <span className={`w-1.5 h-1.5 rounded-full ${isLoadingDb ? 'bg-amber-500 animate-pulse' : dataStatus === 'error' ? 'bg-red-500' : 'bg-emerald-600'}`} />
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-ink-tertiary">
          <span>
            {isLoadingDb 
              ? 'Memuat pantauan isu...' 
              : dataStatus === 'error'
              ? 'Koneksi data tertunda'
              : (lastSyncedTime ? `Sinkronisasi: ${lastSyncedTime} WIB` : 'Pantauan Terhubung')}
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">
            {syncStatus ? `Sumber: ${syncStatus.active_feeds}` : 'Media Terverifikasi'}
          </span>
        </div>
      </div>

      {/* Error state alert */}
      {dataStatus === 'error' && issues.length === 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Data pantauan belum dapat dimuat dari server.</span>
          </div>
          <button 
            onClick={() => refreshDbData()}
            className="font-semibold underline hover:text-red-950 text-xs inline-flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Coba Lagi</span>
          </button>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-1 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {metrics.map((item, idx) => (
          <div key={idx} className={`${idx !== 0 ? 'sm:pl-4' : ''} pt-2 sm:pt-0 space-y-1`}>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-xl sm:text-2xl font-bold font-mono ${item.accent ? 'text-primary' : 'text-ink-primary'}`}>
                {isLoadingDb && issues.length === 0 ? '-' : item.value}
              </span>
              <span className="text-xs text-ink-secondary">isu</span>
            </div>
            <div className="text-xs font-medium text-ink-primary">
              {item.label}
            </div>
            <div className="text-[11px] text-ink-tertiary">
              {item.note}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
