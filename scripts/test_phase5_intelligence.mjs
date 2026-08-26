/**
 * TEST SUITE: FASE 5 INTELLIGENCE ENGINE
 * Validates:
 * 1. Semantic clustering & entity extraction (ARTIKEL BARU ≠ ISU BARU)
 * 2. Contradiction & numeric fact engine
 * 3. Change detection & severity grading
 * 4. Confidence engine & explainability
 * 5. Novelty score & Status transition engine
 * 6. Radar Purwakarta dynamic aggregation
 */

import { 
  matchArticleToIssue, 
  generateNeutralIssueTitle, 
  extractEntities, 
  calculateTokenSimilarity 
} from '../src/lib/services/semantic-cluster.ts';

import { 
  detectContradictions, 
  extractNumericFacts 
} from '../src/lib/services/contradiction-engine.ts';

import { 
  calculateConfidence 
} from '../src/lib/services/confidence-engine.ts';

import { 
  detectIssueChanges 
} from '../src/lib/services/issue-change-detector.ts';

import { 
  calculatePriorityScore, 
  calculateNoveltyScore, 
  determineIssueStatus, 
  computeRadarPurwakarta 
} from '../src/lib/services/issue-priority.ts';

console.log('====================================================');
console.log('TEST SUITE — FASE 5 INTELLIGENCE ENGINE');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    if (details) console.error(`   Details: ${details}`);
  }
}

// ----------------------------------------------------
// TEST 1: Same Issue Different Titles (Semantic Cluster)
// ----------------------------------------------------
console.log('--- TEST 1: Semantic Clustering (ARTIKEL BARU ≠ ISU BARU) ---');

const existingIssues = [
  {
    id: 'issue-kja-01',
    title: 'Penertiban Keramba Jaring Apung (KJA) Waduk Jatiluhur',
    category: 'Agraria',
    location: 'Purwakarta',
    sub_location: 'Kecamatan Jatiluhur',
    summary: 'Penataan zonasi KJA dan penertiban keramba di perairan Danau Jatiluhur.',
    last_activity_at: new Date().toISOString(),
  },
  {
    id: 'issue-umk-02',
    title: 'Tuntutan Kenaikan Upah Minimum Kabupaten (UMK) Buruh Purwakarta',
    category: 'Ketenagakerjaan',
    location: 'Purwakarta',
    sub_location: 'Kecamatan Purwakarta',
    summary: 'Aksi unjuk rasa aliansi serikat buruh menuntut kenaikan UMK Purwakarta.',
    last_activity_at: new Date().toISOString(),
  }
];

const articleSameIssue = {
  title: 'BREAKING NEWS: Pembudidaya Ikan Protes Pembongkaran Keramba di Jatiluhur!',
  summary: 'Ratusan peternak ikan waduk jatiluhur menolak penertiban kja oleh satpol pp pemkab purwakarta.',
  content: 'Ratusan peternak ikan waduk jatiluhur menolak penertiban kja oleh satpol pp pemkab purwakarta...',
  category: 'Agraria',
  location: 'Purwakarta',
  sub_location: 'Kecamatan Jatiluhur',
};

const matchResult = matchArticleToIssue(articleSameIssue, existingIssues);

assert(
  matchResult.isMatch === true && matchResult.matchedIssueId === 'issue-kja-01',
  'Same issue with different phrasing correctly attaches to existing issue',
  `Matched: ${matchResult.isMatch}, MatchedId: ${matchResult.matchedIssueId}, Score: ${matchResult.matchScore}`
);

assert(
  matchResult.matchScore >= 70,
  `Match score exceeds threshold (Score: ${matchResult.matchScore})`
);

// ----------------------------------------------------
// TEST 2: Completely Different Issue (New Issue Creation)
// ----------------------------------------------------
console.log('\n--- TEST 2: New Issue Creation ---');

