'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  FileText, 
  Lock, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  HelpCircle, 
  Scale, 
  Check, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Activity,
  GitCommit
} from 'lucide-react';
import { Issue, UserRole, ResearchDossier, DiscussionBrief } from '@/types';
import { useApp } from '@/context/AppContext';
import { hasPermission, getAvailableDepthLevels, IssueExplanationDepthLevel, ROLE_CONFIGS } from '@/lib/services/permissions';
import { generateDiscussionBrief, generateResearchDossier } from '@/lib/services/dossier-engine';
import DiscussionBriefModal from '@/components/issue/DiscussionBriefModal';
import DossierView from '@/components/issue/DossierView';
import ConfidenceExplainer from '@/components/issue/ConfidenceExplainer';
import ContradictionSection from '@/components/issue/ContradictionSection';
import WhatChangedSection from '@/components/issue/WhatChangedSection';
import ScoreIndicator from '@/components/ui/ScoreIndicator';
import { formatDateIndo } from '@/lib/utils';

interface IssueExplanationDepthProps {
  issue: Issue;
}

export default function IssueExplanationDepth({ issue }: IssueExplanationDepthProps) {
  const { role, setRole, sources, claims } = useApp();
  const [activeDepth, setActiveDepth] = useState<IssueExplanationDepthLevel>('ringkas');
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [briefData, setBriefData] = useState<DiscussionBrief | null>(null);

  const depthOptions = getAvailableDepthLevels(role);
  const currentOption = depthOptions.find(o => o.level === activeDepth) || depthOptions[0];

  const handleCreateDiscussionBrief = () => {
    const brief = generateDiscussionBrief(issue, sources, claims);
    setBriefData(brief);
    setIsBriefModalOpen(true);
  };

  // Pre-generate / compute local dossier for immediate view
  const dossier = generateResearchDossier(
    issue, 
    sources, 
    claims, 
    `Pusat Kajian Kebijakan GMNI (${role.toUpperCase()})`
  );

  return (
    <div className="space-y-6">
      
      {/* 3-TIER EXPLANATION DEPTH SWITCHER BAR */}
      <div className="bg-surface rounded-card border border-border p-3 sm:p-4 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-ink-secondary">
              Tingkat Kedalaman Telaah Isu
            </span>
            <span className="text-[10px] px-1.5 py-0.2 bg-stone-100 border border-border rounded text-ink-tertiary">
              Mode Aktif: {ROLE_CONFIGS[role]?.shortLabel || role}
            </span>
          </div>
          <p className="text-xs text-ink-secondary hidden sm:block">
            Pilih tingkat penjelasan sesuai kebutuhan audiens publik, kader diskusi, atau tim peneliti advokasi.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-btn border border-border self-start md:self-auto">
          {depthOptions.map(opt => {
            const isCurrent = activeDepth === opt.level;
            return (
              <button
                key={opt.level}
                onClick={() => setActiveDepth(opt.level)}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-all flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-stone-200/60'
                }`}
              >
                {!opt.isUnlocked && <Lock className="w-3 h-3 text-stone-400" />}
                <span>{opt.title}</span>
                <span className={`text-[10px] font-mono px-1 py-0.2 rounded hidden sm:inline ${
                  isCurrent ? 'bg-stone-800 text-stone-300' : 'text-stone-500'
                }`}>
                  {opt.readingTime}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACCESS LOCKED BANNER (If Public tries to access Kader/Researcher depth) */}
      {!currentOption.isUnlocked && (
        <div className="p-6 bg-stone-50 border border-border rounded-card space-y-4 text-center">
          <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-sm font-bold text-ink-primary">
              Akses Khusus Internal: {currentOption.title}
            </h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Tingkat telaah ini memuat analisis struktural dan perspektif ideologis internal yang dirancang untuk {currentOption.requiredRole}.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              onClick={() => {
                if (activeDepth === 'analisis_mendalam') setRole('kader');
                if (activeDepth === 'dossier_riset') setRole('researcher');
              }}
              className="px-4 py-2 bg-primary hover:bg-gmni-deep text-white text-xs font-semibold rounded-btn transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ganti Mode Akses ke {activeDepth === 'analisis_mendalam' ? 'Kader' : 'Peneliti'}</span>
            </button>
            <button
              onClick={() => setActiveDepth('ringkas')}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-ink-primary text-xs font-semibold rounded-btn transition-colors"
            >
              Kembali ke Ringkas
            </button>
          </div>
        </div>
      )}

      {/* LEVEL 1: RINGKAS (PUBLIK) */}
      {currentOption.isUnlocked && activeDepth === 'ringkas' && (
        <div className="space-y-6">
          
          {/* Quick Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Apa yang terjadi? */}
            <div className="bg-surface rounded-card border border-border p-5 shadow-subtle space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Apa yang Terjadi?</span>
              </div>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                {issue.description}
              </p>
            </div>

            {/* Mengapa ini penting? */}
            <div className="bg-surface rounded-card border border-border p-5 shadow-subtle space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>Mengapa Ini Penting?</span>
              </div>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                Persoalan di wilayah {issue.location} memiliki Skor Dampak Kebijakan {issue.impact_score}/100 dan berimplikasi langsung terhadap keadilan sosial serta hajat hidup masyarakat di sektor {issue.category.toLowerCase()}.
              </p>
            </div>

            {/* Siapa yang terdampak? */}
            <div className="bg-surface rounded-card border border-border p-5 shadow-subtle space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <Users className="w-4 h-4" />
                <span>Siapa yang Terdampak?</span>
              </div>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                Masyarakat akar rumput, kelompok buruh/petani lokal di {issue.location}, serta pengguna layanan publik terkait yang menanggung eksternalitas ketimpangan kebijakan.
              </p>
            </div>

            {/* Perkembangan & Keyakinan Data */}
            <div className="bg-surface rounded-card border border-border p-5 shadow-subtle space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Validasi & Sumber Data</span>
              </div>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                Terverifikasi melalui {issue.sources_count} rujukan media dan dokumen publik dengan tingkat keyakinan data (Confidence) sebesar {issue.confidence_score || 75}%.
              </p>
            </div>

          </div>

          {/* Apa yang Berubah & Keyakinan Explainer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WhatChangedSection 
              changeSummary={issue.what_changed} 
              lastUpdatedAt={issue.last_updated_at} 
            />

            <ConfidenceExplainer 
              confidenceScore={issue.confidence_score || 75}
              evidenceScore={issue.evidence_score}
              sourcesCount={issue.sources_count}
              explanation={issue.confidence_meta}
            />
          </div>

          {/* Banner Ajakan untuk Kader jika ingin mendalami */}
          <div className="p-4 bg-stone-50 border border-border rounded-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-ink-secondary">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <span>Memerlukan analisis struktural, pisau analisis Marhaenisme, atau bahan diskusi?</span>
            </div>
            <button
              onClick={() => {
                setRole('kader');
                setActiveDepth('analisis_mendalam');
              }}
              className="font-semibold text-primary hover:underline shrink-0 inline-flex items-center gap-1"
            >
              <span>Buka Analisis Mendalam</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* LEVEL 2: ANALISIS MENDALAM (KADER & SOSPOL) */}
      {currentOption.isUnlocked && activeDepth === 'analisis_mendalam' && (
        <div className="space-y-6">
          
          {/* Kader Action Header */}
          <div className="bg-red-50/50 border border-red-200 rounded-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-red-900 uppercase tracking-wider">
                  Ruang Kerja Kader Komisariat
                </span>
                <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-[10px] font-semibold">
                  Analisis Level 2
                </span>
              </div>
              <p className="text-xs text-red-800">
                Gunakan telaah mendalam ini untuk membedah akar masalah dan memandu forum kajian komisariat.
              </p>
            </div>

            <button
              onClick={handleCreateDiscussionBrief}
              className="px-4 py-2 bg-primary hover:bg-gmni-deep text-white text-xs font-semibold rounded-btn transition-colors inline-flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Buat Bahan Diskusi (1-Halaman)</span>
            </button>
          </div>

          {/* Structural Analysis Card */}
          <div className="bg-surface rounded-card border border-border p-6 shadow-subtle space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Scale className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold text-ink-primary">
                1. Analisis Struktural & Relasi Kekuasaan
              </h3>
            </div>
            
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              Persoalan "{issue.title}" di {issue.location} mencerminkan implementasi kebijakan yang timpang. Data menunjukkan bahwa alokasi sumber daya dan perlindungan hukum belum menyentuh hak-hak mendasar masyarakat lapisan bawah secara optimal.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-stone-50 rounded border border-border/80 space-y-1 text-xs">
                <div className="font-bold text-ink-primary">Akar Masalah (Root Cause)</div>
                <div className="text-ink-secondary leading-relaxed">
                  Celah regulasi dan lemahnya mekanisme pengawasan publik yang memberi ruang terjadinya pengabaian hak-hak warga.
                </div>
              </div>

              <div className="p-3.5 bg-stone-50 rounded border border-border/80 space-y-1 text-xs">
                <div className="font-bold text-ink-primary">Ketimpangan Relasi Kuasa</div>
                <div className="text-ink-secondary leading-relaxed">
                  Masyarakat terdampak memiliki posisi tawar rendah dibanding pemegang otoritas dan pemilik modal.
                </div>
              </div>
            </div>
          </div>

          {/* Perspektif GMNI Card */}
          <div className="bg-surface rounded-card border border-border p-6 shadow-subtle space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold text-ink-primary">
                2. Tinjauan Perspektif Marhaenisme & Trisakti
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 bg-stone-50 rounded border border-border/80 space-y-1 text-xs">
                <div className="font-bold text-primary">Sosio-Nasionalisme</div>
                <div className="text-ink-secondary leading-relaxed">
                  Menuntut kebijakan berorientasi kemanusiaan yang adil, menolak penindasan ekonomi di {issue.location}.
                </div>
              </div>

              <div className="p-3.5 bg-stone-50 rounded border border-border/80 space-y-1 text-xs">
                <div className="font-bold text-primary">Sosio-Demokrasi</div>
                <div className="text-ink-secondary leading-relaxed">
                  Kedaulatan politik harus diiringi keadilan ekonomi kerakyatan dan perlindungan kaum tertindas.
                </div>
              </div>

              <div className="p-3.5 bg-stone-50 rounded border border-border/80 space-y-1 text-xs">
                <div className="font-bold text-primary">Trisakti Bung Karno</div>
                <div className="text-ink-secondary leading-relaxed">
                  Berdikari secara ekonomi, berdaulat dalam politik, dan berkepribadian dalam kebudayaan gotong royong.
                </div>
              </div>
            </div>
          </div>

          {/* Contradiction & Evidence Split */}
          <ContradictionSection 
            contradictions={issue.contradictions}
          />

          {/* 8 Dimensi Pertanyaan Kajian */}
          <div className="bg-surface rounded-card border border-border p-6 shadow-subtle space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <HelpCircle className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold text-ink-primary">
                3. Pertanyaan Kajian Kritis (8 Dimensi Analitis)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
              {[
                { cat: 'Kausal', q: `Apa faktor pemicu utama meletusnya krisis ${issue.title}?` },
                { cat: 'Kebijakan', q: 'Di mana letak celah aturan yang menyebabkan kegagalan pengawasan di lapangan?' },
                { cat: 'Sosial', q: `Bagaimana ketahanan sosial warga terdampak di wilayah ${issue.location}?` },
                { cat: 'Ekonomi', q: 'Berapa taksiran beban ekonomi riil yang ditanggung keluarga masyarakat bawah?' },
                { cat: 'Tata Kelola', q: 'Apakah ada indikasi konflik kepentingan dalam proses penerbitan izin/kebijakan?' },
                { cat: 'Hukum', q: 'Pasal dan regulasi mana yang berpotensi dilanggar dalam kasus ini?' },
                { cat: 'Teritorial', q: `Bagaimana implikasi spasial terhadap tata ruang di ${issue.location}?` },
                { cat: 'Struktural', q: 'Bagaimana membongkar dominasi elitis yang mengabaikan kepentingan rakyat?' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-stone-50 rounded border border-border/80 space-y-0.5">
                  <div className="font-mono text-[10px] font-bold text-primary uppercase">
                    Dimensi {item.cat}
                  </div>
                  <div className="text-ink-primary font-medium">
                    {item.q}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* LEVEL 3: RESEARCH DOSSIER (PENELITI & ADVOKASI) */}
      {currentOption.isUnlocked && activeDepth === 'dossier_riset' && (
        <DossierView 
          dossier={dossier}
          issue={issue}
        />
      )}

      {/* DISCUSSION BRIEF MODAL */}
      <DiscussionBriefModal 
        isOpen={isBriefModalOpen}
        onClose={() => setIsBriefModalOpen(false)}
        brief={briefData}
        issue={issue}
      />

    </div>
  );
}
