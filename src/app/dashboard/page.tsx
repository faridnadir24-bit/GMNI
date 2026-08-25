'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  MapPin, 
  Sparkles, 
  Radio, 
  ArrowRight, 
  TrendingUp, 
  ShieldAlert, 
  Filter, 
  CheckCircle2,
  FileText,
  Clock,
  Plus
} from 'lucide-react';
import StatCards from '@/components/dashboard/StatCards';
import PriorityBoard from '@/components/dashboard/PriorityBoard';
import { useApp } from '@/context/AppContext';
import { mockSignals } from '@/data/mockSignals';

export default function DashboardPage() {
  const { issues, role } = useApp();
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'purwakarta' | 'jabar' | 'nasional'>('all');

  const filteredIssues = issues.filter(issue => {
    if (selectedRegion === 'all') return true;
    if (selectedRegion === 'purwakarta') return issue.location.toLowerCase().includes('purwakarta');
    if (selectedRegion === 'jabar') return issue.province.toLowerCase().includes('jawa barat');
    if (selectedRegion === 'nasional') return issue.location.toLowerCase().includes('nasional');
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
              Pantauan Isu Hari Ini
            </h1>
            <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
              GMNI-INTEL
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pusat kendali pemantauan isu sosial-politik, sinyal publik, dan asistensi riset kebijakan.
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/ai-analyst"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gmni-red hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Issue Analyst</span>
          </Link>

          <Link
            href="/kajian"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Arsip Bahan Kajian</span>
          </Link>
        </div>
      </div>

      {/* 5 Core Stat Cards */}
      <StatCards
        totalIssues={127}
        newIssues={18}
        developingIssues={11}
        priorityIssues={7}
        purwakartaIssues={32}
      />

      {/* Regional Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-subtle">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400 px-2 uppercase">Lokus Wilayah:</span>
          
          <button
            onClick={() => setSelectedRegion('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              selectedRegion === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Semua Isu ({issues.length})
          </button>

          <button
            onClick={() => setSelectedRegion('purwakarta')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              selectedRegion === 'purwakarta'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-red-50 text-gmni-red border border-red-200 hover:bg-red-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>🔴 Purwakarta (Prioritas 1)</span>
          </button>

          <button
            onClick={() => setSelectedRegion('jabar')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              selectedRegion === 'jabar'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Jawa Barat (Prioritas 2)
          </button>

          <button
            onClick={() => setSelectedRegion('nasional')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              selectedRegion === 'nasional'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Nasional Indonesia (Prioritas 3)
          </button>
        </div>

        <Link
          href="/peta"
          className="text-xs font-semibold text-gmni-red hover:underline px-2 inline-flex items-center gap-1"
        >
          <span>Eksplorasi Peta Interaktif</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Issue Priority Board */}
      <PriorityBoard
        issues={filteredIssues}
        title={
          selectedRegion === 'purwakarta'
            ? 'Isu Strategis Kabupaten Purwakarta'
            : selectedRegion === 'jabar'
            ? 'Isu Regional Jawa Barat'
            : selectedRegion === 'nasional'
            ? 'Isu Strategis Nasional'
            : 'Isu yang Perlu Diperhatikan'
        }
        subtitle="Daftar isu yang dipantau sistem dengan skor dampak dan urgensi riset advokasi."
      />

      {/* Bottom Grid: Public Signal Feeds & AI Recommendation Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Live Public Signal Tracker */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-gmni-red" />
              <h3 className="text-sm font-bold text-slate-900">
                Sinyal Percakapan Publik Terkini
              </h3>
            </div>
            <Link href="/pantauan" className="text-xs font-semibold text-gmni-red hover:underline">
              Semua Sinyal ({mockSignals.length}) →
            </Link>
          </div>

          <div className="space-y-3">
            {mockSignals.slice(0, 3).map(sig => (
              <div
                key={sig.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{sig.platform}</span>
                    <span className="text-[10px] text-slate-400">•</span>
                    <span className="text-[10px] text-slate-500">{sig.location_tag}</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.2 rounded">
                    {sig.sentiment} ({sig.growth_rate})
                  </span>
                </div>

                <p className="text-slate-700 italic">
                  {sig.content}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {sig.keywords.map((kw, i) => (
                    <span key={i} className="text-[10px] text-red-700 bg-red-50 px-1.5 py-0.2 rounded border border-red-100">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-slate-400 italic">
            * Data media sosial merupakan sinyal percakapan publik dan tidak otomatis menjadi fakta terverifikasi.
          </div>
        </div>

        {/* Right Col: AI Research Spotlight & Quick Framework */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold tracking-tight">
                Rekomendasi Kajian Minggu Ini
              </h3>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
                ✓ REKOMENDASI TERTINGGI (SKOR 94)
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                Keamanan, Zonasi KJA & Perlindungan Petani Ikan Jatiluhur
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Isu telah diverifikasi oleh 24 sumber resmi dan rilis pers. Disarankan segera menyusun Position Paper untuk Komisi II DPRD Purwakarta.
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="font-bold text-red-400 text-[11px] uppercase tracking-wider">
                Framework Marhaenisme GMNI:
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-400">
                <li>Uji dampak regulasi terhadap kaum tani & nelayan gurem.</li>
                <li>Transparansi kepemilikan modal KJA non-lokal.</li>
                <li>Kedaulatan air nasional vs hak nafkah warga lokal.</li>
              </ul>
            </div>
          </div>

          <Link
            href="/ai-analyst?issue=issue-pwk-01"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gmni-red hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all shadow-md"
          >
            <span>Buka Analisis AI Isu Jatiluhur</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

    </div>
  );
}
