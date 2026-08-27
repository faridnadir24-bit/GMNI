import { 
  WEST_JAVA_REGENCIES, 
  PURWAKARTA_DISTRICTS, 
  filterIssuesByTerritory, 
  computeWestJavaRegencyBreakdown 
} from '../src/lib/services/territory-service.js';
import { 
  SocialSignalProvider 
} from '../src/lib/services/social-signal-provider.js';
import { 
  generateResearchDossier, 
  generateDiscussionBrief, 
  buildDossierCitations,
  calculateCitationCoverage,
  markDossierReviewed,
  isDossierStale,
  exportDossierToMarkdown 
} from '../src/lib/services/dossier-engine.js';

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    passed++;
    console.log(`[PASS] ${message}`);
  } else {
    console.error(`[FAIL] ${message}`);
    process.exitCode = 1;
  }
}

console.log('====================================================');
console.log('FASE 7 TEST SUITE: NATIONAL & JABAR + DEEP WRITER');
console.log('====================================================\n');

// 1. TERRITORY HIERARCHY TESTS
console.log('--- TEST GROUP 1: TERRITORY HIERARCHY ---');
assert(WEST_JAVA_REGENCIES.length === 27, `West Java contains exact 27 Kabupaten/Kota (actual: ${WEST_JAVA_REGENCIES.length})`);
assert(PURWAKARTA_DISTRICTS.length === 17, `Purwakarta contains exact 17 Kecamatan (actual: ${PURWAKARTA_DISTRICTS.length})`);

const mockIssues = [
  {
    id: 'iss-1',
    title: 'Evaluasi Dampak Penertiban KJA Waduk Jatiluhur',
    slug: 'moratorium-kja-waduk-jatiluhur-purwakarta',
    location: 'Purwakarta',
    province: 'Jawa Barat',
    district: 'Kec. Jatiluhur',
    category: 'Agraria',
    status: 'Developing',
    impact_score: 88,
    urgency_score: 85,
    momentum_score: 80,
    confidence_score: 82,
    priority_score: 85,
    description: 'Penertiban KJA di Waduk Jatiluhur.',
    first_detected_at: '2026-08-20T00:00:00Z',
    last_updated_at: '2026-08-26T00:00:00Z'
  },
  {
    id: 'iss-2',
    title: 'Polemik UMK dan Efisiensi Industri Manufaktur',
    slug: 'polemik-umk-industri-karawang',
    location: 'Kabupaten Karawang',
    province: 'Jawa Barat',
    district: 'Kec. Telukjambe',
    category: 'Ketenagakerjaan',
    status: 'Confirmed',
    impact_score: 82,
    urgency_score: 80,
    momentum_score: 75,
    confidence_score: 85,
    priority_score: 80,
    description: 'Dinamika ketenagakerjaan kawasan industri Karawang.',
    first_detected_at: '2026-08-21T00:00:00Z',
    last_updated_at: '2026-08-25T00:00:00Z'
  },
  {
    id: 'iss-3',
    title: 'Kebijakan Hilirisasi dan Transisi Energi Nasional',
    slug: 'kebijakan-hilirisasi-transisi-energi-nasional',
    location: 'Nasional',
    province: 'Nasional',
    district: null,
    category: 'Ekonomi',
    status: 'Monitoring',
    impact_score: 90,
    urgency_score: 88,
    momentum_score: 85,
    confidence_score: 90,
    priority_score: 88,
    description: 'Tata kelola hilirisasi minerba skala nasional.',
    first_detected_at: '2026-08-18T00:00:00Z',
    last_updated_at: '2026-08-24T00:00:00Z'
  }
];

const jabarFiltered = filterIssuesByTerritory(mockIssues, 'jabar');
assert(jabarFiltered.length === 2, `Jawa Barat filters all Jabar regencies (Purwakarta & Karawang) (found: ${jabarFiltered.length})`);

const pwkFiltered = filterIssuesByTerritory(mockIssues, 'purwakarta');
assert(pwkFiltered.length === 1 && pwkFiltered[0].location === 'Purwakarta', 'Purwakarta filters only Purwakarta issues');

const karawangFiltered = filterIssuesByTerritory(mockIssues, 'jabar', 'Kabupaten Karawang');
assert(karawangFiltered.length === 1 && karawangFiltered[0].location === 'Kabupaten Karawang', 'Specific regency filtering in Jabar works accurately');