const articleDifferentIssue = {
  title: 'DPRD Purwakarta Bahas Raperda Pengelolaan Sampah dan Lingkungan Hidup',
  summary: 'Pemerintah Kabupaten Purwakarta bersama Komisi III DPRD merumuskan perda sampah baru di TPA Cikolotok.',
  content: 'Pemerintah Kabupaten Purwakarta bersama Komisi III DPRD merumuskan perda sampah baru...',
  category: 'Lingkungan',
  location: 'Purwakarta',
  sub_location: 'Kecamatan Pasawahan',
};

const matchResult2 = matchArticleToIssue(articleDifferentIssue, existingIssues);

assert(
  matchResult2.isMatch === false,
  'Completely different issue is detected as new issue',
  `Matched: ${matchResult2.isMatch}, Score: ${matchResult2.matchScore}`
);

const canonicalTitle = generateNeutralIssueTitle(
  articleDifferentIssue.title,
  articleDifferentIssue.category,
  articleDifferentIssue.location,
  articleDifferentIssue.sub_location
);

assert(
  !canonicalTitle.includes('BREAKING NEWS') && !canonicalTitle.includes('!'),
  `Canonical title is neutral and clean: "${canonicalTitle}"`
);

// ----------------------------------------------------
// TEST 3: Contradiction & Numeric Extraction
// ----------------------------------------------------
console.log('\n--- TEST 3: Contradiction & Numeric Extraction ---');

const textSourceA = 'Satpol PP mencatat sebanyak 71 petak keramba KJA ilegal telah ditertibkan pada tahap pertama.';
const textSourceB = 'Asosiasi pembudidaya menyebut ada 120 petak keramba yang dibongkar paksa tanpa kompensasi.';

const contradictions = detectContradictions(
  textSourceB,
  'Asosiasi Nelayan',
  new Date().toISOString(),
  [{ sourceName: 'Satpol PP Purwakarta', content: textSourceA, publishedAt: new Date().toISOString() }]
);

assert(
  contradictions.length > 0,
  'Numeric discrepancy between 71 petak and 120 petak is detected neutrally',
  `Contradictions found: ${contradictions.length}`
);

// ----------------------------------------------------
// TEST 4: Confidence Engine & Explainability
// ----------------------------------------------------
console.log('\n--- TEST 4: Confidence Engine & Explainability ---');

const confidenceOutput = calculateConfidence({
  sourceCount: 4,
  officialCount: 1,
  nationalCount: 2,
  localCount: 1,
  contradictionCount: 0,
  hoursSinceLastUpdate: 2,
  hasVerifiedFacts: true,
});

assert(
  confidenceOutput.score >= 80 && confidenceOutput.level === 'Tinggi',
  `Multi-source verified issue achieves High Confidence (Score: ${confidenceOutput.score})`,
  `Level: ${confidenceOutput.level}, Explanation: ${confidenceOutput.explanation}`
);

assert(
  confidenceOutput.factors.length >= 3,
  `Explainability produces clear decision factors (Count: ${confidenceOutput.factors.length})`
);

// ----------------------------------------------------
// TEST 5: Change Detection Engine
// ----------------------------------------------------
console.log('\n--- TEST 5: Change Detection Engine ---');

const changeResult = detectIssueChanges(
  {
    id: 'issue-kja-01',
    title: 'Penertiban KJA Jatiluhur',
    source_count: 2,
    source_urls: ['https://source1.com/a'],
    source_names: ['Radar Purwakarta'],
    verified_facts: ['Penertiban KJA dimulai pekan ini.'],
    claims: [],
    unverified: [],
    confidence_score: 70,
    momentum_score: 65,
    priority_score: 75,
  },
  {
    url: 'https://pemkabpurwakarta.go.id/rilis-resmi',
    title: 'Bupati Purwakarta Rilis Kebijakan Relokasi Budidaya KJA',
    summary: 'Pemkab Purwakarta menyiapkan alokasi anggaran Rp5 miliar untuk zonasi baru.',
    sourceName: 'Pemkab Purwakarta',
    sourceType: 'official',
    publishedAt: new Date().toISOString(),
    verifiedFacts: ['Bupati menyiapkan alokasi anggaran Rp5 miliar untuk zonasi baru.'],
    claims: ['Target penataan selesai akhir tahun.'],
  },
  85,
  78,
  82
);

