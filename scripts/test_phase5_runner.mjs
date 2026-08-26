/**
 * FASE 5 PURE ESM TEST RUNNER
 */

// Import compiled or source functions directly
import { 
  calculateTokenSimilarity, 
  tokenizeAndClean, 
  extractEntities, 
  matchArticleToIssue, 
  generateNeutralIssueTitle 
} from '../src/lib/services/semantic-cluster.ts';

import { 
  extractNumericFacts, 
  detectContradictions 
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
console.log('RUANG ISU GMNI — FASE 5 INTELLIGENCE VERIFICATION');
console.log('====================================================\n');

let passed = 0;
let total = 0;

function test(description, fn) {
  total++;
  try {
    fn();
    console.log(`✅ [PASS] ${description}`);
    passed++;
  } catch (err) {
    console.error(`❌ [FAIL] ${description}:`, err.message);
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) throw new Error(`Expected ${expected}, but got ${actual}`);
    },
    toBeGreaterThanOrEqual(expected) {
      if (actual < expected) throw new Error(`Expected >= ${expected}, but got ${actual}`);
    },
    toBeLessThanOrEqual(expected) {
      if (actual > expected) throw new Error(`Expected <= ${expected}, but got ${actual}`);
    },
    toBeTruthy() {
      if (!actual) throw new Error(`Expected truthy, but got ${actual}`);
    },
    toBeFalsy() {
      if (actual) throw new Error(`Expected falsy, but got ${actual}`);
    }
  };
}

// 1. Semantic Token & Bigram Similarity
test('Token Similarity: synonym and bigram expansion', () => {
  const score = calculateTokenSimilarity(
    'Penertiban Keramba Jaring Apung Waduk Jatiluhur',
    'Pembudidaya Ikan Protes Pembongkaran KJA Jatiluhur'
  );
  expect(score).toBeGreaterThanOrEqual(0.40);
});

// 2. Entity Extraction
test('Entity Extraction: identifies institutions and Purwakarta districts', () => {
  const text = 'Satpol PP dan Pemkab Purwakarta merelokasi peternak di Jatiluhur dan Pasawahan bersama serikat FSPMI.';
  const entities = extractEntities(text);
  expect(entities.government_bodies.length).toBeGreaterThanOrEqual(1);
  expect(entities.locations.includes('Jatiluhur')).toBeTruthy();
  expect(entities.locations.includes('Pasawahan')).toBeTruthy();
});

// 3. Semantic Issue Matcher (ARTIKEL BARU ≠ ISU BARU)
test('Issue Matcher: Merges article into existing issue when similarity is high', () => {
  const existing = [
    {
      id: 'iss-kja-1',
      title: 'Penertiban Keramba Jaring Apung (KJA) Waduk Jatiluhur',
      category: 'Agraria',
      location: 'Purwakarta',
      sub_location: 'Kecamatan Jatiluhur',
      summary: 'Penataan zonasi KJA dan penertiban keramba di Danau Jatiluhur.',
      last_activity_at: new Date().toISOString(),
    }
  ];

  const incoming = {
    title: 'BREAKING NEWS: Pembudidaya Ikan Protes Pembongkaran Keramba di Waduk Jatiluhur!',
    summary: 'Ratusan nelayan dan peternak menolak penertiban KJA oleh Satpol PP.',
    category: 'Agraria',
    location: 'Purwakarta',
    sub_location: 'Kecamatan Jatiluhur',
  };

  const res = matchArticleToIssue(incoming, existing);
  expect(res.isMatch).toBe(true);
  expect(res.matchedIssueId).toBe('iss-kja-1');
  expect(res.matchScore).toBeGreaterThanOrEqual(70);
});

// 4. Canonical Neutral Title Generator
test('Canonical Title Generator: strips clickbait prefix and appends territory', () => {
  const rawTitle = 'VIRAL HEBOH!! Buruh Purwakarta Tuntut Kenaikan UMK 2026 - detikNews';
  const neutral = generateNeutralIssueTitle(rawTitle, 'Ketenagakerjaan', 'Purwakarta', 'Kecamatan Purwakarta');
  expect(neutral.includes('VIRAL')).toBe(false);
  expect(neutral.includes('HEBOH')).toBe(false);
  expect(neutral.includes('detikNews')).toBe(false);
  expect(neutral.length).toBeGreaterThanOrEqual(15);
});