const cirebonFiltered = filterIssuesByTerritory(mockIssues, 'jabar', 'Kabupaten Cirebon');
assert(cirebonFiltered.length === 0, 'Regency with 0 issues returns empty array without fabricating data');

const nationalFiltered = filterIssuesByTerritory(mockIssues, 'nasional');
assert(nationalFiltered.length === 1 && nationalFiltered[0].location === 'Nasional', 'National scope filters national issues correctly');

// 2. SOCIAL SIGNAL PROVIDER TESTS
console.log('\n--- TEST GROUP 2: SOCIAL SIGNAL SEPARATION ---');
const signal = SocialSignalProvider.createSignal({
  platform: 'X',
  author_handle: '@buruh_jabar',
  content: 'Ratusan buruh menuntut evaluasi formula upah minimum.',
  sentiment: 'critical',
  engagement: { likes: 350, shares: 120, comments: 45 }
});
assert(signal.verification_status === 'UNVERIFIED', 'Social signal strictly marked as UNVERIFIED');
assert(signal.source_type === 'social_signal', 'Source type classified as social_signal');
assert(signal.disclaimer.length > 20, 'Signal includes mandatory non-fact disclaimer');

const attention = SocialSignalProvider.calculatePublicAttentionIndex([signal]);
assert(attention.totalEngagement > 0, `Engagement metric aggregated correctly (${attention.totalEngagement})`);
assert(attention.score > 0, `Momentum index calculated (${attention.score})`);

// 3. DEEP RESEARCH DOSSIER (21 CHAPTERS) TESTS
console.log('\n--- TEST GROUP 3: 21-CHAPTER DOSSIER STRUCTURE ---');
const mockSources = [
  {
    id: 'src-1',
    issue_id: 'iss-1',
    title: 'Penertiban KJA Jatiluhur Memasuki Tahap Penataan Zonasi',
    source_name: 'ANTARA News Jawa Barat',
    source_type: 'Regional Media',
    url: 'https://jabar.antaranews.com/berita/kja-jatiluhur',
    credibility_score: 90,
    published_at: '2026-08-25T10:00:00Z',
    summary: 'Dinas Kelautan Jabar menata KJA Jatiluhur.',
    author_or_institution: 'Redaksi ANTARA'
  },
  {
    id: 'src-2',
    issue_id: 'iss-1',
    title: 'Pembudidaya Ikan Minta Skema Kompensasi Transisi',
    source_name: 'Pikiran Rakyat',
    source_type: 'Established Media',
    url: 'https://pikiran-rakyat.com/kompensasi-kja',
    credibility_score: 85,
    published_at: '2026-08-26T14:30:00Z',
    summary: 'Aspirasi kelompok pembudidaya ikan lokal.',
    author_or_institution: 'Pikiran Rakyat'
  }
];

const mockClaims = [
  {
    id: 'clm-1',
    issue_id: 'iss-1',
    content: 'Sebanyak 3.000 petak KJA dijadwalkan masuk dalam target penataan zonasi.',
    type: 'fact',
    source_name: 'Dinas Kelautan & Perikanan Jabar',
    source_type: 'Official',
    confidence_score: 95
  },
  {
    id: 'clm-2',
    issue_id: 'iss-1',
    content: 'Pendapatan pembudidaya turun drastis hingga 60% selama masa sosialisasi.',
    type: 'claim',
    source_name: 'Asosiasi Pembudidaya Ikan Jatiluhur',
    source_type: 'Field Report',
    confidence_score: 80
  }
];

const dossier = generateResearchDossier(mockIssues[0], mockSources, mockClaims);

assert(dossier.chapters.length === 21, `Dossier contains exact 21 chapters (actual: ${dossier.chapters.length})`);
assert(dossier.executive_summary.length >= 300, 'Executive summary is a rich narrative synthesis');
assert(dossier.key_data_box.length >= 4, 'Key Data Box contains structured indicators');
assert(dossier.chronology_table.length >= 1, 'Chronology table structured with dates and sources');
assert(dossier.policy_scenarios.length === 3, 'Contains 3 distinct policy intervention scenarios');
assert(dossier.pattern_interpretation.includes('[Interpretasi Analitis]'), 'Benang Merah explicitly marked as analytical interpretation');
assert(dossier.what_this_means.includes('[Interpretasi Analitis]'), 'What This Means explicitly marked as analytical interpretation');

