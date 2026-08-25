'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

interface StatCardsProps {
  totalIssues?: number;
  newIssues?: number;
  developingIssues?: number;
  priorityIssues?: number;
  purwakartaIssues?: number;
}

export default function StatCards(props: StatCardsProps) {
  const { issues, isRealData } = useApp();

  const total = props.totalIssues ?? issues.length;
  const newCount = props.newIssues ?? issues.filter(i => {
    const diffHours = (Date.now() - new Date(i.first_detected_at).getTime()) / (1000 * 60 * 60);
    return diffHours <= 72 || isNaN(diffHours);
  }).length;
  const developing = props.developingIssues ?? issues.filter(i => i.status === 'Developing').length;
  const priority = props.priorityIssues ?? issues.filter(i => i.priority_level === 'Tinggi' || i.impact_score >= 85).length;
  const purwakarta = props.purwakartaIssues ?? issues.filter(i => i.location.toLowerCase().includes('purwakarta')).length;

  const metrics = [
    { label: 'Isu Dipantau', value: total, note: 'Agustus 2026' },
    { label: 'Terdeteksi Baru', value: newCount, note: 'Pantauan terbaru' },
    { label: 'Sedang Berkembang', value: developing, note: 'Eskalasi publik' },
    { label: 'Prioritas Kajian', value: priority, note: 'Rekomendasi riset', accent: true },
    { label: 'Fokus Purwakarta', value: purwakarta, note: 'Basis teritorial' },
  ];

  return (
    <div className="bg-surface border border-border rounded-card p-4 sm:p-5 shadow-subtle">
      <div className="flex items-center justify-between pb-3 border-b border-border text-xs text-ink-secondary">
        <span className="font-semibold uppercase tracking-wider text-[11px] text-ink-primary">
          Ringkasan Pantauan
        </span>
        <span className="font-mono text-[11px] text-ink-tertiary">
          {isRealData ? 'Terhubung Database' : 'Pantauan Terbaru'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-3.5 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {metrics.map((item, idx) => (
          <div key={idx} className={`${idx !== 0 ? 'sm:pl-4' : ''} pt-2 sm:pt-0 space-y-1`}>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-xl sm:text-2xl font-bold font-mono ${item.accent ? 'text-primary' : 'text-ink-primary'}`}>
                {item.value}
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
