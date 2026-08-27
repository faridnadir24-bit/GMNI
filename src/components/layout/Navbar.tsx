'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  User, 
  ChevronDown, 
  ShieldCheck, 
  Check, 
  RefreshCw,
  Sparkles,
  Lock,
  Layers
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import { ROLE_CONFIGS } from '@/lib/services/permissions';

export default function Navbar() {
  const pathname = usePathname();
  const { 
    role, 
    setRole, 
    setIsSearchOpen, 
    setIsAuthModalOpen, 
    syncLiveNews, 
    isSyncingNews, 
    lastSyncedTime 
  } = useApp();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const handleSyncClick = async () => {
    if (isSyncingNews) return;
    const res = await syncLiveNews();
    setSyncToast(res.message);
    setTimeout(() => setSyncToast(null), 3500);
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Isu', href: '/isu' },
    { name: 'Pantauan', href: '/pantauan' },
    { name: 'Peta', href: '/peta' },
    { name: 'Analisis', href: '/ai-analyst' },
    { name: 'Kajian', href: '/kajian' },
  ];

  const availableRoles: UserRole[] = ['public', 'kader', 'researcher', 'admin'];

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[68px]">
          
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none shrink-0">
            <div className="relative w-7 h-9 sm:w-8 sm:h-10 flex-shrink-0">
              <Image
                src="/assets/gmni/logo-gmni.png"
                alt="Logo GMNI"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-ink-primary">
                  RUANG ISU
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-ink-secondary font-medium tracking-wider uppercase leading-none">
                GMNI WASTUKANCANA
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map(link => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 text-xs font-medium rounded-btn transition-colors ${
                    isActive
                      ? 'text-primary font-semibold bg-muted'
                      : 'text-ink-secondary hover:text-ink-primary hover:bg-muted/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons: Sync News, Search, Role Switcher, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Real-Time Sync News Button */}
            <button
              onClick={handleSyncClick}
              disabled={isSyncingNews}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-btn border transition-all ${
                isSyncingNews
                  ? 'bg-muted text-ink-secondary border-border cursor-not-allowed'
                  : 'bg-surface hover:bg-muted text-ink-primary border-border active:scale-95'
              }`}
              title="Tarik & Sinkronisasi Berita dari Media Nasional & Daerah"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-primary ${isSyncingNews ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline text-[11px]">
                {isSyncingNews ? 'Menarik...' : 'Tarik Berita'}
              </span>
            </button>

            {/* Quick Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex items-center gap-2 px-2.5 py-1.5 text-xs text-ink-secondary bg-muted/70 hover:bg-muted border border-border rounded-btn transition-colors focus:outline-none"
              title="Cari Isu, Fakta, Aktor (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-ink-tertiary" />
              <span className="hidden sm:inline text-[11px]">Cari...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-surface border border-border rounded text-ink-tertiary">
                ⌘K
              </kbd>
            </button>

            {/* Mode Akses Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-btn border border-border bg-surface hover:bg-muted text-ink-primary transition-colors shadow-subtle"
                title="Ganti Mode Akses (Publik, Kader, Peneliti, Admin)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span className="hidden md:inline text-[11px]">
                  Mode: <span className="font-bold text-ink-primary">{ROLE_CONFIGS[role]?.shortLabel || role}</span>
                </span>
                <ChevronDown className="w-3 h-3 text-ink-tertiary" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-72 bg-surface rounded-card shadow-card border border-border py-2 z-50 animate-in fade-in">
                  <div className="px-3 pb-2 border-b border-border">
                    <div className="text-[10px] font-bold text-ink-tertiary uppercase tracking-wider">
                      Mode Akses & Hak Peran
                    </div>
                    <div className="text-[11px] text-ink-secondary mt-0.5">
                      Ubah kapabilitas telaah isu sesuai peran kerja.
                    </div>
                  </div>

                  <div className="p-1 space-y-1">
                    {availableRoles.map(r => {
                      const cfg = ROLE_CONFIGS[r];
                      const isSelected = role === r || (role === 'member' && r === 'kader');
                      return (
                        <button
                          key={r}
                          onClick={() => {
                            setRole(r);
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded text-xs transition-colors space-y-0.5 ${
                            isSelected 
                              ? 'bg-stone-900 text-white font-semibold shadow-sm' 
                              : 'hover:bg-stone-100 text-ink-primary'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold">{cfg.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          </div>
                          <p className={`text-[11px] leading-tight line-clamp-2 ${isSelected ? 'text-stone-300' : 'text-ink-tertiary'}`}>
                            {cfg.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Button */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="p-2 text-ink-secondary hover:text-ink-primary bg-surface hover:bg-muted rounded-btn border border-border transition-colors"
              title="Profil Pengguna & Autentikasi"
            >
              <User className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Floating Sync Toast Notification */}
      {syncToast && (
        <div className="bg-ink-primary text-white text-xs px-4 py-2 text-center flex items-center justify-center gap-2 animate-in slide-in-from-top duration-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{syncToast}</span>
        </div>
      )}
    </header>
  );
}
