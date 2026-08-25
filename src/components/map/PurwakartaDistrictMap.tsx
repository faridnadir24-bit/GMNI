'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Issue } from '@/types';

interface PurwakartaDistrictMapProps {
  issues: Issue[];
}

export default function PurwakartaDistrictMap({ issues }: PurwakartaDistrictMapProps) {
  const [activeKecamatan, setActiveKecamatan] = useState<string>('Jatiluhur');

  const districts = [
    { name: 'Jatiluhur', issuesCount: 9, topIssue: 'Penertiban KJA Waduk & Obvitnas', status: 'Kritis', category: 'Keamanan Publik' },
    { name: 'Bungursari', issuesCount: 7, topIssue: 'Status Outsourcing Buruh KBI', status: 'Kritis', category: 'Ketenagakerjaan' },
    { name: 'Wanayasa', issuesCount: 5, topIssue: 'Sengketa Alih Fungsi Lahan Tani', status: 'Tinggi', category: 'Agraria' },
    { name: 'Purwakarta (Kota)', issuesCount: 6, topIssue: 'Akses Beasiswa & Pengangguran Muda', status: 'Sedang', category: 'Pendidikan' },
    { name: 'Babakancikao', issuesCount: 4, topIssue: 'Limbah Industri Sungai Citarum', status: 'Tinggi', category: 'Lingkungan' },
    { name: 'Maniis', issuesCount: 3, topIssue: 'Retribusi Dermaga & Sanitasi Cirata', status: 'Sedang', category: 'Tata Kelola' },
    { name: 'Campaka', issuesCount: 3, topIssue: 'Keamanan Jalur Arteri Buruh Malam', status: 'Sedang', category: 'Infrastruktur' },
    { name: 'Plered', issuesCount: 2, topIssue: 'Bahan Baku & Pasar Keramik UMKM', status: 'Stabil', category: 'Ekonomi Kerakyatan' },
    { name: 'Sukatani', issuesCount: 3, topIssue: 'Dampak Debu Kuari & Lalu Lintas Berat', status: 'Tinggi', category: 'Lingkungan' },
    { name: 'Sukasari', issuesCount: 2, topIssue: 'Aksesibilitas Jalan & Listrik Desa', status: 'Tinggi', category: 'Keadilan Wilayah' },
    { name: 'Darangdan', issuesCount: 2, topIssue: 'Stabilitas Harga Komoditas Cengkeh', status: 'Stabil', category: 'Pangan' },
    { name: 'Bojong', issuesCount: 1, topIssue: 'Perlindungan Mata Air Burangrang', status: 'Sedang', category: 'Air Baku' },
    { name: 'Pasawahan', issuesCount: 2, topIssue: 'Drainase Irigasi Sawah Rendahan', status: 'Stabil', category: 'Pertanian' },
    { name: 'Tegalwaru', issuesCount: 1, topIssue: 'Konservasi Batuan Andesit Gunung Parang', status: 'Sedang', category: 'Lingkungan' },
    { name: 'Cibatu', issuesCount: 2, topIssue: 'Serapan Tenaga Kerja Lokal Industri Baru', status: 'Tinggi', category: 'Ketenagakerjaan' },
    { name: 'Kiarapedes', issuesCount: 1, topIssue: 'Jalur Distribusi Pupuk Subsidi', status: 'Stabil', category: 'Pertanian' },
    { name: 'Pondoksalam', issuesCount: 1, topIssue: 'Logistik Gabah Panen Petani', status: 'Stabil', category: 'Pangan' },
  ];

  const selectedDist = districts.find(d => d.name.toLowerCase().includes(activeKecamatan.toLowerCase())) || districts[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <h3 className="text-base font-bold text-slate-900 font-sans">
              Pemetaan Isu Khusus: 17 Kecamatan Kabupaten Purwakarta
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-red-50 text-gmni-red border border-red-200 rounded">
              PRIORITAS UTAMA GMNI
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Basis pergerakan GMNI Wastukancana dalam mengadvokasi persoalan konkret rakyat di tiap kecamatan.
          </p>
        </div>
      </div>

      {/* Grid of 17 Sub-districts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {districts.map(d => {
          const isSelected = activeKecamatan === d.name;
          const isCritical = d.status === 'Kritis';
          return (
            <button
              key={d.name}
              onClick={() => setActiveKecamatan(d.name)}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between h-20 ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-red-500 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold truncate">{d.name}</span>
                {isCritical && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />}
              </div>
              <div className="flex items-baseline justify-between">
                <span className={`text-xs font-mono font-bold ${isSelected ? 'text-red-400' : 'text-gmni-red'}`}>
                  {d.issuesCount} Isu
                </span>
                <span className={`text-[9px] px-1 py-0.2 rounded ${
                  isSelected ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600'
                }`}>
                  {d.status}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Kecamatan Details Strip */}
      <div className="p-4 bg-red-50/50 rounded-xl border border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gmni-red" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              Kecamatan {selectedDist.name} — Fokus Isu: <span className="text-gmni-red">{selectedDist.topIssue}</span>
            </h4>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Kategori Utama: <span className="font-semibold">{selectedDist.category}</span> | Terdata {selectedDist.issuesCount} titik persoalan yang dipantau kader.
          </p>
        </div>

        <Link
          href={`/isu?district=${selectedDist.name}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gmni-red hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0"
        >
          <span>Eksplorasi Isu {selectedDist.name}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
