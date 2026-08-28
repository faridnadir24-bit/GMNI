import assert from 'assert';
import { evaluatePublicationReadiness, markDossierReviewed, calculateCitationCoverage, buildDossierCitations, generateResearchDossier } from '../src/lib/services/dossier-engine.ts';

console.log('====================================================');
console.log('TEST SUITE 4 (FASE 11): PUBLICATION QUALITY GATE');
console.log('====================================================\n');

const sampleIssue = {
  id: 'test-1',
  slug: 'test-1',
  title: 'Evaluasi Dampak Penertiban KJA Waduk Jatiluhur',
  location: 'Purwakarta',
  district: 'Jatiluhur',
  category: 'Agraria',
  impact_score: 91,
  momentum_score: 85,
  confidence_score: 80,
  first_detected_at: '2026-08-25T10:00:00Z',
  last_updated_at: '2026-08-28T10:00:00Z',
  description: 'Penertiban keramba jaring apung di Waduk Jatiluhur memicu keresahan pembudidaya lokal.'
};

const sampleSources = [
  {
    id: 'src-1',
    issue_id: 'test-1',
    source_name: 'Antara News',
    title: 'Penertiban KJA Jatiluhur dan Dampak Pembudidaya',
    url: 'https://antaranews.com/berita/kja-jatiluhur',
    source_type: 'Established Media',
    credibility_score: 90,
    published_at: '2026-08-27T08:00:00Z',
    author_or_institution: 'Antara News Jabar'
  }
];

const citations = buildDossierCitations(sampleIssue, sampleSources);
const dossier = generateResearchDossier(sampleIssue, sampleSources, []);

// 1. Initial State -> RESEARCH_DRAFT
const draftStatus = evaluatePublicationReadiness(dossier);
assert.strictEqual(draftStatus, 'RESEARCH_DRAFT', 'Unreviewed dossier must be RESEARCH_DRAFT');
console.log('✓ Initial unreviewed dossier evaluates to RESEARCH_DRAFT');

// 2. Reviewed with >=90% citation coverage -> PUBLICATION_READY
const reviewedDossier = markDossierReviewed(dossier, 'Farid Nadir', 'Ketua Tim Riset Sospol GMNI');
const readyStatus = evaluatePublicationReadiness(reviewedDossier);
assert.strictEqual(readyStatus, 'PUBLICATION_READY', 'Human reviewed with >=90% citations must be PUBLICATION_READY');
console.log('✓ Human reviewed dossier with >=90% citations promoted to PUBLICATION_READY');

console.log('\n====================================================');
console.log('SUITE 4 (PUBLICATION GATE): ALL TESTS PASSED (100%)');
console.log('====================================================\n');