// 5. Numeric Contradiction Engine
test('Contradiction Engine: flags conflicting numeric figures neutrally', () => {
  const textA = 'Satpol PP mencatat 71 petak keramba KJA ilegal dibongkar.';
  const textB = 'Asosiasi nelayan menyebut 120 petak keramba dibongkar sepihak.';
  
  const contradictions = detectContradictions(
    textB,
    'Asosiasi Nelayan',
    new Date().toISOString(),
    [{ sourceName: 'Satpol PP', content: textA, publishedAt: new Date().toISOString() }]
  );

  expect(contradictions.length).toBeGreaterThanOrEqual(1);
  expect(contradictions[0].topic.includes('LUAS') || contradictions[0].topic.includes('DATA')).toBeTruthy();
});

// 6. Confidence Engine & Explainability
test('Confidence Engine: computes multi-factor score and explainability factors', () => {
  const conf = calculateConfidence({
    sourceCount: 5,
    officialCount: 1,
    nationalCount: 2,
    localCount: 2,
    contradictionCount: 0,
    hoursSinceLastUpdate: 1,
  });

  expect(conf.score).toBeGreaterThanOrEqual(80);
  expect(conf.level).toBe('Tinggi');
  expect(conf.factors.length).toBeGreaterThanOrEqual(3);
});

// 7. Change Detection Engine
test('Change Detection: escalates severity on official statement and captures delta', () => {
  const change = detectIssueChanges(
    {
      id: 'iss-1',
      title: 'Penataan KJA Jatiluhur',
      source_urls: ['https://news.com/1'],
      source_names: ['Radar Purwakarta'],
      verified_facts: ['Penertiban KJA dimulai.'],
      confidence_score: 70,
      momentum_score: 65,
      priority_score: 75,
    },
    {
      url: 'https://pemkab.go.id/rilis',
      title: 'Bupati Terbitkan SK Zonasi Budidaya KJA',
      summary: 'Pemkab mengalokasikan anggaran Rp5 miliar.',
      sourceName: 'Pemkab Purwakarta',
      sourceType: 'official',
      publishedAt: new Date().toISOString(),
      verifiedFacts: ['Pemkab mengalokasikan anggaran Rp5 miliar.'],
      claims: ['Penataan ditargetkan tuntas akhir tahun.'],
    },
    85,
    78,
    84
  );

  expect(change.hasChanges).toBe(true);
  expect(change.severity === 'MEDIUM' || change.severity === 'HIGH').toBeTruthy();
  expect(change.newEvents.length).toBeGreaterThanOrEqual(1);
});

// 8. Status Engine Transition
test('Status Engine: moves to Confirmed with official statement or Archived when stale', () => {
  const confirmed = determineIssueStatus({
    sourceCount: 4,
    officialCount: 1,
    confidenceScore: 80,
    momentumScore: 70,
    hoursSinceLastUpdate: 2,
  });
  expect(confirmed).toBe('Confirmed');

  const stale = determineIssueStatus({
    sourceCount: 2,
    officialCount: 0,
    confidenceScore: 60,
    momentumScore: 30,
    hoursSinceLastUpdate: 200,
  });
  expect(stale).toBe('Archived');
});

// 9. Radar Purwakarta Aggregation (17 Districts)
test('Radar Purwakarta: accurately computes 17 districts dynamically', () => {
  const mockIssues = [
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
    }
  ];

  const radar = computeRadarPurwakarta(mockIssues);
  expect(radar.length).toBe(17);
  const jatiluhur = radar.find(r => r.name.toLowerCase().includes('jatiluhur'));
  expect(jatiluhur.issuesCount).toBe(1);
  expect(jatiluhur.status).toBe('Kritis');
});

console.log('\n====================================================');
console.log(`FASE 5 VERIFICATION: ${passed}/${total} TESTS PASSED`);
console.log('====================================================\n');
