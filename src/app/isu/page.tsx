'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  X, 
  BookOpen, 
  ArrowRight
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Issue, IssueStatus } from '@/types';
import { formatDateIndo } from '@/lib/utils';
import TerritorySelector from '@/components/ui/TerritorySelector';
import { filterIssuesByTerritory, TerritoryScope } from '@/lib/services/territory-service';
import LocationBadge from '@/components/ui/LocationBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import ScoreIndicator from '@/components/ui/ScoreIndicator';

export default function IssueDirectoryPage() {
  const { issues, addIssue, role } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTerritory, setSelectedTerritory] = useState<TerritoryScope>('purwakarta');
  const [selectedSubTerritory, setSelectedSubTerritory] = useState<string>('Semua Kecamatan');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'impact' | 'urgency' | 'momentum' | 'latest'>('impact');

  // Add Issue Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLocation, setNewLocation] = useState('Purwakarta');
  const [newDistrict, setNewDistrict] = useState('Kec. Purwakarta');
  const [newCategory, setNewCategory] = useState('Keamanan');
  const [newStatus, setNewStatus] = useState<IssueStatus>('Developing');
  const [newImpact, setNewImpact] = useState(85);

  const categories = [
    'Sosial',
    'Politik',
    'Ekonomi',
    'Hukum',
    'Pendidikan',
    'Kesehatan',
    'Lingkungan',
    'Ketenagakerjaan',
    'Agraria',
    'Keamanan',
    'Pemerintahan'
  ];

  const territoryCounts = useMemo(() => ({
    purwakarta: filterIssuesByTerritory(issues, 'purwakarta').length,
    jabar: filterIssuesByTerritory(issues, 'jabar').length,
    nasional: filterIssuesByTerritory(issues, 'nasional').length,
  }), [issues]);

  const filteredIssues = useMemo(() => {
    // 1. Territory filtering via centralized territory service
    let result = filterIssuesByTerritory(issues, selectedTerritory, selectedSubTerritory);

    // 2. Search query filtering
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(issue => 
        issue.title.toLowerCase().includes(q) ||
        issue.description.toLowerCase().includes(q) ||
        issue.location.toLowerCase().includes(q) ||
        issue.category.toLowerCase().includes(q)
      );
    }

    // 3. Category filtering
    if (selectedCategory !== 'all') {
      result = result.filter(issue => issue.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // 4. Status filtering
    if (selectedStatus !== 'all') {
      result = result.filter(issue => issue.status === selectedStatus);
    }

    // 5. Sorting
    return result.sort((a, b) => {
      if (sortBy === 'impact') return b.impact_score - a.impact_score;
      if (sortBy === 'urgency') return b.urgency_score - a.urgency_score;
      if (sortBy === 'momentum') return b.momentum_score - a.momentum_score;
      if (sortBy === 'latest') return new Date(b.last_updated_at).getTime() - new Date(a.last_updated_at).getTime();
      return 0;
    });
  }, [issues, searchQuery, selectedTerritory, selectedSubTerritory, selectedCategory, selectedStatus, sortBy]);

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newIssue: Issue = {
      id: `issue-usr-${Date.now()}`,
      title: newTitle,
      slug,
      description: newDescription,
      category: newCategory,
      location: newLocation,
      province: newLocation === 'Purwakarta' ? 'Jawa Barat' : 'Nasional',
      district: newDistrict,
      status: newStatus,
      priority_level: newImpact >= 85 ? 'Tinggi' : newImpact >= 70 ? 'Sedang' : 'Rendah',
      impact_score: newImpact,
      urgency_score: Math.min(100, newImpact + 2),
      momentum_score: 75,
      evidence_score: 80,
      credibility_score: 85,
      confidence_score: 80,
      priority_score: newImpact >= 85 ? 90 : 78,
      mention_count: 5,
      first_detected_at: new Date().toISOString(),
      last_activity_at: new Date().toISOString(),
      last_updated_at: new Date().toISOString(),
      sources_count: 3,
      is_purwakarta_priority: newLocation.toLowerCase().includes('purwakarta'),
      summary_ai: {
        what_happened: newDescription,
        why_important: 'Isu ini memiliki implikasi kebijakan publik dan dampak langsung terhadap masyarakat.',
        who_is_affected: ['Masyarakat lokal terdampak', 'Pekerja dan keluarga'],
        key_stakeholders: [
          { category: 'Pemerintah / Regulator', entities: ['Pemerintah Daerah', 'Dinas Terkait'] },
          { category: 'Masyarakat', entities: ['Kelompok Warga', 'Kader GMNI'] }
        ],
        unknown_gaps: ['Data statistik rilis resmi dinas terkait masih dalam proses penelusuran.']
      },
      marhaenism_analysis: {
        sosio_nasionalisme: 'Menguji kedaulatan hak masyarakat atas perlindungan negara.',
        sosio_demokrasi: 'Kebijakan wajib berpihak pada kesejahteraan kaum Marhaen.',
        trisakti_perspective: 'Kemandirian dan keadilan ekonomi rakyat.',
        pro_poor_advocacy_notes: 'Pengawalan advokasi pro-bono bagi masyarakat prasejahtera.',
        critical_questions: ['Bagaimana dampak ekonomi langsung terhadap kaum pekerja?']
      },
      research_recommendation: {
        verdict: newImpact >= 85 ? 'Sangat Layak' : 'Layak',
        score: newImpact,
        relevance_notes: 'Relevan dengan fokus kajian sosial-politik.',
        urgency_notes: 'Perlu verifikasi data lapangan berkelanjutan.',
        data_availability: 'Sedang',
        grassroots_impact: 'Tinggi',
        policy_potential: 'Bahan policy brief rekomendasi daerah.',
        suggested_angle: 'Kajian Kebijakan Publik & Keadilan Sosial'
      },
      momentum_trend: {
        labels: ['H-6', 'H-5', 'H-4', 'H-3', 'H-2', 'H-1', 'Hari Ini'],
        values: [20, 28, 35, 42, 55, 68, 75],
        percentage_change: '+35%',
        trend_status: 'Naik',
        ai_commentary: 'Isu baru ditambahkan dan sedang dihimpun verifikasi sumber lanjutannya.'
      }
    };

    addIssue(newIssue);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-primary">
            Direktori Isu Sosial-Politik
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
            Pencarian dan penapisan isu terstruktur berdasar wilayah, sektor bidang, dan status perkembangan.
          </p>
        </div>

        {(role === 'admin' || role === 'researcher') && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-ink-primary hover:bg-black text-white text-xs font-semibold rounded-btn transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Daftarkan Isu Baru</span>
          </button>
        )}
      </div>

      {/* Territory Selector Navigation */}
      <TerritorySelector
        selectedScope={selectedTerritory}
        onSelectScope={setSelectedTerritory}
        selectedSubScope={selectedSubTerritory}
        onSelectSubScope={setSelectedSubTerritory}
        counts={territoryCounts}
      />

      {/* Search & Filters Toolbar */}
      <div className="bg-surface p-4 rounded-card border border-border space-y-3 shadow-subtle">
        <div className="relative">
          <Search className="w-4 h-4 text-ink-tertiary absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari kata kunci judul, deskripsi, atau wilayah..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-muted/60 border border-border rounded-btn placeholder:text-ink-tertiary focus:outline-none focus:bg-surface focus:border-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-tertiary hover:text-ink-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-ink-tertiary uppercase">Status:</span>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="p-1.5 bg-surface border border-border rounded-btn text-xs font-medium text-ink-primary"
            >
              <option value="all">Semua Status</option>
              <option value="Emerging">Emerging</option>
              <option value="Monitoring">Monitoring</option>
              <option value="Developing">Developing</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-ink-tertiary uppercase">Urutkan:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="p-1.5 bg-surface border border-border rounded-btn text-xs font-medium text-ink-primary"
            >
              <option value="impact">Impact Tertinggi</option>
              <option value="urgency">Urgensi Tertinggi</option>
              <option value="momentum">Momentum Tertinggi</option>
              <option value="latest">Paling Baru Update</option>
            </select>
          </div>
        </div>
      </div>

      {/* Issues Grid */}
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-card border border-border space-y-2">
            <BookOpen className="w-6 h-6 text-ink-tertiary mx-auto" />
            <h3 className="text-xs sm:text-sm font-semibold text-ink-primary">
              {selectedSubTerritory && selectedSubTerritory !== 'Semua Kabupaten / Kota' && selectedSubTerritory !== 'Semua Kecamatan' && selectedSubTerritory !== 'Seluruh Indonesia'
                ? `Belum ada isu terpantau di ${selectedSubTerritory}.`
                : `Tidak ada isu yang cocok dengan penapisan wilayah saat ini.`}
            </h3>
            <p className="text-xs text-ink-secondary">
              Ruang Isu terus memantau pembaruan berkala dari jaringan media rujukan dan laporan kader di lapangan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIssues.map(issue => (
              <div
                key={issue.id}
                className="bg-surface rounded-card border border-border p-5 shadow-subtle hover:border-stone-400 hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={issue.status} />
                    <span className="text-[11px] text-ink-tertiary font-mono">
                      {formatDateIndo(issue.last_updated_at)}
                    </span>
                  </div>

                  <Link href={`/isu/${issue.slug}`} className="block hover:text-primary transition-colors">
                    <h3 className="text-sm sm:text-base font-bold text-ink-primary leading-snug">
                      {issue.title}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <LocationBadge location={issue.location} district={issue.district} size="sm" />
                    <CategoryBadge category={issue.category} />
                  </div>

                  <p className="text-xs text-ink-secondary line-clamp-2 leading-relaxed">
                    {issue.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-border/80">
                  <div className="space-y-2 bg-stone-50/60 p-3 rounded-btn border border-border/60">
                    <ScoreIndicator label="Impact Score" score={issue.impact_score} accent={issue.impact_score >= 85} />
                    <ScoreIndicator label="Evidence Score" score={issue.evidence_score} />
                    <ScoreIndicator label="Momentum" score={issue.momentum_score} />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-ink-tertiary">
                    <span>{issue.sources_count} sumber</span>
                    <span className="text-ink-secondary font-medium">
                      Rekomendasi: {issue.research_recommendation.verdict}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      href={`/ai-analyst?issue=${issue.id}`}
                      className="flex-1 text-center py-2 px-3 bg-ink-primary hover:bg-black text-white text-xs font-semibold rounded-btn transition-colors"
                    >
                      Analisis
                    </Link>

                    <Link
                      href={`/isu/${issue.slug}`}
                      className="py-2 px-3 bg-surface hover:bg-muted text-ink-primary text-xs font-medium rounded-btn border border-border transition-colors"
                    >
                      Detail
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Add Issue */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-surface rounded-card p-6 shadow-card border border-border space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h4 className="text-sm font-bold text-ink-primary">
                Daftarkan Isu Baru ke Pemantauan
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-ink-tertiary hover:text-ink-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateIssue} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-ink-secondary mb-1">
                  Judul Isu:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Misal: Penataan Kawasan Industri dan Keselamatan Kerja..."
                  className="w-full p-2.5 bg-surface border border-border rounded-btn text-xs focus:outline-none focus:border-stone-400"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-ink-secondary mb-1">
                  Ringkasan Persoalan:
                </label>
                <textarea
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Jelaskan ringkasan persoalan di lapangan..."
                  rows={3}
                  className="w-full p-2.5 bg-surface border border-border rounded-btn text-xs focus:outline-none focus:border-stone-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-ink-secondary mb-1">
                    Wilayah:
                  </label>
                  <select
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    className="w-full p-2 bg-surface border border-border rounded-btn text-xs"
                  >
                    <option value="Purwakarta">Purwakarta</option>
                    <option value="Jawa Barat">Jawa Barat</option>
                    <option value="Nasional">Nasional</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-ink-secondary mb-1">
                    Kecamatan / Lokus:
                  </label>
                  <input
                    type="text"
                    value={newDistrict}
                    onChange={e => setNewDistrict(e.target.value)}
                    placeholder="Misal: Kec. Jatiluhur"
                    className="w-full p-2 bg-surface border border-border rounded-btn text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-ink-secondary mb-1">
                    Kategori:
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full p-2 bg-surface border border-border rounded-btn text-xs"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-ink-secondary mb-1">
                    Status Awal:
                  </label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as IssueStatus)}
                    className="w-full p-2 bg-surface border border-border rounded-btn text-xs"
                  >
                    <option value="Emerging">Emerging</option>
                    <option value="Monitoring">Monitoring</option>
                    <option value="Developing">Developing</option>
                    <option value="Confirmed">Confirmed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-ink-secondary mb-1">
                  Estimasi Dampak / Impact ({newImpact}/100):
                </label>
                <input
                  type="range"
                  min={40}
                  max={100}
                  value={newImpact}
                  onChange={e => setNewImpact(Number(e.target.value))}
                  className="w-full accent-stone-700"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 bg-muted hover:bg-stone-200 text-ink-primary rounded-btn font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-ink-primary hover:bg-black text-white rounded-btn font-semibold"
                >
                  Simpan Isu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
