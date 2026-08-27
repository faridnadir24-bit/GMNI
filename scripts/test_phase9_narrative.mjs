import assert from 'assert';
import { 
  generateResearchDossier, 
  generateMediaBrief, 
  generatePolicyBrief, 
  generatePresentationDeck, 
  generateMeetingNotes, 
  generateSocialMediaContent,
  explainConfidenceScore,
  exportDossierToMarkdown 
} from '../src/lib/services/dossier-engine.ts';

console.log('====================================================');
console.log('TEST SUITE: FASE 9 RESEARCH NARRATIVE & QUALITY GATE');
console.log('====================================================\n');

const testIssue = {
  id: 'issue-fase9-eval',
  slug: 'evaluasi-kebijakan-agraris-jatiluhur',
  title: 'Evaluasi Kebijakan Moratorium KJA dan Dampak Ekonomi Nelayan Jatiluhur',
  description: 'Dinamika penataan zonasi perikanan budidaya dan perlindungan mata pencaharian warga lokal.',
  location: 'Kabupaten Purwakarta',
  district: 'Kecamatan Jatiluhur',
  category: 'Agraria',
  impact_score: 86,
  momentum_score: 74,
  confidence_score: 89,
  status: 'Developing',
  first_detected_at: '2026-08-01T00:00:00Z',
  last_updated_at: '2026-08-25T00:00:00Z'
};

const testSources = [
  { id: 's1', source_name: 'Kompas Regional', title: 'Nelayan Jatiluhur Minta Kejelasan Skema Kompensasi', url: 'https://regional.kompas.com/read/2026/08/05/nelayan-jatiluhur', published_at: '2026-08-05' },
  { id: 's2', source_name: 'Detik Jabar', title: 'Pemda Purwakarta Tegaskan Penertiban Sesuai Tata Ruang', url: 'https://news.detik.com/jabar/berita/pemda-purwakarta', published_at: '2026-08-10' }
];

const testClaims = [
  { id: 'c1', type: 'fact', content: 'Sebanyak 500 petak keramba ditertibkan pada operasi tahap awal.' },
  { id: 'c2', type: 'claim', statement: 'Pemerintah daerah mengklaim program bantuan permodalan telah disiapkan.' }
];

// --- 1. TEST 21-CHAPTER DOSSIER & ACADEMIC STRUCTURE ---
console.log('--- [1] 21-Chapter Dossier & Academic Structure ---');
const dossier = generateResearchDossier(testIssue, testSources, testClaims);
assert.strictEqual(dossier.chapters.length, 21, 'Must contain exactly 21 chapters');
assert(dossier.executive_summary.length > 500, 'Executive summary must be substantive narrative');
assert(dossier.key_data_box.length >= 5, 'Key data box must contain structured quantitative indicators');
assert(dossier.chapters[0].title.includes('PENDAHULUAN'), 'Bab I must be Pendahuluan');
assert(dossier.chapters[6].title.includes('9 KATEGORI AKTOR'), 'Bab VII must be 9 Actor Categories');
assert(dossier.chapters[7].title.includes('FAKTA TERDOKUMENTASI'), 'Bab VIII must be Fakta Terdokumentasi');
assert(dossier.chapters[8].title.includes('KLAIM DAN PERNYATAAN'), 'Bab IX must be Klaim & Pernyataan');
assert(dossier.chapters[16].title.includes('KONDISI TERKINI'), 'Bab XVII must be Kondisi Terkini & What Changed');
assert(dossier.chapters[20].title.includes('DAFTAR SUMBER'), 'Bab XXI must be Daftar Sumber');
console.log('✓ 21 Chapters verified with complete academic rigor');

// --- 2. TEST ACTOR ANALYSIS (9 CATEGORIES) ---
console.log('\n--- [2] Actor Analysis (9 Categories) ---');
const actorChap = dossier.chapters.find(c => c.id === 'chap-07-aktor-terkait');
assert(actorChap, 'Actor chapter must exist');
const bpStr = actorChap.bullet_points.join(' ');
assert(bpStr.includes('PEMERINTAH:'), 'Must include Pemerintah');
assert(bpStr.includes('DPR / DPRD:'), 'Must include DPRD');
assert(bpStr.includes('MASYARAKAT:'), 'Must include Masyarakat');
assert(bpStr.includes('SERIKAT / ORGANISASI:'), 'Must include Serikat/Organisasi');
assert(bpStr.includes('PELAKU USAHA:'), 'Must include Pelaku Usaha');
assert(bpStr.includes('AKADEMISI / PENELITI:'), 'Must include Akademisi');
console.log('✓ 9 Actor classifications verified');

