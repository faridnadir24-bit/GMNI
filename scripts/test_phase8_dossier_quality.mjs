import assert from 'assert';
import { 
  generateResearchDossier, 
  generateMediaBrief, 
  generatePolicyBrief, 
  generatePresentationDeck, 
  generateMeetingNotes,
  exportDossierToMarkdown 
} from '../src/lib/services/dossier-engine.ts';

console.log('====================================================');
console.log('TEST SUITE 3: DOSSIER QUALITY & MULTI-FORMAT WRITER');
console.log('====================================================\n');

const testIssue = {
  id: 'issue-dossier-test',
  slug: 'moratorium-kja-jatiluhur',
  title: 'Evaluasi Kebijakan Moratorium KJA Jatiluhur',
  description: 'Dinamika penataan zonasi keramba jaring apung dan dampaknya terhadap nelayan pembudidaya lokal.',
  location: 'Kabupaten Purwakarta',
  district: 'Kecamatan Jatiluhur',
  category: 'Agraria',
  impact_score: 88,
  momentum_score: 72,
  confidence_score: 91,
  status: 'Developing',
  first_detected_at: '2026-08-01T00:00:00Z',
  last_updated_at: '2026-08-20T00:00:00Z'
};

const testSources = [
  { id: 's1', source_name: 'Pikiran Rakyat', title: 'Nelayan Jatiluhur Minta Kompensasi', url: 'https://pikiran-rakyat.com/1', published_at: '2026-08-05' },
  { id: 's2', source_name: 'Tempo', title: 'Kebijakan Lingkungan Waduk Jatiluhur', url: 'https://tempo.co/2', published_at: '2026-08-10' }
];

const testClaims = [
  { id: 'c1', type: 'fact', content: 'Penertiban KJA mencakup lebih dari 500 petak budidaya di zona terlarang.' },
  { id: 'c2', type: 'claim', statement: 'Pemerintah daerah mengklaim program kompensasi telah disiapkan.' }
];

// 1. Generate 21-Chapter Dossier
const dossier = generateResearchDossier(testIssue, testSources, testClaims);
assert.strictEqual(dossier.chapters.length, 21, 'Must generate exactly 21 full chapters');
assert(dossier.executive_summary.length > 300, 'Executive summary must be substantive narrative');
assert(dossier.key_data_box.length >= 4, 'Key data box must contain at least 4 indicators');
assert.strictEqual(dossier.policy_scenarios.length, 3, 'Must provide 3 policy scenarios');
assert(dossier.pattern_interpretation.toUpperCase().includes('[INTERPRETASI ANALITIS]'), 'Benang merah must be labeled as analytical interpretation');
console.log('✓ 21 Chapters generated successfully with deep academic structure');

// 2. Test Multi-Format Generators
const mediaBrief = generateMediaBrief(testIssue, testSources, testClaims);
assert.strictEqual(mediaBrief.five_key_facts.length, 5, 'Media brief must provide 5 key facts');
assert.strictEqual(mediaBrief.three_key_data.length, 3, 'Media brief must provide 3 key data items');
assert(mediaBrief.one_caveat.length > 0, 'Media brief must provide methodological caveat');
console.log('✓ Media Brief generator verified (5 facts, 3 data points, 1 caveat)');

const policyBrief = generatePolicyBrief(testIssue, testSources, testClaims);
assert(policyBrief.title.includes('POLICY BRIEF'));
assert(policyBrief.key_findings.length >= 3);
assert(policyBrief.actionable_recommendations.short_term.length >= 2);
console.log('✓ Policy Brief generator verified');

const deck = generatePresentationDeck(testIssue, testSources, testClaims);
assert.strictEqual(deck.slides.length, 4, 'Slide deck must generate 4 structured slides');
assert(deck.slides[0].speaker_notes.length > 0, 'Slides must contain speaker notes');
console.log('✓ Presentation Slide Deck generator verified');

const meetingNotes = generateMeetingNotes(testIssue, testSources, testClaims);
assert(meetingNotes.critical_questions.length >= 3);
assert(meetingNotes.action_plan_items.length >= 3);
console.log('✓ Meeting Notes generator verified');

// 3. Test Markdown Export
const md = exportDossierToMarkdown(dossier);
assert(md.includes('# Evaluasi Kebijakan Moratorium KJA Jatiluhur'));
assert(md.includes('BAB I: PENDAHULUAN'));
assert(md.includes('BAB XXI: DAFTAR SUMBER'));
console.log('✓ Markdown export verified');

console.log('\n====================================================');
console.log('SUITE 3: ALL DOSSIER QUALITY TESTS PASSED (100%)');
console.log('====================================================\n');
