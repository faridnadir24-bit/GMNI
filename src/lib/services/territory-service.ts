import { Issue } from '@/types';

export interface RegencyInfo {
  name: string;
  type: 'Kabupaten' | 'Kota';
  province: 'Jawa Barat';
  aliases: string[];
}

export const WEST_JAVA_REGENCIES: RegencyInfo[] = [
  { name: 'Kabupaten Purwakarta', type: 'Kabupaten', province: 'Jawa Barat', aliases: ['purwakarta', 'kab. purwakarta', 'kabupaten purwakarta'] },
  { name: 'Kabupaten Karawang', type: 'Kabupaten', province: 'Jawa Barat', aliases: ['karawang', 'kab. karawang', 'kabupaten karawang'] },
  { name: 'Kabupaten Bekasi', type: 'Kabupaten', province: 'Jawa Barat', aliases: ['bekasi', 'kab. bekasi', 'kabupaten bekasi', 'cikarang'] },
  { name: 'Kabupaten Subang', type: 'Kabupaten', province: 'Jawa Barat', aliases: ['subang', 'kab. subang', 'kabupaten subang'] },
  { name: 'Kabupaten Bogor', type: 'Kabupaten', province: 'Jawa Barat', aliases: ['bogor', 'kab. bogor', 'kabupaten bogor', 'cibinong'] },
  { name: 'Kabupaten Sukabumi', type: 'Kabupaten', province: 'Jawa Barat', aliases: ['sukabumi', 'kab. sukabumi', 'kabupaten sukabumi', 'palabuhanratu'] },
  { name: 'Kabupaten Cianjur', type: 'Kabupaten', province: 'Jawa Barat', aliases: ['cianjur', 'kab. cianjur', 'kabupaten cianjur'] },
  { name: 'Kabupaten Bandung', type: 'Kabupaten', province: 'Jawa Barat', aliases: ['kab. bandung', 'kabupaten bandung', 'soreang'] },
  { name: 'Kabupaten Bandung Barat', type: 'Kabupaten', province: 'Jawa Barat', aliases: ['bandung barat', 'kbb', 'ngamprah', 'padalarang'] },
  { name: 'Kabupaten Garut', type: 'Kabupaten', province: 'Jawa Barat', aliases: ['garut', 'kab. garut', 'kabupaten garut'] },
  { name: 'Kabupaten Tasikmalaya', type: 'Kabupaten', province: 'Jawa Barat', aliases: ['kab. tasikmalaya', 'kabupaten tasikmalaya', 'singaparna'] },
  { name: 'Kabupaten Ciamis', type: 'Kabupaten', province: 'Jawa Barat', aliases: ['ciamis', 'kab. ciamis', 'kabupaten ciamis'] },
  { name: 'Kabupaten Kuningan', type: 'Kabupaten', province: 'Jawa Barat', aliases: ['kuningan', 'kab. kuningan', 'kabupaten kuningan'] },
  { name: 'Kabupaten Cirebon', type: 'Kabupaten', province: 'Jawa Barat', aliases: ['kab. cirebon', 'kabupaten cirebon', 'sumber'] },
  { name: 'Kabupaten Majalengka', type: 'Kabupaten', province: 'Jawa Barat', aliases: ['majalengka', 'kab. majalengka', 'kabupaten majalengka'] },
  { name: 'Kabupaten Sumedang', type: 'Kabupaten', province: 'Jawa Barat', aliases: ['sumedang', 'kab. sumedang', 'kabupaten sumedang'] },
  { name: 'Kabupaten Indramayu', type: 'Kabupaten', province: 'Jawa Barat', aliases: ['indramayu', 'kab. indramayu', 'kabupaten indramayu'] },
  { name: 'Kabupaten Pangandaran', type: 'Kabupaten', province: 'Jawa Barat', aliases: ['pangandaran', 'kab. pangandaran', 'kabupaten pangandaran', 'parigi'] },
  { name: 'Kota Bandung', type: 'Kota', province: 'Jawa Barat', aliases: ['kota bandung', 'bandung'] },
  { name: 'Kota Bogor', type: 'Kota', province: 'Jawa Barat', aliases: ['kota bogor'] },
  { name: 'Kota Bekasi', type: 'Kota', province: 'Jawa Barat', aliases: ['kota bekasi'] },
  { name: 'Kota Depok', type: 'Kota', province: 'Jawa Barat', aliases: ['depok', 'kota depok'] },
  { name: 'Kota Cimahi', type: 'Kota', province: 'Jawa Barat', aliases: ['cimahi', 'kota cimahi'] },
  { name: 'Kota Tasikmalaya', type: 'Kota', province: 'Jawa Barat', aliases: ['kota tasikmalaya', 'kota tasik'] },
  { name: 'Kota Cirebon', type: 'Kota', province: 'Jawa Barat', aliases: ['kota cirebon'] },
  { name: 'Kota Sukabumi', type: 'Kota', province: 'Jawa Barat', aliases: ['kota sukabumi'] },
  { name: 'Kota Banjar', type: 'Kota', province: 'Jawa Barat', aliases: ['banjar', 'kota banjar', 'banjar patroman'] }
];

