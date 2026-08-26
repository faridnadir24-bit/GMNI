import slugify from 'slugify';

export interface ExtractedEntities {
  persons: string[];
  organizations: string[];
  government_bodies: string[];
  locations: string[];
  policies_programs: string[];
  key_terms: string[];
}

export interface ClusterMatchResult {
  isMatch: boolean;
  matchScore: number; // 0 - 100
  matchedIssueId?: string;
  matchedIssueTitle?: string;
  matchType: 'auto_match' | 'candidate_match' | 'new_issue';
  breakdown: {
    titleSimilarity: number;
    contentSimilarity: number;
    entitySimilarity: number;
    locationSimilarity: number;
    categorySimilarity: number;
    temporalProximity: number;
  };
  reason: string;
}

export interface CandidateIssue {
  id: string;
  title: string;
  category?: string | null;
  location?: string | null;
  sub_location?: string | null;
  summary?: string | null;
  last_activity_at?: string | null;
  detected_at?: string | null;
  entities?: ExtractedEntities;
}

export interface ArticleForClustering {
  title: string;
  summary: string;
  content?: string;
  category: string;
  location: string;
  sub_location?: string | null;
  published_at?: string;
}

// Common Indonesian news stop words
const ID_STOPWORDS = new Set([
  'yang', 'untuk', 'pada', 'ke', 'para', 'namun', 'menurut', 'antara', 'dia', 'mereka',
  'anda', 'kita', 'aku', 'kami', 'dan', 'di', 'dari', 'ini', 'itu', 'dengan', 'ada',
  'adalah', 'akan', 'atau', 'bisa', 'oleh', 'saat', 'sudah', 'tersebut', 'dalam',
  'bukan', 'karena', 'juga', 'secara', 'setelah', 'terhadap', 'tentang', 'masih',
  'seperti', 'hanya', 'serta', 'dapat', 'lagi', 'baru', 'saja', 'harus', 'belum',
  'banyak', 'beberapa', 'sebagai', 'bagi', 'sampai', 'hingga', 'terus', 'terus-menerus',
  'kembali', 'kemarin', 'hari', 'pihak', 'kata', 'ujar', 'sebut', 'terkait', 'usai'
]);

// Semantic Synonym & Acronym mapping for socio-political issues
const SYNONYM_MAP: Record<string, string[]> = {
  kja: ['keramba', 'jaring', 'apung', 'kja', 'waduk', 'jatiluhur'],
  keramba: ['kja', 'keramba', 'apung', 'pembudidaya', 'ikan'],
  penataan: ['penertiban', 'penataan', 'pembongkaran', 'penggusuran', 'relokasi', 'zonasi'],
  penertiban: ['penataan', 'penertiban', 'pembongkaran', 'penertiban_kja'],
  pembudidaya: ['petani', 'nelayan', 'pembudidaya', 'peternak', 'warga_lokal'],
  buruh: ['pekerja', 'karyawan', 'buruh', 'tenaga_kerja', 'serikat_buruh'],
  umk: ['upah', 'gaji', 'umk', 'ump', 'upah_minimum'],
  upah: ['umk', 'ump', 'upah', 'gaji', 'standar_upah'],
  petani: ['penggarap', 'petani', 'agraria', 'lahan', 'poktan'],
  korupsi: ['kpk', 'suap', 'gratifikasi', 'penahanan', 'tindak_pidana_korupsi'],
  bencana: ['banjir', 'longsor', 'erupsi', 'evakuasi', 'bnpb', 'bpbd']
};

export function tokenizeAndClean(text: string): string[] {
  if (!text) return [];
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/gi, ' ')
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length > 1 && !ID_STOPWORDS.has(w));

  const expanded: string[] = [];
  for (const word of words) {
    expanded.push(word);
    if (SYNONYM_MAP[word]) {
      expanded.push(...SYNONYM_MAP[word]);
    }
  }

  return expanded;
}

/**
 * Jaccard & N-gram Token Overlap Similarity (0.0 to 1.0)
 */
