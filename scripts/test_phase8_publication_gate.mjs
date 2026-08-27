import assert from 'assert';
import { 
  generateResearchDossier, 
  markDossierReviewed, 
  evaluatePublicationReadiness 
} from '../src/lib/services/dossier-engine.ts';

console.log('====================================================');
console.log('TEST SUITE 5: PUBLICATION READINESS QUALITY GATE');
console.log('====================================================\n');

const testIssue = {
  id: 'gate-issue-test',
  slug: 'uji-gate-publikasi',
  title: 'Evaluasi Kesiapan Publikasi Naskah Riset',
  description: 'Pengujian kepatuhan gerbang publikasi kebijakan publik GMNI.',
  location: 'Purwakarta',
  category: 'Pemerintahan',
  impact_score: 80,
  momentum_score: 70,
  confidence_score: 85,
  status: 'Confirmed',
  first_detected_at: '2026-08-01T00:00:00Z',
  last_updated_at: '2026-08-20T00:00:00Z'
};

const testSources = [
  { id: 's1', source_name: 'Antara News', title: 'Rilis Pemda Purwakarta', url: 'https://antaranews.com/1', published_at: '2026-08-01' },
  { id: 's2', source_name: 'Kompas', title: 'Audit Kebijakan Daerah', url: 'https://kompas.com/2', published_at: '2026-08-02' }
];

// 1. Initial State: Unreviewed -> RESEARCH_DRAFT
const initialDossier = generateResearchDossier(testIssue, testSources, []);
assert.strictEqual(initialDossier.publication_readiness, 'RESEARCH_DRAFT');
assert.strictEqual(evaluatePublicationReadiness(initialDossier), 'RESEARCH_DRAFT');
console.log('✓ Initial state correctly evaluated as RESEARCH_DRAFT');

// 2. Human Review with Citation Coverage >= 90% -> PUBLICATION_READY
const reviewedDossier = markDossierReviewed(initialDossier, 'Farid Nadir', 'Tim Peneliti Sospol');
assert.strictEqual(reviewedDossier.human_review.is_reviewed, true);
assert.strictEqual(reviewedDossier.human_review.reviewer_name, 'Farid Nadir');
assert(reviewedDossier.citation_coverage >= 90, 'Citation coverage must be >= 90%');
assert.strictEqual(reviewedDossier.publication_readiness, 'PUBLICATION_READY');
console.log('✓ Human reviewed dossier with >=90% citation coverage upgraded to PUBLICATION_READY');

// 3. Human Review with Low Coverage (<90%) -> RESEARCH_REVIEWED
const lowCoverageDossier = {
  ...reviewedDossier,
  citation_coverage: 65,
  quality_warning: 'PERINGATAN KUALITAS: Cakupan sitasi hanya 65%'
};
assert.strictEqual(evaluatePublicationReadiness(lowCoverageDossier), 'RESEARCH_REVIEWED');
console.log('✓ Dossier with <90% citation coverage gated to RESEARCH_REVIEWED (not publication ready)');

console.log('\n====================================================');
console.log('SUITE 5: ALL PUBLICATION GATE TESTS PASSED (100%)');
console.log('====================================================\n');
