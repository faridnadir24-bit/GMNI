'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  Layers, 
  Radio, 
  MapPin, 
  FileText, 
  Info, 
  ChevronDown,
  User,
  Bell,
  SlidersHorizontal,
  Bookmark
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';

export default function Navbar() {
  const pathname = usePathname();
  const { role, setRole, setIsSearchOpen, setIsAuthModalOpen, savedIssueIds } = useApp();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Layers },
    { name: 'Isu', href: '/isu', icon: BookOpen },
    { name: 'Pantauan', href: '/pantauan', icon: Radio },
    { name: 'Peta Isu', href: '/peta', icon: MapPin },
    { name: 'Analisis AI', href: '/ai-analyst', icon: Sparkles },
    { name: 'Bahan Kajian', href: '/kajian', icon: FileText },
    { name: 'Sumber', href: '/sumber', icon: ShieldCheck },
    { name: 'Tentang', href: '/tentang', icon: Info },
  ];

  const roleLabels: Record<UserRole, { title: string; badge: string; color: string }> = {
    admin: { title: 'Administrator', badge: 'Admin Akses Penuh', color: 'bg-red-100 text-red-800 border-red-200' },
    researcher: { title: 'Peneliti / Kader SosPol', badge: 'Kader Riset', color: 'bg-amber-100 text-amber-900 border-amber-300' },
    member: { title: 'Anggota GMNI', badge: 'Kader GMNI', color: 'bg-slate-100 text-slate-800 border-slate-300' },
    public: { title: 'Publik / Tamu', badge: 'Mode Publik', color: 'bg-zinc-100 text-zinc-700 border-zinc-200' },
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-subtle transition-all">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-white text-xs px-4 py-1.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="inline-flex items-center gap-1 font-semibold text-red-400 uppercase tracking-wider text-[10px] bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            GMNI WASTUKANCANA
          </span>
          <span className="text-slate-300 truncate hidden sm:inline">
            Pusat Pemantauan dan Pengembangan Isu Sosial Politik Purwakarta & Nasional
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 text-[11px] shrink-0">
          <span className="italic hidden md:inline">"Membaca Persoalan, Mengawal Perubahan"</span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="font-mono text-[10px] text-slate-300">v1.0-INTEL</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative w-10 h-11 flex-shrink-0 transition-transform group-hover:scale-105">
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
                <span className="font-bold text-lg tracking-tight text-slate-900 font-sans">
                  RUANG<span className="text-gmni-red"> ISU</span>
                </span>
                <span className="text-[10px] font-bold bg-red-50 text-gmni-red border border-red-200 px-1.5 py-0.2 rounded uppercase tracking-wider">
                  GMNI
                </span>
              </div>
              <span className="text-[11px] text-slate-700 font-medium leading-none hidden sm:block">
                Komisariat Wastukancana – Purwakarta
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-red-50 text-gmni-red font-semibold border border-red-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-gmni-red' : 'text-slate-600'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons: Search, Role Switcher, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Command Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg transition-colors focus:outline-none"
              title="Cari Isu, Fakta, Aktor (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline text-[11px]">Cari isu...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded shadow-xs text-slate-500">
                ⌘K
              </kbd>
            </button>

            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${roleLabels[role].color}`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{roleLabels[role].badge}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] text-slate-500 font-medium">
                    Simulasi Akses Peran:
                  </div>
                  {(['admin', 'researcher', 'member', 'public'] as UserRole[]).map(r => (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        role === r ? 'bg-red-50 text-gmni-red font-semibold' : 'text-slate-700'
                      }`}
                    >
                      <span>{roleLabels[r].title}</span>
                      {role === r && <span className="w-1.5 h-1.5 rounded-full bg-gmni-red" />}
                    </button>
                  ))}
                  <div className="px-3 pt-2 mt-1 border-t border-slate-100 text-[10px] text-slate-400">
                    Peran mengaktifkan tombol analisis, tambah klaim, dan ekspor kajian.
                  </div>
                </div>
              )}
            </div>

            {/* Auth / Profile Button */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
              title="Profil & Autentikasi Kader"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