export function calculateTokenSimilarity(textA: string, textB: string): number {
  const tokensA = new Set(tokenizeAndClean(textA));
  const tokensB = new Set(tokenizeAndClean(textB));

  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  const intersection = new Set([...tokensA].filter(x => tokensB.has(x)));
  const union = new Set([...tokensA, ...tokensB]);

  const jaccard = intersection.size / union.size;

  // Bigram overlap
  const wordsA = tokenizeAndClean(textA);
  const wordsB = tokenizeAndClean(textB);
  
  const bigramsA = new Set<string>();
  for (let i = 0; i < wordsA.length - 1; i++) {
    bigramsA.add(`${wordsA[i]}_${wordsA[i + 1]}`);
  }
  const bigramsB = new Set<string>();
  for (let i = 0; i < wordsB.length - 1; i++) {
    bigramsB.add(`${wordsB[i]}_${wordsB[i + 1]}`);
  }

  let bigramScore = 0;
  if (bigramsA.size > 0 && bigramsB.size > 0) {
    const bigramIntersect = new Set([...bigramsA].filter(x => bigramsB.has(x)));
    bigramScore = bigramIntersect.size / Math.min(bigramsA.size, bigramsB.size);
  }

  return (jaccard * 0.55) + (bigramScore * 0.45);
}

/**
 * Extract socio-political entities from article text (Heuristic / Regex NLP)
 */
export function extractEntities(text: string): ExtractedEntities {
  const persons: string[] = [];
  const organizations: string[] = [];
  const government_bodies: string[] = [];
  const locations: string[] = [];
  const policies_programs: string[] = [];
  const key_terms: string[] = [];

  const lower = text.toLowerCase();

  // Government & Regulatory entities
  const govPatterns = [
    /pemkab\s+[a-z\s]+/i,
    /pemprov\s+[a-z\s]+/i,
    /kementerian\s+[a-z\s]+/i,
    /kemnaker|kemensos|kemenkeu|kemendikbud|kemenkes|kpk|polri|tni|dprd|dpr\s+ri|kejaksaan\s+negeri|bnpb|bpbd|dishub|satpol\s+pp/gi
  ];
  for (const pat of govPatterns) {
    const matches = text.match(pat);
    if (matches) {
      matches.forEach(m => government_bodies.push(m.trim()));
    }
  }

  // Known Organizations / Unions
  const orgPatterns = [
    /gmni|fspmi|spsi|kasbi|kadin|apindo|walhi|lbh|pbhi|pgri|idi|hmi|pmii/gi,
    /pt\s+[a-z\s0-9]+/i,
    /pdam|pln|jasamarga|jasatirta/gi
  ];
  for (const pat of orgPatterns) {
    const matches = text.match(pat);
    if (matches) {
      matches.forEach(m => organizations.push(m.trim()));
    }
  }

  // Locations (Purwakarta kecamatan & general)
  const locKeywords = [
    'jatiluhur', 'bungursari', 'wanayasa', 'purwakarta', 'babakancikao', 'maniis',
    'campaka', 'plered', 'sukatani', 'sukasari', 'darangdan', 'bojong', 'pasawahan',
    'tegalwaru', 'cibatu', 'kiarapedes', 'pondoksalam', 'jawa barat', 'bandung', 'jakarta'
  ];
  for (const loc of locKeywords) {
    if (lower.includes(loc)) {
      locations.push(loc.charAt(0).toUpperCase() + loc.slice(1));
    }
  }

  // Key Policy / Socio-political terms
  const terms = ['kja', 'upah', 'umk', 'phk', 'relokasi', 'penertiban', 'zonasi', 'amdal', 'lahan', 'subsidi', 'bansos', 'korupsi', 'retribusi'];
  for (const term of terms) {
    if (lower.includes(term)) {
      key_terms.push(term.toUpperCase());
    }
  }

  return {
    persons: Array.from(new Set(persons)),
    organizations: Array.from(new Set(organizations)),
    government_bodies: Array.from(new Set(government_bodies)),
    locations: Array.from(new Set(locations)),
    policies_programs: Array.from(new Set(policies_programs)),
    key_terms: Array.from(new Set(key_terms)),
  };
}

/**
 * Calculate entity overlap similarity (0 - 100)
 */
