import assert from 'assert';
import { buildDossierCitations } from '../src/lib/services/dossier-engine.ts';

console.log('====================================================');
console.log('TEST SUITE 1 (FASE 11): SOURCE REGISTER & URL VALIDATION');
console.log('====================================================\n');

const sampleIssue = {
  id: 'test-issue-1',
  slug: 'test-issue-1',
  title: 'Evaluasi Penertiban KJA Waduk Jatiluhur',
  location: 'Purwakarta',
  category: 'Agraria',
  impact_score: 90,
  confidence_score: 85,
  first_detected_at: '2026-08-25T10:00:00Z',
  last_updated_at: '2026-08-28T10:00:00Z'
};

const sampleSources = [
  {
    id: 'src-1',
    issue_id: 'test-issue-1',
    source_name: 'Antara News',
    title: 'Penertiban KJA Jatiluhur Berdampak pada Pembudidaya',
    url: 'https://www.antaranews.com/berita/5712108/penertiban-kja-jatiluhur',
    source_type: 'Established Media',
    credibility_score: 90,
    published_at: '2026-08-27T08:00:00Z',
    author_or_institution: 'Budi Santoso (Jurnalis Antara)'
  },
  {
    id: 'src-2',
    issue_id: 'test-issue-1',
    source_name: 'Twitter / X Signal',
    title: 'Warga Keluhkan Penertiban KJA Tanpa Kompensasi',
    url: 'https://x.com/warga_jatiluhur/status/123456789',
    source_type: 'Social Media',
    credibility_score: 45,
    published_at: '2026-08-27T12:00:00Z',
    author_or_institution: '@warga_jatiluhur'
  },
  {
    id: 'src-3',
    issue_id: 'test-issue-1',
    source_name: 'Pemkab Purwakarta',
    title: 'Surat Edaran Penataan Kawasan Konservasi Air',
    url: 'https://purwakartakab.go.id/berita/penataan-kja-2026',
    source_type: 'Official Source',
    credibility_score: 95,
    published_at: '2026-08-26T09:00:00Z',
    author_or_institution: 'Dinas Perikanan & Peternakan'
  }
];

const citations = buildDossierCitations(sampleIssue, sampleSources);

console.log('✓ Citations built:', citations.length);
assert.strictEqual(citations.length, 3, 'Must produce 3 citations');

// 1. Check Source 1 (National Media)
console.log('Checking Source 1:');
assert.strictEqual(citations[0].badge, '[Sumber 01]');
assert.strictEqual(citations[0].source_type, 'NATIONAL_MEDIA');
assert.strictEqual(citations[0].verification_status, 'SUPPORTED');
assert.strictEqual(citations[0].author, 'Budi Santoso (Jurnalis Antara)');
assert.ok(citations[0].supported_facts[0].startsWith('[F01]'), 'Must map to [F01]');
console.log('✓ Source 1 mapped to [Sumber 01] with author and [F01] fact mapping');

// 2. Check Source 2 (Social Media -> UNVERIFIED)
console.log('Checking Source 2:');
assert.strictEqual(citations[1].badge, '[Sumber 02]');
assert.strictEqual(citations[1].source_type, 'SOCIAL_SIGNAL');
assert.strictEqual(citations[1].verification_status, 'UNVERIFIED');
console.log('✓ Social media correctly isolated as SOCIAL_SIGNAL and UNVERIFIED');

// 3. Check Source 3 (Official Government)
console.log('Checking Source 3:');
assert.strictEqual(citations[2].badge, '[Sumber 03]');
assert.strictEqual(citations[2].source_type, 'OFFICIAL');
assert.strictEqual(citations[2].verification_status, 'SUPPORTED');
console.log('✓ Official source correctly classified as OFFICIAL');

// 4. URL Validation
citations.forEach(c => {
  assert.ok(c.url.startsWith('https://'), `URL must be valid HTTPS: ${c.url}`);
  assert.ok(!c.url.includes('localhost'), 'No localhost URLs');
});
console.log('✓ All source URLs are valid HTTPS links');

console.log('\n====================================================');
console.log('SUITE 1 (SOURCES): ALL TESTS PASSED (100%)');
console.log('====================================================\n');
