'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  X, 
  BookOpen, 
  ShieldCheck, 
  User, 
  Sparkles, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function CommandSearch() {
  const router = useRouter();
  const { isSearchOpen, setIsSearchOpen, issues, claims, sources } = useApp();
  const [query, setQuery] = useState('');

  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      return {
        issues: issues.slice(0, 4),
        claims: claims.slice(0, 3),
        sources: sources.slice(0, 2),
      };
    }

    const q = query.toLowerCase();
    return {
      issues: issues.filter(
        i =>
          i.title.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      ),
      claims: claims.filter(
        c =>
          c.content.toLowerCase().includes(q) ||
          c.source_name.toLowerCase().includes(q)
      ),
      sources: sources.filter(
        s =>
          s.title.toLowerCase().includes(q) ||
          s.source_name.toLowerCase().includes(q)
      ),
    };
  }, [query, issues, claims, sources]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cari isu sosial-politik, kata kunci fakta, nama aktor, sumber..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          
          {/* Issue Section */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2 flex items-center justify-between">
              <span>Isu Terpantau ({filteredResults.issues.length})</span>
              <span className="text-[10px] text-slate-400">Pilih untuk analisa detail</span>
            </div>
            {filteredResults.issues.length === 0 ? (
              <p className="text-xs text-slate-400 italic px-2 py-1">Tidak ada isu yang cocok.</p>
            ) : (
              <div className="space-y-1.5">
                {filteredResults.issues.map(issue => (
                  <button
                    key={issue.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      router.push(`/isu/${issue.slug}`);
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-red-50/60 transition-all flex items-center justify-between group border border-transparent hover:border-red-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-red-100 group-hover:text-gmni-red transition-colors shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900 group-hover:text-gmni-red transition-colors line-clamp-1">
                          {issue.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                          <span className="text-gmni-red font-medium">{issue.location}</span>
                          <span>•</span>
                          <span>{issue.category}</span>
                          <span>•</span>
                          <span className="font-mono text-[10px]">Impact: {issue.impact_score}/100</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-gmni-red group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Claims / Facts Section */}
          {filteredResults.claims.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
                Fakta & Klaim Terverifikasi ({filteredResults.claims.length})
              </div>
              <div className="space-y-1.5">
                {filteredResults.claims.map(claim => (
                  <div
                    key={claim.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        claim.type === 'fact' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : claim.type === 'claim'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {claim.type === 'fact' ? '✅ Terkonfirmasi' : claim.type === 'claim' ? '⚠️ Klaim' : '❓ Belum Terverifikasi'}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Sumber: {claim.source_name}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-snug">{claim.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick AI Analyst Jump */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-3 rounded-xl border border-red-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-red-600 text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Jalankan AI Issue Analyst</p>
                <p className="text-[11px] text-slate-600">Ringkas isu, temukan kontradiksi, & buat draf bahan kajian.</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsSearchOpen(false);
                router.push('/ai-analyst');
              }}
              className="px-3 py-1.5 text-xs font-semibold bg-gmni-red text-white hover:bg-red-700 rounded-lg shadow-xs transition-colors shrink-0"
            >
              Buka AI
            </button>
          </div>

        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>Tekan <kbd className="px-1 py-0.5 bg-white border rounded font-mono text-[10px]">Esc</kbd> untuk menutup</span>
          </div>
          <span className="font-mono text-[10px]">Ruang Isu Search Engine</span>
        </div>
      </div>
    </div>
  );
}
