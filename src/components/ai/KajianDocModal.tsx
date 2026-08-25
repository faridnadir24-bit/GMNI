'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Printer, Download, Copy, Check, FileText, Share2, ShieldCheck, Sparkles } from 'lucide-react';
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
*Diterbitkan oleh Sistem Intelligence RUANG ISU GMNI Wastukancana Purwakarta*
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Top Control Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-9 shrink-0">
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
                <span className="text-[10px] bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded font-mono">
                  {doc.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                GMNI Komisariat Wastukancana Purwakarta
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
              title="Salin Naskah Markdown"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin MD'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
              title="Unduh Berkas .md"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unduh</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-xs"
              title="Cetak Dokumen"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 text-slate-900 font-sans print:p-0 print:space-y-6">
          
          {/* Official Document Header */}
          <div className="border-b-2 border-slate-900 pb-6 text-center space-y-2">
            <div className="flex justify-center mb-2">
              <div className="relative w-16 h-18">
                <Image
                  src="/assets/gmni/logo-gmni.png"
                  alt="Logo GMNI"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="text-xs font-bold tracking-widest text-slate-700 uppercase">
              DEWAN PENGURUS KOMISARIAT
            </div>
            <div className="text-sm sm:text-base font-extrabold text-slate-900 tracking-wider uppercase">
              GERAKAN MAHASISWA NASIONAL INDONESIA (GMNI)
            </div>
            <div className="text-xs font-semibold text-gmni-red uppercase">
              KOMISARIAT WASTUKANCANA – PURWAKARTA
            </div>
            <div className="text-[11px] text-slate-500 font-mono italic">
              "Pejuang Pemikir – Pemikir Pejuang"
            </div>
          </div>

          {/* Title & Metadata */}
          <div className="space-y-2 text-center pt-2">
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
              {doc.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium italic max-w-2xl mx-auto">
              {doc.subtitle}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-3 pt-2 text-xs text-slate-500 font-mono">
              <span>Penyusun: <strong>{doc.author}</strong></span>
              <span>•</span>
              <span>Tanggal: <strong>{doc.date_created}</strong></span>
              <span>•</span>
              <span className="text-gmni-red font-bold">STATUS: {doc.status}</span>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Section 1: Latar Belakang */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gmni-red" />
              I. Latar Belakang Masalah
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
              {doc.sections.latar_belakang}
            </p>
          </div>

          {/* Section 2: Rumusan Masalah */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gmni-red" />
              II. Rumusan Masalah & Pertanyaan Kunci
            </h3>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700">
              {doc.sections.rumusan_masalah.map((r, i) => (
                <li key={i} className="leading-relaxed">{r}</li>
              ))}
            </ol>
          </div>

          {/* Section 3: Data dan Fakta Terkonfirmasi */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              III. Data & Fakta Terkonfirmasi
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              {doc.sections.data_dan_fakta.map((d, i) => (
                <div key={i} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Kronologi */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gmni-red" />
              IV. Kronologi Peristiwa
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700">
              {doc.sections.kronologi_singkat.map((k, i) => (
                <li key={i} className="leading-relaxed">{k}</li>
              ))}
            </ul>
          </div>

          {/* Section 5: Pihak Terkait */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gmni-red" />
              V. Pemetaan Pihak Terkait (Stakeholders)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {doc.sections.pihak_terkait.map((p, i) => (
                <div key={i} className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-900">{p.nama}</div>
                  <div className="text-slate-500 text-[11px]">Peran: {p.peran}</div>
                  <div className="text-gmni-red text-[11px] font-medium mt-0.5">Sikap: {p.posisi}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Analisis Sosial Politik */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gmni-red" />
              VI. Analisis Sosial Politik
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
              {doc.sections.analisis_sosial_politik}
            </p>
          </div>

          {/* Section 7: Perspektif Marhaenisme GMNI */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gmni-red flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gmni-red" />
              VII. Pisau Analisis Perspektif Marhaenisme GMNI
            </h3>
            <div className="p-4 bg-red-50/70 border border-red-200 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed space-y-2">
              <p>{doc.sections.perspektif_marhaenisme}</p>
              <div className="pt-2 border-t border-red-200 text-xs text-slate-700">
                <strong>Dampak terhadap Kaum Marhaen:</strong> {doc.sections.dampak_masyarakat}
              </div>
            </div>
          </div>

          {/* Section 8: Alternatif Kebijakan */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gmni-red" />
              VIII. Alternatif Kebijakan Publik yang Ditawarkan
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {doc.sections.alternatif_kebijakan.map((alt, i) => (
                <li key={i} className="flex items-start gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{alt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 9: Rekomendasi Advokasi */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gmni-red" />
              IX. Rekomendasi Langkah Taktis & Advokasi GMNI
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700">
              {doc.sections.rekomendasi_advokasi.map((rec, i) => (
                <li key={i} className="leading-relaxed font-semibold text-slate-800">{rec}</li>
              ))}
            </ul>
          </div>

          {/* Section 10: Daftar Referensi */}
          <div className="space-y-2 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              X. Daftar Pustaka & Rujukan Sumber Data
            </h3>
            <ul className="space-y-1 text-xs text-slate-600 font-mono">
              {doc.sections.daftar_pustaka.map((p, i) => (
                <li key={i}>
                  [{i + 1}] {p.title} — <em>{p.source}</em> ({p.year})
                </li>
              ))}
            </ul>
          </div>

          {/* Document Signatures Footer */}
          <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-2 text-center text-xs gap-4 print:pt-6">
            <div>
              <p className="text-slate-500">Mengetahui,</p>
              <p className="font-bold text-slate-900 mt-0.5">Pengurus DPK GMNI Wastukancana</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-[10px] font-mono text-slate-400 border border-dashed px-3 py-1 rounded">
                  [STAMPEL RESMI KOMISARIAT]
                </span>
              </div>
              <p className="font-bold text-slate-800 underline">Ketua Komisariat</p>
            </div>
            <div>
              <p className="text-slate-500">Penyusun Naskah,</p>
              <p className="font-bold text-slate-900 mt-0.5">Bidang Sosial Politik</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-[10px] font-mono text-slate-400 border border-dashed px-3 py-1 rounded">
                  [TANDA TANGAN ELEKTRONIK]
                </span>
              </div>
              <p className="font-bold text-slate-800 underline">Kabid Sosial Politik</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
