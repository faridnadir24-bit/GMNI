import assert from 'assert';
import { generateSocialMediaContent } from '../src/lib/services/dossier-engine.ts';

console.log('====================================================');
console.log('TEST SUITE 5 (FASE 11): SOCIAL MEDIA EVIDENCE SAFETY');
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
  last_updated_at: '2026-08-28T10:00:00Z'
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

const social = generateSocialMediaContent(sampleIssue, sampleSources, []);

// 1. Instagram Carousel (8-10 slides)
assert.strictEqual(social.instagram_carousel.length, 10, 'Must have 10 slides');
social.instagram_carousel.forEach(slide => {
  assert.ok(slide.citation && slide.citation.startsWith('[Sumber '), 'Every slide must cite source');
});
console.log('✓ Instagram Carousel has 10 slides with source citations on all slides');

// 2. X / Twitter Thread (8-10 tweets)
const thread = social.twitter_thread || social.x_thread || [];
assert.strictEqual(thread.length, 10, 'Must have 10 tweets');
thread.forEach(t => {
  assert.ok(t.citation && t.citation.startsWith('[Sumber '), 'Every tweet must cite source');
});
console.log('✓ X / Twitter Thread has 10 tweets with source citations');

// 3. Short Video Script
assert.ok(social.short_video_script.hook.length > 10, 'Must have video hook');
assert.strictEqual(social.short_video_script.body_points.length, 3, 'Must have 3 body points');
assert.ok(social.short_video_script.call_to_action.length > 10, 'Must have CTA');
console.log('✓ Short Video Script has Hook, 3 Body Points, and Call to Action');

// 4. Disclaimer
assert.ok(social.disclaimer.includes('Marhaenisme'), 'Must have Marhaenisme analysis disclaimer');
console.log('✓ Social media safety disclaimer verified');

console.log('\n====================================================');
console.log('SUITE 5 (SOCIAL): ALL TESTS PASSED (100%)');
console.log('====================================================\n');
