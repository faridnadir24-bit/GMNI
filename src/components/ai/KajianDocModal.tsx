'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Printer, Download, Copy, Check } from 'lucide-react';
import { BahanKajianDocument } from '@/types';

interface KajianDocModalProps {
  doc: BahanKajianDocument;
  isOpen: boolean;
  onClose: () => void;
}

export default function KajianDocModal({ doc, isOpen, onClose }: KajianDocModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const mdContent = `
# ${doc.title}
## ${doc.subtitle}
**Penulis:** ${doc.author} | **Lembaga:** ${doc.komisariat} | **Tanggal:** ${doc.date_created}
**Status Dokumen:** ${doc.status}

---

### 1. Latar Belakang
${doc.sections.latar_belakang}

### 2. Rumusan Masalah
${doc.sections.rumusan_masalah.map((r, i) => `${i + 1}. ${r}`).join('\n')}

### 3. Data & Fakta Terverifikasi
${doc.sections.data_dan_fakta.map((d, i) => `- ${d}`).join('\n')}

### 4. Kronologi Singkat
${doc.sections.kronologi_singkat.map((k, i) => `- ${k}`).join('\n')}

### 5. Pihak Terkait & Pemangku Kepentingan
${doc.sections.pihak_terkait.map((p, i) => `- **${p.nama}** (${p.peran}): Posisi ${p.posisi}`).join('\n')}

### 6. Analisis Sosial Politik
${doc.sections.analisis_sosial_politik}

### 7. Pisau Analisis Perspektif Marhaenisme GMNI
${doc.sections.perspektif_marhaenisme}

### 8. Dampak terhadap Kaum Marhaen & Masyarakat
${doc.sections.dampak_masyarakat}

### 9. Alternatif Kebijakan
${doc.sections.alternatif_kebijakan.map((a, i) => `${i + 1}. ${a}`).join('\n')}

### 10. Rekomendasi Taktis & Advokasi
${doc.sections.rekomendasi_advokasi.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

### 11. Daftar Referensi & Sumber
${doc.sections.daftar_pustaka.map((p, i) => `- *${p.title}*, ${p.source} (${p.year})`).join('\n')}

---
*Diterbitkan oleh RUANG ISU GMNI Wastukancana Purwakarta*
    `.trim();

    navigator.clipboard.writeText(mdContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const mdContent = `
# ${doc.title}
## ${doc.subtitle}
**Penulis:** ${doc.author} | **Lembaga:** ${doc.komisariat} | **Tanggal:** ${doc.date_created}
**Status:** ${doc.status}

---

### 1. Latar Belakang
${doc.sections.latar_belakang}

### 2. Rumusan Masalah
${doc.sections.rumusan_masalah.map((r, i) => `${i + 1}. ${r}`).join('\n')}

### 3. Data & Fakta Terverifikasi
${doc.sections.data_dan_fakta.map((d, i) => `- ${d}`).join('\n')}

### 4. Kronologi Singkat
${doc.sections.kronologi_singkat.map((k, i) => `- ${k}`).join('\n')}

### 5. Pihak Terkait
${doc.sections.pihak_terkait.map((p, i) => `- **${p.nama}** (${p.peran}): ${p.posisi}`).join('\n')}

### 6. Analisis Sosial Politik
${doc.sections.analisis_sosial_politik}

### 7. Perspektif Marhaenisme GMNI
${doc.sections.perspektif_marhaenisme}

### 8. Dampak Masyarakat
${doc.sections.dampak_masyarakat}

### 9. Alternatif Kebijakan
${doc.sections.alternatif_kebijakan.map((a, i) => `${i + 1}. ${a}`).join('\n')}

### 10. Rekomendasi Advokasi
${doc.sections.rekomendasi_advokasi.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

### 11. Daftar Pustaka
${doc.sections.daftar_pustaka.map((p, i) => `- ${p.title}, ${p.source} (${p.year})`).join('\n')}
    `.trim();

    const element = document.createElement("a");
    const file = new Blob([mdContent], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `Kajian_GMNI_${doc.issue_id}_${doc.date_created}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-4xl bg-surface rounded-card shadow-card border border-border overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Top Control Bar */}
        <div className="px-6 py-4 bg-ink-primary text-white flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-7 h-9 shrink-0">
              <Image
                src="/assets/gmni/logo-gmni.png"
                alt="Logo GMNI"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">
                  DOKUMEN BAHAN KAJIAN
                </span>
                <span className="text-[10px] bg-stone-800 text-stone-200 border border-stone-700 px-2 py-0.5 rounded font-mono">
                  {doc.status}
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                GMNI Komisariat Wastukancana Purwakarta
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-btn transition-colors border border-stone-700"
              title="Salin Naskah Markdown"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin MD'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-btn transition-colors border border-stone-700"
              title="Unduh Berkas .md"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unduh</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-primary hover:bg-gmni-deep text-white rounded-btn transition-colors shadow-xs"
              title="Cetak Dokumen"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-btn hover:bg-stone-800 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 text-ink-primary font-sans print:p-0 print:space-y-6">
          
          {/* Official Document Header */}
          <div className="border-b-2 border-ink-primary pb-6 text-center space-y-2">
            <div className="flex justify-center mb-2">
              <div className="relative w-14 h-16">
                <Image
                  src="/assets/gmni/logo-gmni.png"
                  alt="Logo GMNI"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="text-xs font-bold tracking-widest text-ink-secondary uppercase">
              DEWAN PENGURUS KOMISARIAT
            </div>
            <div className="text-sm sm:text-base font-extrabold text-ink-primary tracking-wider uppercase">
              GERAKAN MAHASISWA NASIONAL INDONESIA (GMNI)
            </div>
            <div className="text-xs font-semibold text-primary uppercase">
              KOMISARIAT WASTUKANCANA – PURWAKARTA
            </div>
            <div className="text-[11px] text-ink-tertiary font-mono italic">
              "Pejuang Pemikir – Pemikir Pejuang"
            </div>
          </div>

          {/* Title & Metadata */}
          <div className="space-y-2 text-center pt-2">
            <h1 className="text-lg sm:text-xl font-extrabold text-ink-primary leading-tight">
              {doc.title}
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary font-medium italic max-w-2xl mx-auto">
              {doc.subtitle}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-3 pt-2 text-xs text-ink-tertiary font-mono">
              <span>Penyusun: <strong>{doc.author}</strong></span>
              <span>·</span>
              <span>Tanggal: <strong>{doc.date_created}</strong></span>
              <span>·</span>
              <span className="text-primary font-bold">STATUS: {doc.status}</span>
            </div>
          </div>

          <hr className="border-border" />

          {/* Section 1: Latar Belakang */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-ink-primary">
              I. Latar Belakang Masalah
            </h3>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed text-justify">
              {doc.sections.latar_belakang}
            </p>
          </div>

          {/* Section 2: Rumusan Masalah */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-ink-primary">
              II. Rumusan Masalah
            </h3>
            <ol className="list-decimal pl-5 space-y-1 text-xs sm:text-sm text-ink-secondary">
              {doc.sections.rumusan_masalah.map((r, idx) => (
                <li key={idx} className="leading-relaxed">{r}</li>
              ))}
            </ol>
          </div>

          {/* Section 3: Data & Fakta */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-ink-primary">
              III. Data & Fakta Terverifikasi
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-ink-secondary">
              {doc.sections.data_dan_fakta.map((d, idx) => (
                <li key={idx} className="leading-relaxed">{d}</li>
              ))}
            </ul>
          </div>

          {/* Section 4: Kronologi */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-ink-primary">
              IV. Kronologi Singkat
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-ink-secondary">
              {doc.sections.kronologi_singkat.map((k, idx) => (
                <li key={idx} className="leading-relaxed">{k}</li>
              ))}
            </ul>
          </div>

          {/* Section 5: Pihak Terkait */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-ink-primary">
              V. Pemetaan Pihak Terkait
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {doc.sections.pihak_terkait.map((p, idx) => (
                <div key={idx} className="p-2.5 bg-stone-50 border border-border rounded-btn">
                  <div className="font-bold text-ink-primary">{p.nama}</div>
                  <div className="text-ink-secondary text-[11px]">{p.peran} · Posisi: {p.posisi}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Analisis Sosial Politik */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-ink-primary">
              VI. Analisis Sosial Politik
            </h3>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed text-justify">
              {doc.sections.analisis_sosial_politik}
            </p>
          </div>

          {/* Section 7: Perspektif Marhaenisme */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-ink-primary">
              VII. Pisau Analisis Perspektif Marhaenisme GMNI
            </h3>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed text-justify">
              {doc.sections.perspektif_marhaenisme}
            </p>
          </div>

          {/* Section 8: Dampak Masyarakat */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-ink-primary">
              VIII. Dampak terhadap Kaum Marhaen
            </h3>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed text-justify">
              {doc.sections.dampak_masyarakat}
            </p>
          </div>

          {/* Section 9: Alternatif Kebijakan */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-ink-primary">
              IX. Alternatif Kebijakan Publik
            </h3>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-ink-secondary">
              {doc.sections.alternatif_kebijakan.map((alt, idx) => (
                <li key={idx} className="leading-relaxed">{alt}</li>
              ))}
            </ol>
          </div>

          {/* Section 10: Rekomendasi Advokasi */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-ink-primary">
              X. Rekomendasi Taktis & Advokasi
            </h3>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-ink-secondary">
              {doc.sections.rekomendasi_advokasi.map((rec, idx) => (
                <li key={idx} className="leading-relaxed">{rec}</li>
              ))}
            </ol>
          </div>

          {/* Section 11: Daftar Pustaka */}
          <div className="space-y-2 pt-4 border-t border-border">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-ink-primary">
              XI. Daftar Referensi
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-xs text-ink-secondary font-mono">
              {doc.sections.daftar_pustaka.map((p, idx) => (
                <li key={idx}>
                  <em>{p.title}</em>, {p.source} ({p.year})
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
