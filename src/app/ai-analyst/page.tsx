'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  Sparkles, 
  BookOpen, 
  Layers, 
  Scale, 
  HelpCircle, 
  Users, 
  Award, 
  FileText, 
  Copy, 
  Check, 
  Printer, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Database,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { runAIAnalysis, AIAnalysisResult } from '@/lib/aiEngine';
import KajianDocModal from '@/components/ai/KajianDocModal';
import { BahanKajianDocument } from '@/types';
import { mockKajianDocs } from '@/data/mockKajian';

function AIAnalystContent() {
  const searchParams = useSearchParams();
  const initialIssueId = searchParams.get('issue') || 'issue-pwk-01';

  const { issues, addKajianDoc } = useApp();
  const [selectedIssueId, setSelectedIssueId] = useState(initialIssueId);
  const [activeAction, setActiveAction] = useState<string>('summarize');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [isKajianModalOpen, setIsKajianModalOpen] = useState(false);
  const [activeKajianDoc, setActiveKajianDoc] = useState<BahanKajianDocument | null>(null);

  const selectedIssue = issues.find(i => i.id === selectedIssueId) || issues[0];

  useEffect(() => {
    handleRunAction(activeAction);
  }, [selectedIssueId, activeAction]);

  const handleRunAction = (actionKey: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const res = runAIAnalysis(selectedIssueId, actionKey);
      setAnalysisResult(res);
      setIsLoading(false);
    }, 250);
  };

  const aiActions = [
    { id: 'summarize', name: 'Ringkas & Struktur Fakta', icon: BookOpen, desc: 'Sintesis fakta, pisahkan klaim, identifikasi terdampak' },
    { id: 'compare_sources', name: 'Komparasi Antar Sumber', icon: Layers, desc: 'Temukan kesamaan, deviasi narasi, & kontradiksi data' },
    { id: 'find_missing_data', name: 'Deteksi Celah Data (Gap)', icon: HelpCircle, desc: 'Identifikasi data publik yang belum tersedia' },
    { id: 'identify_stakeholders', name: 'Pemetaan Relasi Aktor', icon: Users, desc: 'Analisis relasi kuasa regulator, korporasi, & masyarakat' },
    { id: 'generate_research_questions', name: '8 Dimensi Pertanyaan', icon: HelpCircle, desc: 'Pertanyaan kajian dialektis untuk tim advokasi' },
    { id: 'recommend_research', name: 'Rekomendasi Kelayakan', icon: Award, desc: 'Skor rubrik apakah layak dijadikan policy paper' },
    { id: 'marhaenism_framework', name: '🚩 Analisis Marhaenisme GMNI', icon: Scale, desc: 'Uji Sosio-Nasionalisme, Demokrasi, & Trisakti' },
    { id: 'generate_kajian_outline', name: '📄 Draf Bahan Kajian', icon: FileText, desc: 'Generate naskah policy brief akademik terstruktur' },
  ];

  const handleGenerateFullKajian = () => {
    const existing = mockKajianDocs.find(k => k.issue_id === selectedIssue.id);
    if (existing) {
      setActiveKajianDoc(existing);
    } else {
      const newDoc: BahanKajianDocument = {
        id: `kajian-${Date.now()}`,
        issue_id: selectedIssue.id,
        issue_title: selectedIssue.title,
        title: `Naskah Kebijakan: Penanganan Strategis ${selectedIssue.title}`,
        subtitle: `Kajian Kebijakan Bidang Sosial Politik GMNI Komisariat Wastukancana Purwakarta`,
        author: 'Bidang Sosial Politik GMNI Wastukancana',
        komisariat: 'GMNI Komisariat Wastukancana – Purwakarta',
        date_created: new Date().toISOString().slice(0, 10),
        status: 'Draft',
        sections: {
          latar_belakang: selectedIssue.summary_ai.what_happened + ' ' + selectedIssue.summary_ai.why_important,
          rumusan_masalah: [
            `Bagaimana akar persoalan ${selectedIssue.title}?`,
            `Siapa kelompok masyarakat yang paling rentan terdampak?`,
            `Apa rekomendasi alternatif kebijakan advokasi GMNI?`
          ],
          data_dan_fakta: [
            selectedIssue.summary_ai.what_happened,
            `Dampak terverifikasi pada ${selectedIssue.summary_ai.who_is_affected.join(', ')}`
          ],
          kronologi_singkat: [
            `Terdeteksi: ${selectedIssue.first_detected_at.slice(0, 10)}`,
            `Pembaruan terakhir: ${selectedIssue.last_updated_at.slice(0, 10)}`
          ],
          pihak_terkait: selectedIssue.summary_ai.key_stakeholders.flatMap(s => s.entities.map(e => ({ nama: e, peran: s.category, posisi: 'Terkait' }))),
          analisis_sosial_politik: selectedIssue.marhaenism_analysis.sosio_demokrasi,
          perspektif_marhaenisme: selectedIssue.marhaenism_analysis.sosio_nasionalisme,
          dampak_masyarakat: selectedIssue.summary_ai.who_is_affected.join('; '),
          alternatif_kebijakan: [
            'Moratorium kebijakan sepihak dan pembukaan ruang dengar pendapat publik secara partisipatif.',
            'Penyusunan regulasi perlindungan afirmatif bagi kelompok rentan dan masyarakat lokal.'
          ],
          rekomendasi_advokasi: [
            'Menyerahkan naskah policy paper kepada DPRD dan instansi terkait.',
            'Membuka forum konsolidasi kader dan aliansi masyarakat terdampak.'
          ],
          daftar_pustaka: [
            { title: `Dokumen Terkait ${selectedIssue.title}`, source: 'Arsip Riset GMNI Wastukancana', year: '2026' }
          ]
        }
      };
      addKajianDoc(newDoc);
      setActiveKajianDoc(newDoc);
    }
    setIsKajianModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
              AI Issue Analyst & Workspace Kajian
            </h1>
            <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
              NON-GENERIC ENGINE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Asisten cerdas riset sosial-politik untuk membedah data, menguji kontradiksi, dan merumuskan argumen kerakyatan.
          </p>
        </div>

        <button
          onClick={handleGenerateFullKajian}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gmni-red hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>Jadikan Bahan Kajian Siap Cetak</span>
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Select Issue & 8 Action Triggers */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Issue Selector Dropdown */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-3">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Pilih Isu yang Dianalisis:
            </label>
            <select
              value={selectedIssueId}
              onChange={e => setSelectedIssueId(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              {issues.map(iss => (
                <option key={iss.id} value={iss.id}>
                  {iss.location.toLowerCase().includes('purwakarta') ? '🔴 [Purwakarta] ' : '[Nasional] '}
                  {iss.title}
                </option>
              ))}
            </select>

            <div className="pt-2 text-[11px] text-slate-500 space-y-1">
              <div><strong>Kategori:</strong> {selectedIssue.category}</div>
              <div><strong>Wilayah:</strong> {selectedIssue.location} ({selectedIssue.province})</div>
              <div><strong>Impact Score:</strong> <span className="text-red-600 font-bold">{selectedIssue.impact_score}/100</span></div>
            </div>
          </div>

          {/* 8 AI Action Buttons */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-3">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. Pilih Modul Analisis AI:
            </label>

            <div className="space-y-1.5">
              {aiActions.map(act => {
                const Icon = act.icon;
                const isSelected = activeAction === act.id;
                return (
                  <button
                    key={act.id}
                    onClick={() => setActiveAction(act.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-1 ring-red-500'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`} />
                    <div>
                      <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {act.name}
                      </div>
                      <div className={`text-[10px] leading-snug mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {act.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: AI Output Command Center */}
        <div className="lg:col-span-8 space-y-6">
          
          {isLoading ? (
            <div className="bg-white p-16 rounded-3xl border border-slate-200 shadow-subtle text-center space-y-4">
              <RefreshCw className="w-8 h-8 text-gmni-red animate-spin mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">
                AI Sedang Mensintesis Seluruh Sumber Data...
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Memverifikasi silang dokumen resmi, menyaring klaim sepihak, dan menerapkan pisau analisis Marhaenisme.
              </p>
            </div>
          ) : analysisResult ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-subtle space-y-6 animate-in fade-in duration-150">
              
              {/* Output Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-red-100 text-gmni-red font-mono uppercase">
                      {analysisResult.badge}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(analysisResult.timestamp).toLocaleTimeString('id-ID')} WIB
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-sans mt-1">
                    {analysisResult.title}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Isu: <span className="font-semibold text-slate-700">{analysisResult.issueTitle}</span>
                  </p>
                </div>
              </div>

              {/* Dynamic Content Views based on Action */}
              <div className="space-y-6">
                
                {/* Overview Text */}
                {analysisResult.content.overview && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {analysisResult.content.overview}
                  </div>
                )}

                {/* Structured Points */}
                {analysisResult.content.points && (
                  <div className="space-y-3">
                    {analysisResult.content.points.map((pt, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900">{pt.title}</h4>
                          {pt.badge && (
                            <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {pt.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{pt.desc}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Discrepancies */}
                {analysisResult.content.discrepancies && (
                  <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Deteksi Perbedaan Data Antar Sumber:</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-amber-950">
                      {analysisResult.content.discrepancies.map((disc, idx) => (
                        <li key={idx}>{disc}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Missing Data List */}
                {analysisResult.content.missing_data && (
                  <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      <HelpCircle className="w-4 h-4" />
                      <span>Daftar Celah Informasi yang Perlu Dicari Kader:</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300 pt-1">
                      {analysisResult.content.missing_data.map((m, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold font-mono">[{idx + 1}]</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 8 Research Questions Matrix */}
                {analysisResult.content.research_questions && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {analysisResult.content.research_questions.map((rq, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold text-gmni-red font-mono">
                          <span>{rq.dimension}</span>
                          <span className="text-slate-500">Prioritas: {rq.priority}</span>
                        </div>
                        <p className="text-xs text-slate-800 font-medium leading-snug">{rq.question}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recommendation Score Rubric */}
                {analysisResult.content.recommendation && (
                  <div className="space-y-4">
                    <div className="p-5 bg-gradient-to-r from-red-900 to-slate-900 text-white rounded-2xl flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-mono uppercase text-red-300">Keputusan Kelayakan:</div>
                        <div className="text-xl font-extrabold text-white">{analysisResult.content.recommendation.verdict}</div>
                      </div>
                      <div className="text-3xl font-extrabold font-mono text-amber-300">
                        {analysisResult.content.recommendation.score}<span className="text-sm font-normal text-slate-400">/100</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-900">Alasan & Pertimbangan Rubrik:</div>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {analysisResult.content.recommendation.reasoning.map((r, i) => (
                          <li key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Marhaenism Analysis View */}
                {analysisResult.content.marhaenism && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3.5 bg-red-50/70 border border-red-200 rounded-xl space-y-1">
                        <h4 className="font-bold text-red-900 uppercase">Sosio-Nasionalisme</h4>
                        <p className="text-slate-700">{analysisResult.content.marhaenism.sosio_nasionalisme}</p>
                      </div>
                      <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                        <h4 className="font-bold text-amber-900 uppercase">Sosio-Demokrasi</h4>
                        <p className="text-slate-700">{analysisResult.content.marhaenism.sosio_demokrasi}</p>
                      </div>
                      <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-xl space-y-1">
                        <h4 className="font-bold text-slate-900 uppercase">Trisakti</h4>
                        <p className="text-slate-700">{analysisResult.content.marhaenism.trisakti}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-red-950 text-white rounded-xl space-y-1.5">
                      <div className="text-xs font-bold text-red-300">Catatan Pembelaan Kaum Marhaen:</div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {analysisResult.content.marhaenism.pro_poor_defense}
                      </p>
                    </div>
                  </div>
                )}

                {/* Draf Kajian View Trigger */}
                {analysisResult.content.kajian_draft && (
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
                    <FileText className="w-8 h-8 text-gmni-red mx-auto" />
                    <h4 className="text-sm font-bold text-slate-900">
                      Naskah Bahan Kajian Lengkap Berhasil Disusun AI
                    </h4>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      Mengintegrasikan 10 bab: Latar Belakang, Rumusan Masalah, Fakta/Klaim, Kronologi, Analisis SosPol, Alternatif Kebijakan, Rekomendasi Advokasi, dan Referensi.
                    </p>
                    <button
                      onClick={handleGenerateFullKajian}
                      className="px-5 py-2.5 bg-gmni-red hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs"
                    >
                      Buka & Cetak Naskah Lengkap
                    </button>
                  </div>
                )}

              </div>

            </div>
          ) : null}

        </div>

      </div>

      {/* Modal Kajian Preview */}
      {activeKajianDoc && (
        <KajianDocModal
          doc={activeKajianDoc}
          isOpen={isKajianModalOpen}
          onClose={() => setIsKajianModalOpen(false)}
        />
      )}

    </div>
  );
}

export default function AIAnalystPage() {
  return (
    <Suspense fallback={
      <div className="p-16 text-center text-xs text-slate-500 font-mono">
        Memuat Workspace AI Issue Analyst...
      </div>
    }>
      <AIAnalystContent />
    </Suspense>
  );
}
