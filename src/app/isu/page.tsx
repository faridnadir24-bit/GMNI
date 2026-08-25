'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  MapPin, 
  Plus, 
  X, 
  SlidersHorizontal, 
  BookOpen, 
  ArrowRight,
  Database,
  Clock,
  Sparkles
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Issue, IssueStatus, PriorityLevel } from '@/types';
import { getStatusBadgeStyle, formatDateIndo } from '@/lib/utils';

export default function IssueDirectoryPage() {
  const { issues, addIssue, role } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'impact' | 'urgency' | 'momentum' | 'latest'>('impact');

  // Add Issue Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLocation, setNewLocation] = useState('Purwakarta');
  const [newDistrict, setNewDistrict] = useState('Kec. Purwakarta');
  const [newCategory, setNewCategory] = useState('Keamanan Publik');
  const [newStatus, setNewStatus] = useState<IssueStatus>('Developing');
  const [newImpact, setNewImpact] = useState(85);

  const categories = useMemo(() => {
    const set = new Set<string>();
    issues.forEach(i => set.add(i.category));
    return Array.from(set);
  }, [issues]);

  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          issue.title.toLowerCase().includes(q) ||
          issue.description.toLowerCase().includes(q) ||
          issue.location.toLowerCase().includes(q) ||
          issue.category.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Region
      if (selectedRegion !== 'all') {
        if (selectedRegion === 'purwakarta' && !issue.location.toLowerCase().includes('purwakarta')) return false;
        if (selectedRegion === 'jabar' && !issue.province.toLowerCase().includes('jawa barat')) return false;
        if (selectedRegion === 'nasional' && !issue.location.toLowerCase().includes('nasional')) return false;
      }

      // Category
      if (selectedCategory !== 'all' && issue.category !== selectedCategory) {
        return false;
      }

      // Status
      if (selectedStatus !== 'all' && issue.status !== selectedStatus) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'impact') return b.impact_score - a.impact_score;
      if (sortBy === 'urgency') return b.urgency_score - a.urgency_score;
      if (sortBy === 'momentum') return b.momentum_score - a.momentum_score;
      if (sortBy === 'latest') return new Date(b.last_updated_at).getTime() - new Date(a.last_updated_at).getTime();
      return 0;
    });
  }, [issues, searchQuery, selectedRegion, selectedCategory, selectedStatus, sortBy]);

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
      first_detected_at: new Date().toISOString(),
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
      
      {/* Directory Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-gmni-red" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
              Direktori Isu Sosial-Politik
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
              {filteredIssues.length} Isu Ditemukan
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Repositori pemantauan isu terstruktur dari skala lokal Purwakarta, Jawa Barat, hingga Nasional.
          </p>
        </div>

        {(role === 'admin' || role === 'researcher') && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gmni-red hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Isu Baru</span>
          </button>
        )}
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-subtle space-y-4">
        
        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari isu berdasarkan judul, kategori, wilayah, atau kata kunci ringkasan..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          
          {/* Region Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 mr-1 uppercase">Wilayah:</span>
            {[
              { id: 'all', label: 'Semua Wilayah' },
              { id: 'purwakarta', label: '🔴 Purwakarta (Prioritas 1)' },
              { id: 'jabar', label: 'Jawa Barat' },
              { id: 'nasional', label: 'Nasional' }
            ].map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRegion(r.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedRegion === r.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Sorter & Status Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400">Status:</span>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
              >
                <option value="all">Semua Status</option>
                <option value="Emerging">Emerging</option>
                <option value="Monitoring">Monitoring</option>
                <option value="Developing">Developing</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400">Urutkan:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
              >
                <option value="impact">Tertinggi Impact</option>
                <option value="urgency">Tertinggi Urgensi</option>
                <option value="momentum">Tertinggi Momentum</option>
                <option value="latest">Paling Baru Update</option>
              </select>
            </div>
          </div>

        </div>

      </div>

      {/* Issue Cards Grid */}
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">
              Belum ada isu yang cocok dengan filter pencarian.
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Coba sesuaikan kata kunci pencarian atau ubah filter wilayah dan status.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIssues.map(issue => {
              const isHigh = issue.priority_level === 'Tinggi' || issue.impact_score >= 85;
              return (
                <div
                  key={issue.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-subtle hover:shadow-card-hover hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className={`h-1 w-full ${isHigh ? 'bg-gmni-red' : 'bg-slate-300'}`} />

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadgeStyle(issue.status)}`}>
                          {issue.status}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {formatDateIndo(issue.last_updated_at)}
                        </span>
                      </div>

                      <Link href={`/isu/${issue.slug}`} className="block group-hover:text-gmni-red transition-colors">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                          {issue.title}
                        </h3>
                      </Link>

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2 text-[11px] text-slate-500">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                          <MapPin className="w-3 h-3 text-red-500" />
                          {issue.location} {issue.district ? `(${issue.district})` : ''}
                        </span>
                        <span>•</span>
                        <span className="text-slate-600 truncate">{issue.category}</span>
                      </div>

                      <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                        {issue.description}
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 space-y-2">
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-white p-1.5 rounded border border-slate-200">
                          <div className="text-[9px] text-slate-500">Impact</div>
                          <div className="font-bold text-red-700 font-mono">{issue.impact_score}/100</div>
                        </div>
                        <div className="bg-white p-1.5 rounded border border-slate-200">
                          <div className="text-[9px] text-slate-500">Evidence</div>
                          <div className="font-bold text-slate-800 font-mono">{issue.evidence_score}/100</div>
                        </div>
                        <div className="bg-white p-1.5 rounded border border-slate-200">
                          <div className="text-[9px] text-slate-500">Momentum</div>
                          <div className="font-bold text-amber-700 font-mono">{issue.momentum_score}/100</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                        <span>{issue.sources_count} Sumber Data</span>
                        <span className="text-emerald-700 font-medium font-mono">
                          {issue.research_recommendation.verdict}
                        </span>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center gap-2">
                      <Link
                        href={`/ai-analyst?issue=${issue.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Analisis AI</span>
                      </Link>

                      <Link
                        href={`/isu/${issue.slug}`}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200"
                      >
                        Detail
                      </Link>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Issue Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="text-sm font-bold text-slate-900">
                Tambah Isu Baru ke Radar Pemantauan
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateIssue} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Judul Isu:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Misal: Penataan Kawasan Industri dan Keselamatan Kerja..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Deskripsi / Konteks Permasalahan:
                </label>
                <textarea
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Jelaskan ringkasan persoalan di lapangan..."
                  rows={3}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Wilayah / Lokus:
                  </label>
                  <select
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Purwakarta">🔴 Purwakarta</option>
                    <option value="Jawa Barat">Jawa Barat</option>
                    <option value="Nasional">Nasional</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kecamatan (Jika Purwakarta):
                  </label>
                  <input
                    type="text"
                    value={newDistrict}
                    onChange={e => setNewDistrict(e.target.value)}
                    placeholder="Misal: Kec. Jatiluhur"
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kategori Bidang:
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Keamanan Publik">Keamanan Publik</option>
                    <option value="Ketenagakerjaan">Ketenagakerjaan</option>
                    <option value="Agraria & Lingkungan">Agraria & Lingkungan</option>
                    <option value="Pendidikan & Pemuda">Pendidikan & Pemuda</option>
                    <option value="Kebijakan Daerah">Kebijakan Daerah</option>
                    <option value="Hukum & HAM">Hukum & HAM</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status Awal:
                  </label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as IssueStatus)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Emerging">Emerging</option>
                    <option value="Monitoring">Monitoring</option>
                    <option value="Developing">Developing</option>
                    <option value="Confirmed">Confirmed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Estimasi Skor Dampak / Impact ({newImpact}/100):
                </label>
                <input
                  type="range"
                  min={40}
                  max={100}
                  value={newImpact}
                  onChange={e => setNewImpact(Number(e.target.value))}
                  className="w-full accent-red-600"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gmni-red hover:bg-red-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Daftarkan Isu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