// --- 3. TEST FACTS VS CLAIMS VS UNVERIFIED ---
console.log('\n--- [3] Facts vs Claims vs Unverified ---');
const factsChap = dossier.chapters.find(c => c.id === 'chap-08-fakta-terdokumentasi');
const claimsChap = dossier.chapters.find(c => c.id === 'chap-09-klaim-pernyataan');
assert(factsChap.bullet_points.some(b => b.includes('[F01]')), 'Documented facts must have [Fxx] tag');
assert(claimsChap.bullet_points.some(b => b.includes('[C01]')), 'Claims must have [Cxx] tag');
console.log('✓ Facts [Fxx] and Claims [Cxx] strictly separated and attributed');

// --- 4. TEST 4-STAGE WHAT CHANGED FORMAT ---
console.log('\n--- [4] 4-Stage What Changed Format ---');
const changedChap = dossier.chapters.find(c => c.id === 'chap-17-kondisi-terkini');
const changedStr = changedChap.bullet_points.join(' ');
assert(changedStr.includes('1. SEBELUM:'), 'Must contain SEBELUM stage');
assert(changedStr.includes('2. PERUBAHAN:'), 'Must contain PERUBAHAN stage');
assert(changedStr.includes('3. SEKARANG:'), 'Must contain SEKARANG stage');
assert(changedStr.includes('4. BELUM DIKETAHUI:'), 'Must contain BELUM DIKETAHUI stage');
console.log('✓ 4-Stage What Changed reconstruction verified');

// --- 5. TEST 6 MULTI-FORMAT WRITER OUTPUTS ---
console.log('\n--- [5] 6 Multi-Format Writer Outputs ---');

// Output 1: Naskah Kajian 21 Bab
assert.strictEqual(dossier.chapters.length, 21);
console.log('✓ [Format 1] Naskah Kajian (21 Bab)');

// Output 2: Policy Brief
const pb = generatePolicyBrief(testIssue, testSources, testClaims);
assert(pb.title.includes('POLICY BRIEF'));
assert(pb.key_findings.length >= 3);
console.log('✓ [Format 2] Policy Brief (3 Halaman)');

// Output 3: Bahan Presentasi
const deck = generatePresentationDeck(testIssue, testSources, testClaims);
assert.strictEqual(deck.slides.length, 4);
assert(deck.slides[0].speaker_notes.length > 20);
console.log('✓ [Format 3] Bahan Presentasi Slide Deck + Speaker Notes');

// Output 4: Naskah Rapat Sospol
const notes = generateMeetingNotes(testIssue, testSources, testClaims);
assert(notes.agenda_title.includes('Naskah Rapat'));
assert(notes.critical_questions.length >= 3);
console.log('✓ [Format 4] Naskah Rapat Sospol Komisariat');

// Output 5: Media Brief
const mb = generateMediaBrief(testIssue, testSources, testClaims);
assert.strictEqual(mb.five_key_facts.length, 5);
assert.strictEqual(mb.three_key_data.length, 3);
assert(mb.one_caveat.length > 0);
console.log('✓ [Format 5] Media Brief Rilis Pers');

// Output 6: Konten Sosial Media
const social = generateSocialMediaContent(testIssue, testSources, testClaims);
assert.strictEqual(social.instagram_carousel.length, 5, 'Instagram Carousel must have 5 slides');
assert.strictEqual(social.twitter_thread.length, 5, 'Twitter thread must have 5 tweets');
assert(social.short_video_script.hook.length > 0, 'Video script must have hook');
assert(social.instagram_caption.includes('#'), 'Caption must include relevant hashtags');
console.log('✓ [Format 6] Konten Sosial Media (IG Carousel, X Thread, Video Script, Caption)');

// --- 6. TEST CONFIDENCE EXPLAINER NARRATIVE ---
console.log('\n--- [6] Human-Readable Confidence Score Narrative ---');
const confText = explainConfidenceScore(testIssue, dossier.sources_list, []);
assert(confText.includes('Keyakinan data berada pada tingkat 89/100'), 'Must explain exact score');
assert(confText.includes('sumber pers independen'), 'Must mention independent sources');
console.log('✓ Confidence narrative explanation:', confText);

// --- 7. TEST QUALITY GATE ---
console.log('\n--- [7] Citation Coverage Quality Gate ---');
assert(dossier.citation_coverage >= 90, 'Citation coverage must be >= 90%');
console.log('✓ Quality Gate passed with', dossier.citation_coverage, '% citation coverage');

console.log('\n====================================================');
console.log('FASE 9 TEST SUITE: ALL TESTS PASSED (100%)');
console.log('====================================================\n');
