'use client';

import React from 'react';
import Image from 'next/image';
import { X, Check, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, role, setRole } = useApp();

  if (!isAuthModalOpen) return null;

  const rolesList: {
    id: UserRole;
    title: string;
    description: string;
    badge: string;
    permissions: string[];
  }[] = [
    {
      id: 'researcher',
      title: 'Kader Peneliti / Bidang SosPol',
      badge: 'Riset & Kajian',
      description: 'Akses ke modul AI Analyst, generator Bahan Kajian, penambahan rujukan sumber, dan analisis Marhaenisme.',
      permissions: [
        'Akses modul AI Analyst',
        'Buat & Cetak Dokumen Kajian',
        'Kurasi data sumber',
        'Pantauan sinyal publik'
      ]
    },
    {
      id: 'admin',
      title: 'Administrator Sistem GMNI',
      badge: 'Kelola Data',
      description: 'Pengelolaan data master isu, verifikasi klaim, moderasi rujukan, dan konfigurasi platform.',
      permissions: [
        'Semua hak akses Peneliti',
        'Pendaftaran isu baru',
        'Verifikasi label Fact vs Claim',
        'Arsip naskah organisasi'
      ]
    },
    {
      id: 'member',
      title: 'Kader & Anggota GMNI',
      badge: 'Akses Kader',
      description: 'Membaca seluruh arsip kajian dan mengikuti perkembangan isu teritorial.',
      permissions: [
        'Akses direktori & linimasa isu',
        'Unduh dokumen kajian PDF/MD',
        'Peta sebaran geospasial'
      ]
    },
    {
      id: 'public',
      title: 'Publik / Tamu',
      badge: 'Mode Publik',
      description: 'Membaca ringkasan isu publik dan transparansi fakta tanpa manipulasi data.',
      permissions: [
        'Membaca isu berstatus publik',
        'Melihat status Fact vs Claim',
        'Melihat metodologi sumber data'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-surface rounded-card shadow-card border border-border overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header with GMNI Identity */}
        <div className="p-5 bg-surface border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-10 shrink-0">
              <Image
                src="/assets/gmni/logo-gmni.png"
                alt="Logo GMNI"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-ink-primary">
                  RUANG ISU
                </span>
                <span className="text-[10px] font-semibold text-ink-secondary bg-muted px-2 py-0.5 rounded border border-border">
                  Autentikasi & Peran
                </span>
              </div>
              <p className="text-xs text-ink-secondary mt-0.5">
                GMNI Komisariat Wastukancana – Purwakarta
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-ink-tertiary hover:text-ink-primary rounded-btn hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Role Switcher */}
        <div className="p-5 overflow-y-auto space-y-3">
          <div className="text-xs text-ink-secondary">
            Pilih hak akses untuk simulasi alur kerja riset dan analisis kebijakan:
          </div>

          <div className="space-y-2.5">
            {rolesList.map(r => {
              const isSelected = role === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`p-3.5 rounded-btn border cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-primary bg-stone-50/80 shadow-subtle'
                      : 'border-border hover:border-stone-300 hover:bg-muted/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-ink-primary">{r.title}</h4>
                        <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-muted text-ink-secondary border border-border">
                          {r.badge}
                        </span>
                      </div>
                      <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
                        {r.description}
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                      isSelected 
                        ? 'border-primary bg-primary text-white' 
                        : 'border-border'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-border/60 flex flex-wrap gap-1">
                    {r.permissions.map((p, idx) => (
                      <span key={idx} className="text-[10px] text-ink-secondary bg-surface border border-border px-1.5 py-0.5 rounded">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-muted/40 border-t border-border flex items-center justify-between text-xs">
          <div className="text-ink-secondary">
            Peran aktif: <strong className="text-ink-primary uppercase font-mono">{role}</strong>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="px-4 py-2 bg-ink-primary hover:bg-black text-white text-xs font-semibold rounded-btn transition-colors"
          >
            Terapkan & Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}
