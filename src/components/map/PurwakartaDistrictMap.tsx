'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { Issue } from '@/types';

interface PurwakartaDistrictMapProps {
  issues: Issue[];
}

export default function PurwakartaDistrictMap({ issues }: PurwakartaDistrictMapProps) {
  const [activeKecamatan, setActiveKecamatan] = useState<string>('Jatiluhur');

  const districts = [
    { name: 'Jatiluhur', issuesCount: 9, topIssue: 'Penertiban KJA Waduk & Obvitnas', status: 'Kritis', category: 'Keamanan' },
    { name: 'Bungursari', issuesCount: 7, topIssue: 'Status Outsourcing Buruh KBI', status: 'Kritis', category: 'Ketenagakerjaan' },
    { name: 'Wanayasa', issuesCount: 5, topIssue: 'Sengketa Alih Fungsi Lahan Tani', status: 'Tinggi', category: 'Agraria' },
    { name: 'Purwakarta (Kota)', issuesCount: 6, topIssue: 'Akses Beasiswa & Pengangguran Muda', status: 'Sedang', category: 'Pendidikan' },
    { name: 'Babakancikao', issuesCount: 4, topIssue: 'Limbah Industri Sungai Citarum', status: 'Tinggi', category: 'Lingkungan' },
    { name: 'Maniis', issuesCount: 3, topIssue: 'Retribusi Dermaga & Sanitasi Cirata', status: 'Sedang', category: 'Pemerintahan' },
    { name: 'Campaka', issuesCount: 3, topIssue: 'Keamanan Jalur Arteri Buruh Malam', status: 'Sedang', category: 'Keamanan' },
    { name: 'Plered', issuesCount: 2, topIssue: 'Bahan Baku & Pasar Keramik UMKM', status: 'Stabil', category: 'Ekonomi' },
    { name: 'Sukatani', issuesCount: 3, topIssue: 'Dampak Debu Kuari & Lalu Lintas Berat', status: 'Tinggi', category: 'Lingkungan' },
    { name: 'Sukasari', issuesCount: 2, topIssue: 'Aksesibilitas Jalan & Listrik Desa', status: 'Tinggi', category: 'Sosial' },
    { name: 'Darangdan', issuesCount: 2, topIssue: 'Stabilitas Harga Komoditas Cengkeh', status: 'Stabil', category: 'Ekonomi' },
    { name: 'Bojong', issuesCount: 1, topIssue: 'Perlindungan Mata Air Burangrang', status: 'Sedang', category: 'Lingkungan' },
    { name: 'Pasawahan', issuesCount: 2, topIssue: 'Drainase Irigasi Sawah Rendahan', status: 'Stabil', category: 'Agraria' },
    { name: 'Tegalwaru', issuesCount: 1, topIssue: 'Konservasi Batuan Andesit Gunung Parang', status: 'Sedang', category: 'Lingkungan' },
    { name: 'Cibatu', issuesCount: 2, topIssue: 'Serapan Tenaga Kerja Lokal Industri Baru', status: 'Tinggi', category: 'Ketenagakerjaan' },
    { name: 'Kiarapedes', issuesCount: 1, topIssue: 'Jalur Distribusi Pupuk Subsidi', status: 'Stabil', category: 'Agraria' },
    { name: 'Pondoksalam', issuesCount: 1, topIssue: 'Logistik Gabah Panen Petani', status: 'Stabil', category: 'Agraria' },
  ];

  const selectedDist = districts.find(d => d.name.toLowerCase().includes(activeKecamatan.toLowerCase())) || districts[0];

  return (
    <div className="bg-surface rounded-card border border-border shadow-subtle p-6 space-y-6">
      
      {/* Header */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-ink-primary">
            Pemetaan Khusus: 17 Kecamatan Kabupaten Purwakarta
          </h3>
          <span className="text-[10px] font-semibold px-2 py-0.5 bg-stone-100 text-primary border border-border rounded">
            Basis Teritorial GMNI
          </span>
        </div>
        <p className="text-xs text-ink-secondary mt-0.5">
          Basis pengorganisasian GMNI Wastukancana dalam mengadvokasi persoalan konkret rakyat di tiap kecamatan.
        </p>
      </div>

      {/* Grid of 17 Sub-districts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {districts.map(d => {
          const isSelected = activeKecamatan === d.name;
          return (
            <button
              key={d.name}
              onClick={() => setActiveKecamatan(d.name)}
              className={`p-2.5 rounded-btn border text-left transition-colors flex flex-col justify-between h-20 ${
                isSelected
                  ? 'bg-stone-100 border-ink-primary shadow-subtle'
                  : 'bg-surface border-border hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink-primary truncate">{d.name}</span>
              </div>
              <div className="flex items-baseline justify-between text-[11px] font-mono">
                <span className={`font-semibold ${isSelected ? 'text-primary' : 'text-ink-secondary'}`}>
                  {d.issuesCount} Isu
                </span>
                <span className="text-[10px] font-sans text-ink-tertiary">
                  {d.status}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Kecamatan Details Strip */}
      <div className="p-4 bg-stone-50 rounded-btn border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-ink-secondary" />
            <h4 className="text-xs sm:text-sm font-bold text-ink-primary">
              Kecamatan {selectedDist.name} — Fokus Isu: <span className="text-primary">{selectedDist.topIssue}</span>
            </h4>
          </div>
          <p className="text-xs text-ink-secondary mt-1">
            Kategori: {selectedDist.category} · Status: {selectedDist.status}
          </p>
        </div>

        <Link
          href={`/isu?territory=purwakarta&district=${encodeURIComponent(selectedDist.name)}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-ink-primary hover:bg-black text-white text-xs font-medium rounded-btn transition-colors shrink-0"
        >
          <span>Buka Isu Kecamatan Ini</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
