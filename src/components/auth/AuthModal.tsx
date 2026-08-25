'use client';

import React from 'react';
import Image from 'next/image';
import { X, ShieldCheck, Check, Sparkles, FileText, Database } from 'lucide-react';
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
      badge: 'Direkomendasikan untuk Riset',
      description: 'Akses penuh ke seluruh mesin AI Analyst, generator Bahan Kajian, penambahan sumber terverifikasi, dan analisis Marhaenisme.',
      permissions: [
        'Akses semua modul AI Analyst',
        'Buat & Cetak Dokumen Bahan Kajian',
        'Tambah & kurasi sumber informasi',
        'Pantauan sinyal media sosial'
      ]
    },
    {
      id: 'admin',
      title: 'Administrator Sistem GMNI',
      badge: 'Manajemen Data Isu',
      description: 'Pengelolaan data master isu, verifikasi klaim, moderasi sumber, dan konfigurasi platform.',
      permissions: [
        'Semua hak akses Peneliti',
        'Tambah & edit isu baru',
        'Verifikasi label Fact vs Claim',
        'Manajemen arsip dokumen organisasi'
      ]
    },
    {
      id: 'member',
      title: 'Kader & Anggota GMNI',
      badge: 'Akses Internal',
      description: 'Akses membaca seluruh arsip kajian, mengikuti perkembangan momentum isu, dan memberi anotasi internal.',
      permissions: [
        'Baca semua isu & timeline',
        'Unduh dokumen kajian PDF/MD',
        'Akses peta sebaran isu'
      ]
    },
    {
      id: 'public',
      title: 'Masyarakat Umum / Publik',
      badge: 'Mode Publik Terbuka',
      description: 'Membaca ringkasan isu publik dan transparansi fakta tanpa fitur manipulasi data.',
      permissions: [
        'Membaca isu berstatus publik',
        'Melihat status Fact vs Claim',
        'Melihat metodologi sumber data'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header with GMNI Identity */}
        <div className="p-6 bg-slate-900 text-white relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative w-12 h-14 shrink-0">
              <Image
                src="/assets/gmni/logo-gmni.png"
                alt="Logo GMNI"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white font-sans">
                  RUANG<span className="text-red-500"> ISU</span>
                </span>
                <span className="text-[10px] font-bold bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded">
                  PORTAL OTENTIKASI
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                GMNI Komisariat Wastukancana – Purwakarta
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body: Role Switcher */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="text-xs text-slate-600">
            Pilih hak akses peran untuk mensimulasikan ruang kerja intelligence dan pembuatan kajian:
          </div>

          <div className="space-y-3">
            {rolesList.map(r => {
              const isSelected = role === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => {
                    setRole(r.id);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-gmni-red bg-red-50/40 ring-1 ring-gmni-red shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{r.title}</h4>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          isSelected 
                            ? 'bg-red-100 text-red-800 border-red-300' 
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {r.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {r.description}
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                      isSelected 
                        ? 'border-gmni-red bg-gmni-red text-white' 
                        : 'border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2.5 border-t border-slate-100/80 flex flex-wrap gap-1.5">
                    {r.permissions.map((p, idx) => (
                      <span key={idx} className="text-[10px] text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
                        ✓ {p}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-mono">
            Status: <span className="font-bold text-slate-900 uppercase">{role}</span> aktif
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
          >
            Terapkan & Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}