// Verify Key Chapter Headings
assert(dossier.chapters[0].title.includes('PENDAHULUAN'), 'Bab I: Pendahuluan present');
assert(dossier.chapters[1].title.includes('LATAR BELAKANG'), 'Bab II: Latar Belakang present');
assert(dossier.chapters[2].title.includes('RUMUSAN MASALAH'), 'Bab III: Rumusan Masalah present');
assert(dossier.chapters[3].title.includes('TUJUAN KAJIAN'), 'Bab IV: Tujuan Kajian present');
assert(dossier.chapters[4].title.includes('METODE'), 'Bab V: Metode present');
assert(dossier.chapters[6].title.includes('DATA KUANTITATIF'), 'Bab VII: Data dan Fakta present');
assert(dossier.chapters[7].title.includes('KRONOLOGI'), 'Bab VIII: Kronologi present');
assert(dossier.chapters[8].title.includes('DIFERENSIASI METODOLOGIS'), 'Bab IX: Fakta vs Klaim present');
assert(dossier.chapters[9].title.includes('PEMETAAN AKTOR'), 'Bab X: Pemetaan Aktor present');
assert(dossier.chapters[10].title.includes('DAMPAK MULTIDIMENSI'), 'Bab XI: Dampak present');
assert(dossier.chapters[14].title.includes('PERSPEKTIF GMNI'), 'Bab XV: Perspektif GMNI (Marhaenisme & Trisakti) present');
assert(dossier.chapters[15].title.includes('DATA GAP'), 'Bab XVI: Data Gap present');
assert(dossier.chapters[16].title.includes('PERTANYAAN KAJIAN'), 'Bab XVII: Pertanyaan Kajian 10 Dimensi present');
assert(dossier.chapters[17].title.includes('ALTERNATIF KEBIJAKAN'), 'Bab XVIII: Alternatif Kebijakan present');
assert(dossier.chapters[18].title.includes('REKOMENDASI ADVOKASI'), 'Bab XIX: Rekomendasi Advokasi present');
assert(dossier.chapters[19].title.includes('KESIMPULAN'), 'Bab XX: Kesimpulan present');
assert(dossier.chapters[20].title.includes('DAFTAR SUMBER'), 'Bab XXI: Daftar Sumber present');

// 4. CITATIONS & PROVENANCE QUALITY GATE
console.log('\n--- TEST GROUP 4: PROVENANCE & QUALITY GATE ---');
assert(dossier.total_sources_cited === 2, 'Total sources cited matches input sources (2)');
assert(dossier.citation_coverage >= 90, `Citation coverage meets Quality Gate (actual: ${dossier.citation_coverage}%)`);
assert(dossier.sources_list[0].badge === '[Sumber 01]', 'Citation badge format verified [Sumber 01]');

// 5. HUMAN REVIEW & VERSIONING
console.log('\n--- TEST GROUP 5: HUMAN REVIEW & VERSIONING ---');
assert(dossier.human_review.is_reviewed === false, 'Initial state is unreviewed');
const reviewedDossier = markDossierReviewed(dossier, 'Bung Farid Nadir', 'Ketua DPK GMNI');
assert(reviewedDossier.human_review.is_reviewed === true, 'Review status successfully marked as reviewed');
assert(reviewedDossier.human_review.reviewer_name === 'Bung Farid Nadir', 'Reviewer name recorded');
assert(reviewedDossier.version === 1, 'Version is v1');

// 6. MARKDOWN EXPORT
console.log('\n--- TEST GROUP 6: MARKDOWN EXPORT ---');
const mdOutput = exportDossierToMarkdown(reviewedDossier);
assert(mdOutput.includes('# Evaluasi Dampak Penertiban KJA'), 'Markdown export contains title');
assert(mdOutput.includes('## RINGKASAN EKSEKUTIF'), 'Markdown export contains Executive Summary');
assert(mdOutput.includes('## DATA KUNCI'), 'Markdown export contains Key Data Box');
assert(mdOutput.includes('## BAB I: PENDAHULUAN'), 'Markdown export contains Bab I');
assert(mdOutput.includes('## BAB XV: ANALISIS PERSPEKTIF GMNI'), 'Markdown export contains Bab XV');
assert(mdOutput.includes('## BAB XXI: DAFTAR SUMBER'), 'Markdown export contains Bab XXI');

console.log('\n====================================================');
console.log(`TEST RESULTS: ${passed} / ${total} PASSED (${((passed/total)*100).toFixed(1)}%)`);
console.log('====================================================\n');
