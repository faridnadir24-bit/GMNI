'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Radio, Sparkles, User, FileText, MapPin } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function MobileNav() {
  const pathname = usePathname();
  const { setIsAuthModalOpen } = useApp();

  const mobileLinks = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Isu', href: '/isu', icon: BookOpen },
    { name: 'Pantauan', href: '/pantauan', icon: Radio },
    { name: 'Peta', href: '/peta', icon: MapPin },
    { name: 'AI', href: '/ai-analyst', icon: Sparkles },
    { name: 'Kajian', href: '/kajian', icon: FileText },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1.5 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around">
        {mobileLinks.map(link => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all ${
                isActive
                  ? 'text-gmni-red font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{link.name}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2 text-slate-500 hover:text-slate-800"
        >
          <User className="w-5 h-5 stroke-[1.75px]" />
          <span className="text-[10px] mt-0.5 tracking-tight">Profil</span>
        </button>
      </div>
    </nav>
  );
}