export function calculateEntitySimilarity(entitiesA: ExtractedEntities, entitiesB: ExtractedEntities): number {
  const setA = new Set([
    ...entitiesA.government_bodies.map(e => e.toLowerCase()),
    ...entitiesA.organizations.map(e => e.toLowerCase()),
    ...entitiesA.locations.map(e => e.toLowerCase()),
    ...entitiesA.key_terms.map(e => e.toLowerCase()),
  ]);

  const setB = new Set([
    ...entitiesB.government_bodies.map(e => e.toLowerCase()),
    ...entitiesB.organizations.map(e => e.toLowerCase()),
    ...entitiesB.locations.map(e => e.toLowerCase()),
    ...entitiesB.key_terms.map(e => e.toLowerCase()),
  ]);

  if (setA.size === 0 || setB.size === 0) return 40; // Neutral baseline when sparse

  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);

  return Math.round((intersection.size / union.size) * 100);
}

/**
 * SEMANTIC ISSUE MATCHER (ARTIKEL BARU ≠ ISU BARU)
 * Evaluates an incoming article against existing candidate issues with a unified 0-100 score.
 */
export function matchArticleToIssue(
  article: ArticleForClustering,
  existingIssues: CandidateIssue[]
): ClusterMatchResult {
  if (!existingIssues || existingIssues.length === 0) {
    return {
      isMatch: false,
      matchScore: 0,
      matchType: 'new_issue',
      breakdown: {
        titleSimilarity: 0,
        contentSimilarity: 0,
        entitySimilarity: 0,
        locationSimilarity: 0,
        categorySimilarity: 0,
        temporalProximity: 0,
      },
      reason: 'Basis data isu belum memiliki isu pembanding. Ditetapkan sebagai isu baru.',
    };
  }

  const articleEntities = extractEntities(`${article.title} ${article.summary} ${article.content || ''}`);
  const articleLocation = (article.location || 'Nasional').toLowerCase();
  const articleSubLocation = (article.sub_location || '').toLowerCase();
  const articleCategory = (article.category || 'Sosial').toLowerCase();

  let bestMatch: CandidateIssue | null = null;
  let highestCompositeScore = 0;
  let bestBreakdown = {
    titleSimilarity: 0,
    contentSimilarity: 0,
    entitySimilarity: 0,
    locationSimilarity: 0,
    categorySimilarity: 0,
    temporalProximity: 0,
  };

  for (const issue of existingIssues) {
    const issueLocation = (issue.location || 'Nasional').toLowerCase();
    const issueSubLocation = (issue.sub_location || '').toLowerCase();
    const issueCategory = (issue.category || 'Sosial').toLowerCase();
    const issueEntities = issue.entities || extractEntities(`${issue.title} ${issue.summary || ''}`);

    // A. Title Similarity (0 - 100)
    const titleSim = Math.round(calculateTokenSimilarity(article.title, issue.title) * 100);

    // B. Content / Summary Similarity (0 - 100)
    const contentSim = Math.round(calculateTokenSimilarity(
      `${article.title} ${article.summary}`,
      `${issue.title} ${issue.summary || ''}`
    ) * 100);

    // C. Entity Similarity (0 - 100)
    const entitySim = calculateEntitySimilarity(articleEntities, issueEntities);

    // D. Location Similarity (0 - 100)
    let locationSim = 40;
    if (articleLocation === issueLocation && articleLocation !== 'nasional') {
      locationSim = 85;
      if (articleSubLocation && issueSubLocation && articleSubLocation === issueSubLocation) {
        locationSim = 100;
      }
    } else if (articleLocation === issueLocation) {
      locationSim = 70;
    } else {
      locationSim = 20;
    }

    // E. Category Similarity (0 - 100)
    const categorySim = articleCategory === issueCategory ? 100 : 30;

    // F. Temporal Proximity (0 - 100)
    let temporalSim = 50;
    const issueTime = new Date(issue.last_activity_at || issue.detected_at || 0).getTime();
    if (issueTime > 0) {
      const diffHours = (Date.now() - issueTime) / (1000 * 60 * 60);
      if (diffHours <= 24) temporalSim = 100;
      else if (diffHours <= 72) temporalSim = 85;
      else if (diffHours <= 168) temporalSim = 65;
      else temporalSim = 35;
    }

    // Composite Weighted Score:
    // Title (30%) + Content (20%) + Entity (20%) + Location (15%) + Category (10%) + Temporal (5%)
    const compositeScore = Math.round(
      (titleSim * 0.30) +
      (contentSim * 0.20) +
      (entitySim * 0.20) +
      (locationSim * 0.15) +
      (categorySim * 0.10) +
      (temporalSim * 0.05)
    );

    if (compositeScore > highestCompositeScore) {
      highestCompositeScore = compositeScore;
      bestMatch = issue;
      bestBreakdown = {
        titleSimilarity: titleSim,
        contentSimilarity: contentSim,
        entitySimilarity: entitySim,
        locationSimilarity: locationSim,
        categorySimilarity: categorySim,
        temporalProximity: temporalSim,
      };
    }
  }

  // Section 4 Decision Matrix:
  // >= 85: Auto match (pasti isu yang sama)
  // 70 - 84: Candidate match (validasi entity & lokasi)
  // < 70: Likely new issue
  let isMatch = false;
  let matchType: ClusterMatchResult['matchType'] = 'new_issue';
  let reason = '';

  if (highestCompositeScore >= 85) {
    isMatch = true;
    matchType = 'auto_match';
    reason = `Kesesuaian semantik sangat tinggi (${highestCompositeScore}/100) terhadap isu "${bestMatch?.title}". Otomatis digabungkan.`;
  } else if (highestCompositeScore >= 70 && bestMatch) {
    // Second-level verification: Must have shared entity OR same exact district
    const hasEntityMatch = bestBreakdown.entitySimilarity >= 50;
    const hasLocationMatch = bestBreakdown.locationSimilarity >= 70;

    if (hasEntityMatch || hasLocationMatch) {
      isMatch = true;
      matchType = 'candidate_match';
      reason = `Kesesuaian kandidat kuat (${highestCompositeScore}/100) dengan kesamaan entitas/lokasi terverifikasi. Digabungkan ke "${bestMatch.title}".`;
    } else {
      isMatch = false;
      matchType = 'new_issue';
      reason = `Skor kemiripan (${highestCompositeScore}/100) tidak memenuhi ambang verifikasi entitas sekunder. Ditetapkan sebagai isu terpisah.`;
    }
  } else {
    isMatch = false;
    matchType = 'new_issue';
    reason = `Skor kemiripan tertinggi (${highestCompositeScore}/100) di bawah ambang batas (70). Ditetapkan sebagai isu baru.`;
  }

  return {
    isMatch,
    matchScore: highestCompositeScore,
    matchedIssueId: isMatch ? bestMatch?.id : undefined,
    matchedIssueTitle: isMatch ? bestMatch?.title : undefined,
    matchType,
    breakdown: bestBreakdown,
    reason,
  };
}

