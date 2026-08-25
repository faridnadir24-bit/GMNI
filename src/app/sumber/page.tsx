'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Building2, 
  Newspaper, 
  Radio, 
  FileText, 
  ExternalLink, 
  Search, 
  Filter, 
  Info,
  Award,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SourceType } from '@/types';
import { formatDateIndo } from '@/lib/utils';

export default function SumberPage() {
  const { sources } = useApp();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const credibilityTiers = [
    { type: 'Official Source', label: 'Sumber Resmi / Lembaga Negara', score: '95/100', icon: Building2, color: 'text-blue-700 bg-blue-50 border-blue-200', desc: 'Pemerintah, BUMN, BNPB, BMKG, BPS, Polri, DPR, Perda, Putusan Pengadilan' },
    { type: 'Established Media', label: 'Media Nasional Kredibel', score: '85/100', icon: Newspaper, color: 'text-emerald-700 bg-emerald-50 border-emerald-200', desc: 'Media arus utama nasional terverifikasi Dewan Pers dengan kode etik jurnalistik ketat' },
    { type: 'Local Media', label: 'Media Lokal & Regional', score: '75/100', icon: FileText, color: 'text-purple-700 bg-purple-50 border-purple-200', desc: 'Media massa lokal Purwakarta & Jawa Barat yang meliput dinamika akar rumput' },
    { type: 'Public Signal', label: 'Sinyal Publik & Komunitas', score: '50/100', icon: Radio, color: 'text-amber-700 bg-amber-50 border-amber-200', desc: 'Forum warga, aduan langsung ke posko kader, laporan komunitas desa' },
    { type: 'Social Media', label: 'Media Sosial (Early Signal)', score: '45/100', icon: Radio, color: 'text-slate-700 bg-slate-100 border-slate-200', desc: 'Instagram, TikTok, X, YouTube — indikator atensi publik awal, wajib validasi silang' },
  ];

  const filteredSources = sources.filter(s => {
    if (selectedType !== 'all' && s.source_type !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = s.title.toLowerCase().includes(q) ||
                    s.source_name.toLowerCase().includes(q) ||
                    s.summary.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
              Registri Sumber Data & Sistem Kredibilitas
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
              {sources.length} Sumber Terdata
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Standar kurasi data, metodologi pembobotan reliabilitas rujukan, dan transparansi rilis informasi.
          </p>
        </div>
      </div>

      {/* Internal Credibility Disclaimer */}
      <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-start gap-3 shadow-md">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-300 leading-relaxed">
          <h4 className="font-bold text-white">
            Catatan Prinsip Metodologi Kredibilitas:
          </h4>
          <p>
            Skor kredibilitas merupakan <span className="text-amber-300 font-semibold italic">indikator internal sistem</span> yang dirancang untuk mengukur tingkat verifikasi dokumen, bukan kebenaran absolut. Informasi dari media sosial diperlakukan sebagai <span className="font-semibold text-white">sinyal awal / early signal</span> dan tidak otomatis dianggap sebagai fakta terkonfirmasi sampai divalidasi silang.
          </p>
        </div>
      </div>

      {/* Credibility Tiers Matrix */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Standar Klasifikasi Reliabilitas:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {credibilityTiers.map((tier, idx) => {
            const Icon = tier.icon;
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${tier.color} space-y-2 shadow-2xs`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-bold text-slate-900">{tier.label}</span>
                  </div>
                  <span className="text-xs font-extrabold font-mono px-2 py-0.5 rounded bg-white border shadow-2xs">
                    {tier.score}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {tier.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sources Search & Table List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 sm:p-6 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari rujukan sumber data atau instansi..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-slate-400">Tipe:</span>
            {['all', 'Official Source', 'Established Media', 'Local Media', 'Social Media'].map(t => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedType === t
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t === 'all' ? 'Semua' : t}
              </button>
            ))}
          </div>
        </div>

        {/* Source Cards */}
        <div className="space-y-3">
          {filteredSources.map(s => (
            <div
              key={s.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50 transition-all space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{s.source_name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {s.source_type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Reliabilitas: {s.credibility_score}/100
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatDateIndo(s.published_at)}
                  </span>
                </div>
              </div>

              <h4 className="text-xs sm:text-sm font-semibold text-slate-900">
                {s.title}
              </h4>

              <p className="text-xs text-slate-600 leading-relaxed">
                {s.summary}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">
                  Penyusun: <strong className="text-slate-700">{s.author_or_institution}</strong>
                </span>

                {s.url && s.url !== '#' && (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gmni-red hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    <span>Tautan Dokumen</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
