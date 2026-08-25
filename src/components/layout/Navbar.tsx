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
  Check
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';

export default function Navbar() {
  const pathname = usePathname();
  const { role, setRole, setIsSearchOpen, setIsAuthModalOpen } = useApp();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Isu', href: '/isu' },
    { name: 'Pantauan', href: '/pantauan' },
    { name: 'Peta', href: '/peta' },
    { name: 'Analisis', href: '/ai-analyst' },
    { name: 'Kajian', href: '/kajian' },
  ];

  const roleLabels: Record<UserRole, { title: string; badge: string }> = {
    admin: { title: 'Administrator', badge: 'Admin' },
    researcher: { title: 'Peneliti SosPol', badge: 'Peneliti' },
    member: { title: 'Kader GMNI', badge: 'Kader' },
    public: { title: 'Publik', badge: 'Publik' },
  };

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

          {/* Action Buttons: Search, Role Switcher, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex items-center gap-2 px-2.5 py-1.5 text-xs text-ink-secondary bg-muted/70 hover:bg-muted border border-border rounded-btn transition-colors focus:outline-none"
              title="Cari Isu, Fakta, Aktor (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-ink-tertiary" />
              <span className="hidden sm:inline text-[11px]">Cari isu...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-surface border border-border rounded text-ink-tertiary">
                ⌘K
              </kbd>
            </button>

            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-btn border border-border bg-surface hover:bg-muted text-ink-primary transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-ink-secondary" />
                <span className="hidden md:inline text-[11px]">{roleLabels[role].badge}</span>
                <ChevronDown className="w-3 h-3 text-ink-tertiary" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-48 bg-surface rounded-card shadow-card border border-border py-1.5 z-50 animate-in fade-in">
                  <div className="px-3 py-1 text-[10px] font-semibold text-ink-tertiary uppercase tracking-wider border-b border-border">
                    Hak Akses Peran
                  </div>
                  {(['admin', 'researcher', 'member', 'public'] as UserRole[]).map(r => (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-muted transition-colors ${
                        role === r ? 'text-primary font-semibold bg-stone-50' : 'text-ink-primary'
                      }`}
                    >
                      <span>{roleLabels[r].title}</span>
                      {role === r && <Check className="w-3 h-3 text-primary" />}
                    </button>
                  ))}
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
    </header>
  );
}