/**
 * Generate a neutral, durable, non-clickbait, policy-oriented canonical issue title.
 */
export function generateNeutralIssueTitle(
  articleTitle: string,
  category: string,
  location: string,
  subLocation?: string | null
): string {
  let cleaned = articleTitle
    .replace(/^BREAKING NEWS:?\s*/i, '')
    .replace(/^HEBOH:?\s*/i, '')
    .replace(/^VIRAL:?\s*/i, '')
    .replace(/^UPDATE:?\s*/i, '')
    .replace(/^TERKUAK:?\s*/i, '')
    .replace(/^BONGKAR:?\s*/i, '')
    .replace(/\s*-\s*(detikNews|Kompas\.com|Antara News|CNN Indonesia|Tempo\.co|Republika|Radar Purwakarta|Suara Purwakarta)$/i, '')
    .trim();

  // Strip sensational punctuation
  cleaned = cleaned.replace(/[!?]+$/, '').trim();

  const locContext = subLocation || (location !== 'Nasional' ? location : '');
  
  if (locContext && !cleaned.toLowerCase().includes(locContext.toLowerCase())) {
    return `${cleaned} di ${locContext}`;
  }

  return cleaned;
}

export function generateIssueSlug(title: string): string {
  const base = slugify(title, { lower: true, strict: true, trim: true });
  return `${base.slice(0, 75)}-${Date.now().toString().slice(-4)}`;
}