export const PURWAKARTA_DISTRICTS = [
  'Purwakarta',
  'Jatiluhur',
  'Campaka',
  'Pasawahan',
  'Plered',
  'Sukatani',
  'Darangdan',
  'Maniis',
  'Tegalwaru',
  'Wanayasa',
  'Kiarapedes',
  'Bojong',
  'Pondoksalam',
  'Cibatu',
  'Babakancikao',
  'Bungursari',
  'Sukasari'
];

export type TerritoryScope = 'purwakarta' | 'jabar' | 'nasional' | 'all';

/**
 * Matches an issue's location string against a West Java regency
 */
export function matchIssueToRegency(issue: Issue, regency: RegencyInfo): boolean {
  const loc = (issue.location || '').toLowerCase();
  const title = (issue.title || '').toLowerCase();
  const desc = (issue.description || '').toLowerCase();
  const district = (issue.district || '').toLowerCase();

  return regency.aliases.some(alias => 
    loc.includes(alias) || 
    district.includes(alias) ||
    title.includes(` ${alias}`) ||
    desc.includes(` ${alias}`)
  );
}

/**
 * Filter issues by territory hierarchy without Purwakarta bias
 */
export function filterIssuesByTerritory(
  issues: Issue[],
  scope: TerritoryScope,
  specificLocation?: string
): Issue[] {
  if (scope === 'all') return issues;

  if (scope === 'purwakarta') {
    return issues.filter(i => {
      const isPwk = (i.location || '').toLowerCase().includes('purwakarta') ||
                    (i.district || '').toLowerCase().includes('purwakarta') ||
                    PURWAKARTA_DISTRICTS.some(d => (i.district || '').toLowerCase().includes(d.toLowerCase()));
      
      if (!isPwk) return false;
      if (specificLocation && specificLocation !== 'Semua Kecamatan' && specificLocation !== 'all') {
        const subQuery = specificLocation.toLowerCase().replace('kec. ', '').replace('kecamatan ', '').trim();
        return (i.district || '').toLowerCase().includes(subQuery);
      }
      return true;
    });
  }

  if (scope === 'jabar') {
    return issues.filter(i => {
      const loc = (i.location || '').toLowerCase();
      const isJabarGeneric = loc.includes('jawa barat') || loc.includes('jabar');
      const isAnyRegency = WEST_JAVA_REGENCIES.some(reg => matchIssueToRegency(i, reg));
      const isJabar = isJabarGeneric || isAnyRegency;

      if (!isJabar) return false;

      if (specificLocation && specificLocation !== 'Semua Kabupaten / Kota' && specificLocation !== 'all') {
        const targetReg = WEST_JAVA_REGENCIES.find(r => r.name.toLowerCase() === specificLocation.toLowerCase());
        if (targetReg) {
          return matchIssueToRegency(i, targetReg);
        }
        return loc.includes(specificLocation.toLowerCase());
      }
      return true;
    });
  }

  if (scope === 'nasional') {
    return issues.filter(i => {
      const loc = (i.location || '').toLowerCase();
      // True national issues or non-jabar provinces
      const isJabarLocal = WEST_JAVA_REGENCIES.some(reg => matchIssueToRegency(i, reg)) && !loc.includes('nasional');
      if (isJabarLocal && !loc.includes('nasional')) {
        return false;
      }
      return true;
    });
  }

  return issues;
}

/**
 * Calculates issue count for all 27 regencies in West Java
 */
export function computeWestJavaRegencyBreakdown(issues: Issue[]): { name: string; count: number; type: string }[] {
  return WEST_JAVA_REGENCIES.map(reg => {
    const matchingIssues = issues.filter(i => matchIssueToRegency(i, reg));
    return {
      name: reg.name,
      type: reg.type,
      count: matchingIssues.length
    };
  }).sort((a, b) => b.count - a.count);
}
