'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Sparkles, 
  FileText, 
  Copy, 
  Check, 
  ExternalLink,
  Info,
  Layers,
  HelpCircle,
  Users,
  Scale,
  Award,
  BookOpen
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { runAIAnalysis, AIAnalysisResult } from '@/lib/aiEngine';
import LocationBadge from '@/components/ui/LocationBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import KajianDocModal from '@/components/ai/KajianDocModal';
import { BahanKajianDocument } from '@/types';
import { mockKajianDocs } from '@/data/mockKajian';
import { formatDateIndo } from '@/lib/utils';

function AIAnalystContent() {
  const searchParams = useSearchParams();
  const initialIssueId = searchParams.get('issue') || 'issue-pwk-01';

  const { issues, sources, claims, addKajianDoc } = useApp();
  const [selectedIssueId, setSelectedIssueId] = useState(initialIssueId);
  const [activeAction, setActiveAction] = useState<string>('summarize');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [isKajianModalOpen, setIsKajianModalOpen] = useState(false);
  const [activeKajianDoc, setActiveKajianDoc] = useState<BahanKajianDocument | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  const selectedIssue = issues.find(i => i.id === selectedIssueId) || issues[0];
  const issueSources = sources.filter(s => s.issue_id === selectedIssue.id);
  const issueClaims = claims.filter(c => c.issue_id === selectedIssue.id);

  useEffect(() => {
    handleRunAction(activeAction);
  }, [selectedIssueId, activeAction]);

  const handleRunAction = (actionKey: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const res = runAIAnalysis(selectedIssueId, actionKey, selectedIssue, issueSources, issueClaims);
      setAnalysisResult(res);
      setIsLoading(false);
    }, 150);
  };

  const researchTools = [
    { id: 'summarize', num: '01', title: 'Ringkas isu', desc: 'Sintesis fakta pokok dan kelompok terdampak' },
    { id: 'compare_sources', num: '02', title: 'Bandingkan sumber', desc: 'Komparasi silang narasi resmi vs media' },
    { id: 'compare_sources', num: '03', title: 'Temukan kontradiksi', desc: 'Identifikasi ketidaksesuaian data antar rilis' },
    { id: 'find_missing_data', num: '04', title: 'Identifikasi celah data', desc: 'Deteksi informasi yang belum dirilis publik' },
    { id: 'identify_stakeholders', num: '05', title: 'Petakan aktor', desc: 'Analisis posisi regulator, korporasi, dan warga' },
    { id: 'generate_research_questions', num: '06', title: 'Buat pertanyaan kajian', desc: '8 dimensi pertanyaan dialektis untuk advokasi' },
    { id: 'recommend_research', num: '07', title: 'Evaluasi kelayakan kajian', desc: 'Skor rubrik apakah layak dijadikan policy paper' },
    { id: 'marhaenism_framework', num: '08', title: 'Susun kerangka kajian', desc: 'Uji Sosio-Nasionalisme, Demokrasi & Trisakti' },
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

  const handleCopyAnalysis = () => {
    if (!analysisResult) return;
    const textToCopy = `=== ${analysisResult.title} ===\nIsu: ${selectedIssue.title}\nWilayah: ${selectedIssue.location}\n\n${analysisResult.content.overview || ''}\n\n${analysisResult.content.points?.map(p => `- ${p.title}: ${p.desc}`).join('\n') || ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-ink-primary">
              AI Issue Analyst
            </h1>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-muted text-ink-secondary border border-border">
              Ruang Kerja Peneliti
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-secondary mt-1">
            Analisis berbasis sumber yang tersedia. AI tidak menggantikan verifikasi peneliti.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAnalysis}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-surface hover:bg-muted text-ink-secondary text-xs rounded-btn border border-border transition-colors"
          >
            {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedText ? 'Tersalin' : 'Salin Naskah'}</span>
          </button>

          <button
            onClick={handleGenerateFullKajian}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-ink-primary hover:bg-black text-white text-xs font-semibold rounded-btn transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Naskah Bahan Kajian</span>
          </button>
        </div>
      </div>

      {/* 3-COLUMN RESEARCH WORKSTATION LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Issue Context & Sources (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Issue Selector Card */}
          <div className="bg-surface rounded-card border border-border p-4 space-y-3 shadow-subtle">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-ink-secondary">
              Pilih Isu:
            </label>
            <select
              value={selectedIssueId}
              onChange={e => setSelectedIssueId(e.target.value)}
              className="w-full p-2 bg-muted/60 border border-border rounded-btn text-xs font-medium text-ink-primary focus:outline-none focus:bg-surface focus:border-stone-400"
            >
              {issues.map(iss => (
                <option key={iss.id} value={iss.id}>
                  {iss.location.toLowerCase().includes('purwakarta') ? '[Pwk] ' : '[Nas] '}
                  {iss.title}
                </option>
              ))}
            </select>

            <div className="pt-2 border-t border-border space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-ink-tertiary">Lokasi:</span>
                <span className="font-medium text-ink-primary">{selectedIssue.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-tertiary">Kategori:</span>
                <span className="font-medium text-ink-primary">{selectedIssue.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-tertiary">Impact:</span>
                <span className="font-mono font-bold text-primary">{selectedIssue.impact_score}/100</span>
              </div>
            </div>
          </div>

          {/* Issue Summary Context */}
          <div className="bg-surface rounded-card border border-border p-4 space-y-2.5 shadow-subtle text-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-secondary">
              Ringkasan Awal
            </span>
            <p className="text-ink-secondary leading-relaxed line-clamp-4">
              {selectedIssue.description}
            </p>
          </div>

          {/* Linked Sources List */}
          <div className="bg-surface rounded-card border border-border p-4 space-y-3 shadow-subtle">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-secondary">
                Rujukan Terdaftar ({issueSources.length})
              </span>
            </div>

            <div className="space-y-2">
              {issueSources.length === 0 ? (
                <p className="text-xs text-ink-tertiary italic">Tidak ada rujukan sumber.</p>
              ) : (
                issueSources.map((src, idx) => (
                  <div key={src.id} className="p-2 bg-stone-50/70 rounded-btn border border-border text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-ink-tertiary">
                      <span className="font-mono font-bold text-ink-primary">[{idx + 1}]</span>
                      <span>Kredibilitas: {src.credibility_score}%</span>
                    </div>
                    <div className="font-medium text-ink-primary line-clamp-1">{src.source_name}</div>
                    <div className="text-ink-secondary line-clamp-1 text-[10px]">{src.title}</div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* CENTER COLUMN: Analysis Workspace Document View (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-4">
          
          <div className="bg-surface rounded-card border border-border p-6 sm:p-8 space-y-6 shadow-subtle">
            
            {/* Document Header Bar */}
            <div className="space-y-3 border-b border-border pb-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <LocationBadge location={selectedIssue.location} district={selectedIssue.district} size="sm" />
                <div className="flex items-center gap-2 text-ink-tertiary font-mono text-[11px]">
                  <span>Sumber: {issueSources.length}</span>
                  <span>·</span>
                  <span>Update: {formatDateIndo(selectedIssue.last_updated_at)}</span>
                  <span>·</span>
                  <span className="text-emerald-700 font-semibold">Keyakinan: Tinggi</span>
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-ink-primary leading-snug">
                {analysisResult?.title || 'Memuat Hasil Analisis...'}
              </h2>
            </div>

            {/* Document Body */}
            {isLoading ? (
              <div className="py-16 text-center space-y-2 text-xs text-ink-secondary font-mono">
                <p>Memproses data rujukan dan menyusun naskah analisis...</p>
              </div>
            ) : analysisResult ? (
              <div className="space-y-6 text-xs sm:text-sm text-ink-primary">
                
                {/* Paragraph Overview */}
                {analysisResult.content.overview && (
                  <div className="space-y-2">
                    <p className="text-ink-secondary leading-relaxed">
                      {analysisResult.content.overview}
                    </p>
                  </div>
                )}

                {/* Structured Points / Facts */}
                {analysisResult.content.points && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-ink-primary">
                      Fakta Pokok & Temuan Terstruktur
                    </h3>
                    <div className="space-y-2">
                      {analysisResult.content.points.map((pt, idx) => (
                        <div key={idx} className="p-3.5 bg-stone-50/70 rounded-btn border border-border space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <h4 className="font-bold text-ink-primary">{pt.title}</h4>
                            {pt.badge && (
                              <span className="text-[10px] text-ink-tertiary font-medium">{pt.badge}</span>
                            )}
                          </div>
                          <p className="text-xs text-ink-secondary leading-relaxed">{pt.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Discrepancies / Contradictions */}
                {analysisResult.content.discrepancies && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-ink-primary">
                      Klaim yang Perlu Diverifikasi / Deviasi Data
                    </h3>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-ink-secondary">
                      {analysisResult.content.discrepancies.map((disc, idx) => (
                        <li key={idx} className="leading-relaxed">{disc}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Data Gaps */}
                {analysisResult.content.missing_data && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-ink-primary">
                      Celah Data (Data Gap)
                    </h3>
                    <ol className="list-decimal pl-5 space-y-1 text-xs text-ink-secondary">
                      {analysisResult.content.missing_data.map((gap, idx) => (
                        <li key={idx} className="leading-relaxed">{gap}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Research Questions */}
                {analysisResult.content.research_questions && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-ink-primary">
                      Pertanyaan Penelitian & Advokasi
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {analysisResult.content.research_questions.map((rq, idx) => (
                        <div key={idx} className="p-3 bg-stone-50/70 rounded-btn border border-border space-y-1">
                          <span className="text-[10px] font-semibold text-primary uppercase">{rq.dimension}</span>
                          <p className="text-xs text-ink-secondary leading-snug">{rq.question}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendation Score */}
                {analysisResult.content.recommendation && (
                  <div className="space-y-3 pt-2 border-t border-border">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-ink-primary">
                      Hasil Evaluasi Kelayakan
                    </h3>
                    <div className="p-4 bg-stone-50 rounded-btn border border-border space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-ink-primary">
                          Keputusan: {analysisResult.content.recommendation.verdict}
                        </span>
                        <span className="font-mono font-bold text-primary">
                          {analysisResult.content.recommendation.score}/100
                        </span>
                      </div>
                      <ul className="list-disc pl-5 space-y-1 text-ink-secondary">
                        {analysisResult.content.recommendation.reasoning.map((r, idx) => (
                          <li key={idx}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Marhaenism Analysis */}
                {analysisResult.content.marhaenism && (
                  <div className="space-y-3 pt-2 border-t border-border">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-ink-primary">
                      Kerangka Analisis Marhaenisme GMNI
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                      <div className="p-3 bg-stone-50/70 rounded-btn border border-border space-y-1">
                        <span className="text-[10px] font-bold uppercase text-ink-tertiary">Sosio-Nasionalisme</span>
                        <p className="text-ink-secondary leading-snug">{analysisResult.content.marhaenism.sosio_nasionalisme}</p>
                      </div>
                      <div className="p-3 bg-stone-50/70 rounded-btn border border-border space-y-1">
                        <span className="text-[10px] font-bold uppercase text-ink-tertiary">Sosio-Demokrasi</span>
                        <p className="text-ink-secondary leading-snug">{analysisResult.content.marhaenism.sosio_demokrasi}</p>
                      </div>
                      <div className="p-3 bg-stone-50/70 rounded-btn border border-border space-y-1">
                        <span className="text-[10px] font-bold uppercase text-ink-tertiary">Trisakti</span>
                        <p className="text-ink-secondary leading-snug">{analysisResult.content.marhaenism.trisakti}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Source Citations Footnote */}
                <div className="pt-6 border-t border-border/80 space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary">
                    Daftar Rujukan Pendukung
                  </span>
                  {issueSources.length === 0 ? (
                    <p className="text-xs text-ink-tertiary italic">Tidak tersedia sumber pendukung.</p>
                  ) : (
                    <div className="space-y-1 text-[11px] text-ink-secondary font-mono">
                      {issueSources.map((s, idx) => (
                        <div key={s.id} className="flex items-baseline gap-1.5">
                          <span className="text-ink-tertiary">[{idx + 1}]</span>
                          <span className="font-medium text-ink-primary">{s.source_name}</span>
                          <span className="text-ink-tertiary">·</span>
                          <span>{formatDateIndo(s.published_at)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            ) : null}

          </div>

        </div>

        {/* RIGHT COLUMN: Research Tools Action List (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-3">
          
          <div className="bg-surface rounded-card border border-border p-4 space-y-3 shadow-subtle">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-secondary pb-2 border-b border-border">
              RESEARCH TOOLS
            </div>

            <div className="space-y-1">
              {researchTools.map(tool => {
                const isActive = activeAction === tool.id;
                return (
                  <button
                    key={tool.num}
                    onClick={() => setActiveAction(tool.id)}
                    className={`w-full text-left p-2.5 rounded-btn transition-all flex items-start gap-2.5 text-xs ${
                      isActive
                        ? 'border-l-2 border-primary bg-stone-100 text-ink-primary font-semibold'
                        : 'text-ink-secondary hover:text-ink-primary hover:bg-muted/60'
                    }`}
                  >
                    <span className="font-mono text-ink-tertiary text-[11px] shrink-0 mt-0.5">
                      {tool.num}
                    </span>
                    <div className="space-y-0.5">
                      <div className="leading-snug text-ink-primary">
                        {tool.title}
                      </div>
                      <div className="text-[10px] text-ink-tertiary line-clamp-1 leading-none">
                        {tool.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-card border border-border text-[11px] text-ink-secondary space-y-1.5">
            <div className="font-semibold text-ink-primary">Pedoman Kerja Riset:</div>
            <p className="leading-relaxed">
              Seluruh sintesis data disusun untuk memfasilitasi kader dalam menyusun naskah advokasi kebijakan publik.
            </p>
          </div>

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
      <div className="p-16 text-center text-xs text-ink-secondary font-mono">
        Memuat Workspace AI Issue Analyst...
      </div>
    }>
      <AIAnalystContent />
    </Suspense>
  );
}
