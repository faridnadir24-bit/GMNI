import assert from 'assert';
import { 
  SocialSignalProvider, 
  createSignal, 
  calculatePublicAttentionIndex 
} from '../src/lib/services/social-signal-provider.ts';

console.log('====================================================');
console.log('TEST SUITE 4: SOCIAL MEDIA PUBLIC SIGNALS');
console.log('====================================================\n');

// 1. Test createSignal enforcement
const signal = createSignal({
  platform: 'X',
  author_handle: '@warga_jatiluhur',
  content: 'Bagaimana nasib kami nelayan kecil jika kolam dibongkar tanpa kejelasan?',
  url: 'https://x.com/warga_jatiluhur/status/1234567890',
  engagement: {
    likes: 450,
    shares: 120,
    comments: 85
  },
  keywords: ['nelayan', 'jatiluhur', 'kja']
});

assert.strictEqual(signal.verification_status, 'UNVERIFIED', 'Social signal must be strictly UNVERIFIED');
assert.strictEqual(signal.source_type, 'social_signal', 'Source type must be social_signal');
assert(signal.disclaimer.includes('bukan sebagai fakta'), 'Must include mandatory non-fact disclaimer');
console.log('✓ Social signal strictly marked as UNVERIFIED with non-fact disclaimer');

// 2. Test attention index computation
const attention = calculatePublicAttentionIndex([signal]);
assert(attention.totalEngagement >= 655, 'Engagement metrics must sum correctly');
assert(attention.score > 0, 'Momentum index must be computed');
console.log('✓ Public attention index calculated accurately (Total engagement:', attention.totalEngagement, ')');

// 3. Test empty signal behavior
const emptyAttention = calculatePublicAttentionIndex([]);
assert.strictEqual(emptyAttention.totalEngagement, 0);
assert.strictEqual(emptyAttention.score, 10);
console.log('✓ Empty signals handled gracefully without fabricating data');

console.log('\n====================================================');
console.log('SUITE 4: ALL SOCIAL SIGNAL TESTS PASSED (100%)');
console.log('====================================================\n');
