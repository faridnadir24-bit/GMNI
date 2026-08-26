import { ConfidenceExplanation } from '@/types';

export interface ConfidenceInput {
  sourceCount: number;
  officialCount: number;
  nationalCount: number;
  localCount: number;
  socialCount?: number;
  contradictionCount?: number;
  hoursSinceLastUpdate?: number;
  hasVerifiedFacts?: boolean;
}

/**
 * CONFIDENCE ENGINE & EXPLAINABILITY
 * Calculates empirical confidence score (0-100) and produces transparent explanation factors.
 */
export function calculateConfidence(input: ConfidenceInput): ConfidenceExplanation {
  const {
    sourceCount = 1,
    officialCount = 0,
    nationalCount = 0,
    localCount = 0,
    socialCount = 0,
    contradictionCount = 0,
    hoursSinceLastUpdate = 2,
    hasVerifiedFacts = true,
  } = input;

  let baseScore = 40;
  const factors: ConfidenceExplanation['factors'] = [];

  // 1. Source Volume (up to +25)
  const volumePoints = Math.min(25, sourceCount * 5);
  baseScore += volumePoints;
  if (sourceCount >= 3) {
    factors.push({
      label: 'Volume Sumber Terverifikasi',
      value: `${sourceCount} sumber independen terdata`,
      positive: true,
    });
  } else {
    factors.push({
      label: 'Volume Sumber Masih Terbatas',
      value: `${sourceCount} sumber awal terdata`,
      positive: false,
    });
  }

  // 2. Official Source Presence (+15)
  if (officialCount > 0) {
    baseScore += 15;
    factors.push({
      label: 'Sumber Resmi Pemerintah / Institusi',
      value: `${officialCount} rujukan resmi terkonfirmasi`,
      positive: true,
    });
  } else {
    factors.push({
      label: 'Belum Ada Rilis Resmi',
      value: 'Data masih mengandalkan liputan pers umum',
      positive: false,
    });
  }

  // 3. Source Diversity (+15)
  let categoriesCount = 0;
  if (officialCount > 0) categoriesCount++;
  if (nationalCount > 0) categoriesCount++;
  if (localCount > 0) categoriesCount++;
  if (socialCount > 0) categoriesCount++;

  if (categoriesCount >= 3) {
    baseScore += 15;
    factors.push({
      label: 'Keragaman Sumber Tinggi',
      value: `${categoriesCount} tipe sumber berbeda (Resmi, Nasional, Lokal)`,
      positive: true,
    });
  } else if (categoriesCount >= 2) {
    baseScore += 10;
    factors.push({
      label: 'Keragaman Sumber Moderat',
      value: `${categoriesCount} tipe sumber berbeda`,
      positive: true,
    });
  }

  // 4. Recency & Freshness (+10 / -10)
  let freshness_status: ConfidenceExplanation['freshness_status'] = 'Terbaru';
  if (hoursSinceLastUpdate <= 1) {
    freshness_status = 'Sangat Baru';
    baseScore += 10;
    factors.push({
      label: 'Kesegaran Informasi',
      value: 'Diperbarui < 1 jam yang lalu',
      positive: true,
    });
  } else if (hoursSinceLastUpdate <= 24) {
    freshness_status = 'Terbaru';
    baseScore += 5;
    factors.push({
      label: 'Kesegaran Informasi',
      value: `Diperbarui ${Math.round(hoursSinceLastUpdate)} jam yang lalu`,
      positive: true,
    });
  } else if (hoursSinceLastUpdate <= 168) {
    freshness_status = 'Perlu Pembaruan';
    baseScore -= 5;
    factors.push({
      label: 'Perlu Pembaruan Data',
      value: `Tidak ada pembaruan dalam ${Math.round(hoursSinceLastUpdate / 24)} hari`,
      positive: false,
    });
  } else {
    freshness_status = 'Stale';
    baseScore -= 15;
    factors.push({
      label: 'Status Stale / Tidak Aktif',
      value: 'Tidak ada pembaruan > 7 hari',
      positive: false,
    });
  }

  // 5. Contradiction Penalty (-10 per contradiction)
  if (contradictionCount > 0) {
    const penalty = Math.min(25, contradictionCount * 10);
    baseScore -= penalty;
    factors.push({
      label: 'Selisih Data Antar Sumber Terdeteksi',
      value: `${contradictionCount} kontradiksi angka/pernyataan terdeteksi`,
      positive: false,
    });
  } else {
    factors.push({
      label: 'Konsistensi Data',
      value: 'Tidak ada kontradiksi mayor antar sumber',
      positive: true,
    });
  }

  // Final score clamping
  const finalScore = Math.max(10, Math.min(100, Math.round(baseScore)));

  let level: ConfidenceExplanation['level'] = 'Awal';
  if (finalScore >= 80) level = 'Tinggi';
  else if (finalScore >= 60) level = 'Sedang';

  const explanation = `${sourceCount} sumber terverifikasi (${officialCount} resmi, ${nationalCount + localCount} independen), ${contradictionCount === 0 ? 'tanpa kontradiksi mayor' : `${contradictionCount} kontradiksi dalam proses validasi`}, status kesegaran ${freshness_status.toLowerCase()}.`;

  return {
    score: finalScore,
    level,
    explanation,
    factors,
    source_diversity_count: categoriesCount,
    official_sources_count: officialCount,
    independent_sources_count: nationalCount + localCount,
    contradictions_count: contradictionCount,
    freshness_status,
  };
}
