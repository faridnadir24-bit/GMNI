import assert from 'assert';
import { 
  WEST_JAVA_REGENCIES, 
  PURWAKARTA_DISTRICTS, 
  filterIssuesByTerritory, 
  calculateHonestCoverageMetrics 
} from '../src/lib/services/territory-service.ts';

console.log('====================================================');
console.log('TEST SUITE 2 (FASE 11): 27 REGENCIES & ZERO FALLBACK');
console.log('====================================================\n');

// 1. Check West Java Regencies count
assert.strictEqual(WEST_JAVA_REGENCIES.length, 27, 'West Java must have exactly 27 regencies/cities');
console.log('✓ West Java contains exactly 27 Kabupaten/Kota');

// 2. Check Purwakarta Districts count
assert.strictEqual(PURWAKARTA_DISTRICTS.length, 17, 'Purwakarta must have exactly 17 kecamatan');
console.log('✓ Purwakarta contains exactly 17 Kecamatan');

// 3. Test dummy dataset
const testIssues = [
  { id: '1', title: 'Isu Jatiluhur', location: 'Purwakarta', district: 'Jatiluhur', scope: 'REGENCY_CITY' },
  { id: '2', title: 'Isu Bungursari', location: 'Purwakarta', district: 'Bungursari', scope: 'REGENCY_CITY' },
  { id: '3', title: 'Isu Bogor', location: 'Kabupaten Bogor', district: 'Cibinong', scope: 'REGENCY_CITY' },
  { id: '4', title: 'Isu Nasional', location: 'Nasional', district: null, scope: 'NATIONAL' }
];

// 4. Test Purwakarta Filter
const pwk = filterIssuesByTerritory(testIssues, 'purwakarta');
assert.strictEqual(pwk.length, 2);
console.log('✓ Purwakarta filter isolates Purwakarta issues only');

// 5. Test Jabar Filter
const jabar = filterIssuesByTerritory(testIssues, 'jabar');
assert.strictEqual(jabar.length, 3, 'Must match 2 Purwakarta + 1 Bogor');
console.log('✓ Jawa Barat aggregates all 3 West Java issues without national issues');

// 6. Test Specific Empty Regency (Karawang) -> Zero fallback!
const karawang = filterIssuesByTerritory(testIssues, 'jabar', 'Kabupaten Karawang');
assert.strictEqual(karawang.length, 0, 'Karawang must be 0 issues (no fallback to Purwakarta)');
console.log('✓ Empty regency (Karawang) returns 0 without falling back to Purwakarta');

// 7. Test Honest Coverage Metric
const metrics = calculateHonestCoverageMetrics(testIssues);
console.log('✓ Honest coverage metric:', metrics.honestSummary);
assert.strictEqual(metrics.jabarActiveRegenciesCount, 2);

console.log('\n====================================================');
console.log('SUITE 2 (TERRITORY): ALL TESTS PASSED (100%)');
console.log('====================================================\n');
