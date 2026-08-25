import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, ArrowUpRight, Scale, BookMarked, ExternalLink, HeartHandshake } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-24 lg:pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand & Organization Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-12 flex-shrink-0">
                <Image
                  src="/assets/gmni/logo-gmni.png"
                  alt="Logo GMNI"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg tracking-tight font-sans">
                  RUANG<span className="text-red-500"> ISU</span>
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Pusat Pemantauan & Pengembangan Isu Sosial Politik
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Platform intelligence dan riset kebijakan berbasis data untuk memperkuat posisi advokasi kader, 
              memetakan konflik struktural kaum Marhaen, dan merumuskan bahan kajian strategis dari tingkat lokal 
              Purwakarta hingga nasional.
            </p>

            <div className="pt-2">
              <span className="inline-block bg-red-950/80 text-red-400 text-xs font-semibold px-3 py-1 rounded-md border border-red-800/80 font-mono">
                "Pejuang Pemikir – Pemikir Pejuang"
              </span>
            </div>
          </div>

          {/* Quick Nav Col */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Modul Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
                  Dashboard Pemantauan
                </Link>
              </li>
              <li>
                <Link href="/isu" className="text-slate-400 hover:text-white transition-colors">
                  Direktori Isu Prioritas
                </Link>
              </li>
              <li>
                <Link href="/pantauan" className="text-slate-400 hover:text-white transition-colors">
                  Pantauan Media Sosial
                </Link>
              </li>
              <li>
                <Link href="/peta" className="text-slate-400 hover:text-white transition-colors">
                  Peta Isu Interaktif
                </Link>
              </li>
              <li>
                <Link href="/ai-analyst" className="text-slate-400 hover:text-white transition-colors">
                  AI Issue Analyst
                </Link>
              </li>
              <li>
                <Link href="/kajian" className="text-slate-400 hover:text-white transition-colors">
                  Arsip Bahan Kajian
                </Link>
              </li>
            </ul>
          </div>

          {/* Methodology & Ethics Col */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Metodologi
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/sumber" className="text-slate-400 hover:text-white transition-colors">
                  Validasi Sumber Data
                </Link>
              </li>
              <li>
                <Link href="/tentang#etika" className="text-slate-400 hover:text-white transition-colors">
                  Prinsip Fact vs Claim
                </Link>
              </li>
              <li>
                <Link href="/tentang#marhaenisme" className="text-slate-400 hover:text-white transition-colors">
                  Kerangka Marhaenisme
                </Link>
              </li>
              <li>
                <Link href="/sumber#kredibilitas" className="text-slate-400 hover:text-white transition-colors">
                  Credibility Index
                </Link>
              </li>
            </ul>
          </div>

          {/* Organization & Contact */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              GMNI Wastukancana
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Komisariat Wastukancana – DPC GMNI Kabupaten Purwakarta, Jawa Barat.
            </p>
            <div className="text-[11px] text-slate-400 space-y-1">
              <p>📍 Purwakarta, Jawa Barat - Indonesia</p>
              <p>✉️ sospol.wastukancana@gmni.id</p>
            </div>
            <div className="pt-2">
              <Link 
                href="/tentang"
                className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-medium"
              >
                <span>Pelajari Profil Organisasi</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} RUANG ISU GMNI Komisariat Wastukancana. Hak Cipta Dilindungi.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Tagline: "Membaca Persoalan, Mengawal Perubahan."</span>
            <span>•</span>
            <span className="text-emerald-400 font-mono">STATUS: INTEL PROTOTYPE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
