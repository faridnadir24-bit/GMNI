'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Sparkles, FileText, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function MobileNav() {
  const pathname = usePathname();
  const { setIsAuthModalOpen } = useApp();

  const mobileLinks = [
    { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Isu', href: '/isu', icon: BookOpen },
    { name: 'AI', href: '/ai-analyst', icon: Sparkles },
    { name: 'Kajian', href: '/kajian', icon: FileText },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/98 backdrop-blur-md border-t border-border px-3 py-1.5 shadow-subtle">
      <div className="flex items-center justify-around">
        {mobileLinks.map(link => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-btn transition-colors ${
                isActive
                  ? 'text-primary font-semibold'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="text-[10px] mt-0.5">{link.name}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 text-ink-secondary hover:text-ink-primary"
        >
          <User className="w-4 h-4" strokeWidth={1.8} />
          <span className="text-[10px] mt-0.5">Profil</span>
        </button>
      </div>
    </nav>
  );
}
