'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  X, 
  BookOpen, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import LocationBadge from '@/components/ui/LocationBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import StatusBadge from '@/components/ui/StatusBadge';

export default function CommandSearch() {
  const router = useRouter();
  const { isSearchOpen, setIsSearchOpen, issues, claims, sources } = useApp();
  const [query, setQuery] = useState('');

  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      return {
        issues: issues.slice(0, 4),
        claims: claims.slice(0, 2),
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-ink-primary/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-surface rounded-card shadow-card border border-border overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-border bg-surface">
          <Search className="w-4 h-4 text-ink-tertiary mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cari judul isu, kategori, aktor, atau fakta..."
            className="w-full bg-transparent text-sm text-ink-primary placeholder:text-ink-tertiary focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-ink-tertiary hover:text-ink-primary rounded hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          
          {/* Issue Section */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary px-1 mb-2 flex items-center justify-between">
              <span>Isu Terpantau ({filteredResults.issues.length})</span>
            </div>
            {filteredResults.issues.length === 0 ? (
              <p className="text-xs text-ink-tertiary italic px-1 py-1">Tidak ada hasil yang cocok.</p>
            ) : (
              <div className="space-y-1">
                {filteredResults.issues.map(issue => (
                  <button
                    key={issue.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      router.push(`/isu/${issue.slug}`);
                    }}
                    className="w-full text-left p-2.5 rounded-btn hover:bg-muted/70 transition-colors flex items-center justify-between group border border-transparent hover:border-border"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <LocationBadge location={issue.location} district={issue.district} size="sm" />
                        <CategoryBadge category={issue.category} />
                        <StatusBadge status={issue.status} />
                      </div>
                      <h4 className="text-xs font-semibold text-ink-primary group-hover:text-primary transition-colors line-clamp-1">
                        {issue.title}
                      </h4>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-ink-tertiary group-hover:text-primary transition-colors shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Claims / Facts Section */}
          {filteredResults.claims.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary px-1 mb-2">
                Fakta & Temuan ({filteredResults.claims.length})
              </div>
              <div className="space-y-1.5">
                {filteredResults.claims.map(claim => (
                  <div
                    key={claim.id}
                    className="p-2.5 rounded-btn bg-muted/50 border border-border text-xs space-y-1"
                  >
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="font-semibold text-ink-secondary">
                        {claim.type === 'fact' ? 'Fakta Terkonfirmasi' : claim.type === 'claim' ? 'Klaim' : 'Belum Terverifikasi'}
                      </span>
                      <span className="text-ink-tertiary">·</span>
                      <span className="text-ink-secondary font-medium">
                        Sumber: {claim.source_name}
                      </span>
                    </div>
                    <p className="text-ink-primary leading-snug">{claim.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-muted/40 border-t border-border flex items-center justify-between text-[11px] text-ink-tertiary">
          <span>Tekan <kbd className="px-1.5 py-0.5 bg-surface border border-border rounded font-mono text-[10px]">Esc</kbd> untuk menutup</span>
          <span className="font-mono">Pencarian Internal</span>
        </div>
      </div>
    </div>
  );
}
