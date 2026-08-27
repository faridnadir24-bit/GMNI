import assert from 'assert';
import { 
  WEST_JAVA_REGENCIES, 
  PURWAKARTA_DISTRICTS, 
  filterIssuesByTerritory, 
  computeWestJavaRegencyBreakdown,
  calculateHonestCoverageMetrics
} from '../src/lib/services/territory-service.ts';

console.log('====================================================');
console.log('TEST SUITE 1: TERRITORY COVERAGE & HONEST INDICATORS');
console.log('====================================================\n');

// 1. Validate complete territorial definitions
assert.strictEqual(WEST_JAVA_REGENCIES.length, 27, 'Must have exactly 27 West Java Kabupaten/Kota');
console.log('✓ West Java contains exactly 27 Kabupaten/Kota');

assert.strictEqual(PURWAKARTA_DISTRICTS.length, 17, 'Must have exactly 17 Purwakarta sub-districts');
console.log('✓ Purwakarta contains exactly 17 Kecamatan');

// 2. Mock realistic multi-territory issues dataset
const mockIssues = [
  { id: '1', title: 'Isu Jatiluhur', location: 'Kabupaten Purwakarta', district: 'Kecamatan Jatiluhur' },
  { id: '2', title: 'Isu Karawang Industri', location: 'Kabupaten Karawang', district: 'Kecamatan Telukjambe' },
  { id: '3', title: 'Isu Bandung Transportasi', location: 'Kota Bandung', district: 'Kecamatan Coblong' },
  { id: '4', title: 'Isu Bekasi Lingkungan', location: 'Kabupaten Bekasi', district: 'Kecamatan Cikarang' },
  { id: '5', title: 'Isu Nasional Ketahanan Pangan', location: 'Nasional / Lintas Provinsi' }
];

// 3. Test honest coverage calculation
const metrics = calculateHonestCoverageMetrics(mockIssues);
assert.strictEqual(metrics.jabarTotalRegencies, 27);
assert.strictEqual(metrics.jabarActiveRegenciesCount, 4, 'Should detect 4 active regencies (Pwk, Krw, Bdg, Bks)');
assert.strictEqual(metrics.pwkTotalDistricts, 17);
assert.strictEqual(metrics.pwkActiveDistrictsCount, 1);
assert.strictEqual(metrics.honestSummary, '4 dari 27 Kabupaten/Kota di Jawa Barat memiliki isu terpantau aktif.');
console.log('✓ Honest coverage metric calculated accurately:', metrics.honestSummary);

// 4. Test territorial query filtering
const pwkOnly = filterIssuesByTerritory(mockIssues, 'purwakarta');
assert.strictEqual(pwkOnly.length, 1);
assert.strictEqual(pwkOnly[0].location, 'Kabupaten Purwakarta');
console.log('✓ Purwakarta filter isolates Purwakarta issues only');

const krwOnly = filterIssuesByTerritory(mockIssues, 'jabar', 'Kabupaten Karawang');
assert.strictEqual(krwOnly.length, 1);
assert.strictEqual(krwOnly[0].title, 'Isu Karawang Industri');
console.log('✓ Specific regency filter (Karawang) isolates Karawang only');

const bogorEmpty = filterIssuesByTerritory(mockIssues, 'jabar', 'Kabupaten Bogor');
assert.strictEqual(bogorEmpty.length, 0, 'Bogor with 0 issues must return empty array, no fallback');
console.log('✓ Empty regency (Bogor) returns 0 issues without fabricating data');

const nationalOnly = filterIssuesByTerritory(mockIssues, 'nasional');
assert.strictEqual(nationalOnly.length, 1);
assert.strictEqual(nationalOnly[0].title, 'Isu Nasional Ketahanan Pangan');
console.log('✓ National filter isolates national scope issues');

console.log('\n====================================================');
console.log('SUITE 1: ALL COVERAGE TESTS PASSED (100%)');
console.log('====================================================\n');