assert(
  changeResult.hasChanges === true,
  'Incoming official article triggers change detection'
);

assert(
  changeResult.severity === 'MEDIUM' || changeResult.severity === 'HIGH',
  `Official statement escalates change severity (Severity: ${changeResult.severity})`
);

assert(
  changeResult.newEvents.length > 0,
  `Generates timeline events for database insertion (Events: ${changeResult.newEvents.length})`
);

// ----------------------------------------------------
// TEST 6: Novelty Scoring & Status Engine
// ----------------------------------------------------
console.log('\n--- TEST 6: Novelty Score & Status Engine ---');

const officialNovelty = calculateNoveltyScore({ isOfficialStatement: true, hasNewPolicy: true });
const repetitionNovelty = calculateNoveltyScore({ isRepetition: true });

assert(
  officialNovelty >= 90 && repetitionNovelty <= 30,
  `Novelty score differentiates official policy (${officialNovelty}) from repetition (${repetitionNovelty})`
);

const statusConfirmed = determineIssueStatus({
  sourceCount: 4,
  officialCount: 1,
  confidenceScore: 82,
  momentumScore: 75,
  hoursSinceLastUpdate: 3,
});

const statusStale = determineIssueStatus({
  sourceCount: 2,
  officialCount: 0,
  confidenceScore: 60,
  momentumScore: 40,
  hoursSinceLastUpdate: 200, // > 7 days
});

assert(
  statusConfirmed === 'Confirmed',
  `Multi-source + official rilis transitions to 'Confirmed'`
);

assert(
  statusStale === 'Archived',
  `Inactive issue (>7 days) transitions to 'Archived' (Stale)`
);

// ----------------------------------------------------
// TEST 7: Dynamic Radar Purwakarta (17 Kecamatan)
// ----------------------------------------------------
console.log('\n--- TEST 7: Radar Purwakarta (17 Kecamatan) ---');

const mockPwkIssues = [
  {
    id: 'pwk-1',
    slug: 'kja-jatiluhur',
    title: 'Penataan KJA Waduk Jatiluhur',
    location: 'Purwakarta',
    district: 'Kecamatan Jatiluhur',
    category: 'Agraria',
    priority_level: 'Tinggi',
    impact_score: 90,
    momentum_score: 85,
    first_detected_at: new Date().toISOString(),
    last_updated_at: new Date().toISOString(),
  },
  {
    id: 'pwk-2',
    slug: 'umk-bungursari',
    title: 'Sengketa Hubungan Industrial Kawasan Industri Bungursari',
    location: 'Purwakarta',
    district: 'Kecamatan Bungursari',
    category: 'Ketenagakerjaan',
    priority_level: 'Sedang',
    impact_score: 80,
    momentum_score: 70,
    first_detected_at: new Date().toISOString(),
    last_updated_at: new Date().toISOString(),
  }
];

const radarResult = computeRadarPurwakarta(mockPwkIssues);

assert(
  radarResult.length === 17,
  `Radar covers all 17 Purwakarta districts (Count: ${radarResult.length})`
);

const jatiluhurRadar = radarResult.find(r => r.name.toLowerCase().includes('jatiluhur'));
assert(
  jatiluhurRadar && jatiluhurRadar.issuesCount === 1 && jatiluhurRadar.dominantCategory === 'Agraria',
  `Jatiluhur correctly aggregated from active issues (Issues: ${jatiluhurRadar?.issuesCount}, Cat: ${jatiluhurRadar?.dominantCategory})`
);

// ----------------------------------------------------
// FINAL SUMMARY
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`FASE 5 TEST RESULTS: ${passedTests}/${totalTests} PASSED`);
console.log('====================================================');

if (passedTests === totalTests) {
  console.log('🎉 ALL FASE 5 INTELLIGENCE ENGINE TESTS PASSED SUCCESFULLY!\n');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED!\n');
  process.exit(1);
}
