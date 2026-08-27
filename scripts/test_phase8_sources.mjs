import assert from 'assert';
import { buildDossierCitations, generateResearchDossier } from '../src/lib/services/dossier-engine.ts';

console.log('====================================================');
console.log('TEST SUITE 2: SOURCE PROVENANCE & CITATION MAPPING');
console.log('====================================================\n');

const sampleIssue = {
  id: 'issue-test-sources',
  slug: 'uji-provensi-sumber',
  title: 'Uji Provensi Sumber dan Verifikasi Rujukan',
  description: 'Pengujian integritas rujukan sitasi dan validitas tautan artikel rujukan.',
  location: 'Purwakarta',
  category: 'Agraria',
  impact_score: 85,
  momentum_score: 60,
  confidence_score: 88,
  status: 'Confirmed',
  first_detected_at: '2026-08-01T00:00:00Z',
  last_updated_at: '2026-08-20T00:00:00Z'
};

const sampleSources = [
  {
    id: 'src-1',
    source_name: 'Kompas Regional',
    title: 'Penertiban KJA dan Dampak Ekonomi Nelayan',
    url: 'https://regional.kompas.com/read/2026/08/01/contoh',
    published_at: '2026-08-01T10:00:00Z',
    credibility_score: 90
  },
  {
    id: 'src-2',
    source_name: 'Detik Jabar',
    title: 'Warga Purwakarta Ajukan Permohonan Kompensasi',
    url: 'https://news.detik.com/jabar/berita/contoh',
    published_at: '2026-08-05T14:00:00Z',
    credibility_score: 85
  }
];

// 1. Test buildDossierCitations
const citations = buildDossierCitations(sampleIssue, sampleSources);
assert.strictEqual(citations.length, 2, 'Must map exact number of provided sources');
assert.strictEqual(citations[0].badge, '[Sumber 01]');
assert.strictEqual(citations[0].source_name, 'Kompas Regional');
assert.strictEqual(citations[0].verification_status, 'SUPPORTED');
assert(citations[0].url.startsWith('https://'), 'URL must be a valid https address');
console.log('✓ Citation badges built correctly with valid URLs:', citations[0].badge, citations[0].url);

// 2. Test citation mapping within 21-Chapter Dossier
const dossier = generateResearchDossier(sampleIssue, sampleSources, []);
assert.strictEqual(dossier.sources_list.length, 2);
assert(dossier.executive_summary.includes('[Sumber 01]'), 'Executive summary must cite [Sumber 01]');
assert(dossier.key_data_box.some(k => k.source_badge === '[Sumber 01]'), 'Key Data Box must reference citation badge');
console.log('✓ Provenance mapping in dossier verified across Executive Summary and Key Data Box');

console.log('\n====================================================');
console.log('SUITE 2: ALL SOURCE PROVENANCE TESTS PASSED (100%)');
console.log('====================================================\n');
