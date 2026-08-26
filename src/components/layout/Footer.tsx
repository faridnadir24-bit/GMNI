import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-20 pt-12 pb-20 lg:pb-12 text-ink-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-border">
          
          {/* Brand & Organization */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-10 flex-shrink-0">
                <Image
                  src="/assets/gmni/logo-gmni.png"
                  alt="Logo GMNI"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-ink-primary font-bold text-base tracking-tight">
                  RUANG ISU
                </h3>
                <p className="text-xs text-ink-secondary">
                  Pusat Pemantauan dan Pengembangan Isu Sosial Politik
                </p>
              </div>
            </div>

            <p className="text-xs text-ink-secondary leading-relaxed max-w-md pt-1">
              Platform intelligence dan riset kebijakan publik berbasis data untuk menunjang kerja advokasi kader GMNI Komisariat Wastukancana Purwakarta.
            </p>

            <div className="text-xs text-ink-tertiary pt-1 font-mono">
              "Pejuang Pemikir – Pemikir Pejuang"
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-primary">
              Navigasi
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-ink-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/isu" className="hover:text-ink-primary transition-colors">
                  Direktori Isu
                </Link>
              </li>
              <li>
                <Link href="/pantauan" className="hover:text-ink-primary transition-colors">
                  Pantauan Publik
                </Link>
              </li>
              <li>
                <Link href="/peta" className="hover:text-ink-primary transition-colors">
                  Peta Isu
                </Link>
              </li>
              <li>
                <Link href="/ai-analyst" className="hover:text-ink-primary transition-colors">
                  AI Analyst
                </Link>
              </li>
              <li>
                <Link href="/kajian" className="hover:text-ink-primary transition-colors">
                  Bahan Kajian
                </Link>
              </li>
            </ul>
          </div>

          {/* Methodology & Ethics */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-primary">
              Metodologi & Sumber
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/sumber" className="hover:text-ink-primary transition-colors">
                  Validasi Sumber
                </Link>
              </li>
              <li>
                <Link href="/tentang#etika" className="hover:text-ink-primary transition-colors">
                  Prinsip Fact vs Claim
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-ink-primary transition-colors">
                  Tentang GMNI Wastukancana
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-tertiary gap-3">
          <div>
            © {new Date().getFullYear()} RUANG ISU GMNI Komisariat Wastukancana – Purwakarta.
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span>Membaca Persoalan, Mengawal Perubahan</span>
            <span>·</span>
            <span className="font-mono text-emerald-700 font-medium">Pantauan Terhubung</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
