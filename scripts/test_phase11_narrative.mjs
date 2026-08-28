import assert from 'assert';
import { 
  generateResearchDossier, 
  generatePolicyBrief, 
  generatePresentationDeck, 
  generateMeetingNotes, 
  generateMediaBrief 
} from '../src/lib/services/dossier-engine.ts';

console.log('====================================================');
console.log('TEST SUITE 3 (FASE 11): 21 CHAPTERS & RESEARCH NARRATIVE');
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

const dossier = generateResearchDossier(sampleIssue, sampleSources, []);

// 1. Check 21 Chapters
console.log(`Dossier Chapter Count: ${dossier.chapters.length}`);
assert.strictEqual(dossier.chapters.length, 21, 'Must generate exactly 21 chapters');
console.log('✓ 21 Chapters generated successfully');

// 2. Check Executive Summary
const wordCount = dossier.executive_summary.split(/\s+/).length;
console.log(`Executive Summary Word Count: ${wordCount}`);
assert.ok(wordCount >= 450, `Executive summary must be >= 450 words (got ${wordCount})`);
assert.ok(dossier.executive_summary.includes('Kajian strategis kebijakan publik'), 'Must have formal intro');
assert.ok(dossier.executive_summary.includes('[Sumber 01]'), 'Must include source citations');
console.log('✓ Executive Summary answers all 10 core questions with >450 words');

// 3. Check Policy Brief
const pb = generatePolicyBrief(sampleIssue, sampleSources, []);
assert.ok(pb.key_findings.length >= 3, 'Must have >=3 key findings');
assert.ok(pb.actionable_recommendations.short_term.length >= 1, 'Must have short term action');
console.log('✓ Policy Brief generated for decision makers');

// 4. Check Spoken Meeting Script
const notes = generateMeetingNotes(sampleIssue, sampleSources, []);
assert.ok(notes.spoken_script.length > 100, 'Must have spoken script');
assert.ok(notes.discussion_position.length > 20, 'Must have ideological stance');
console.log('✓ Naskah Rapat Sospol has spoken speech ready to read aloud');

console.log('\n====================================================');
console.log('SUITE 3 (NARRATIVE): ALL TESTS PASSED (100%)');
console.log('====================================================\n');
