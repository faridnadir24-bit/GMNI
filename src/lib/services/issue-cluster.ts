import slugify from 'slugify';

export interface ClusterMatchResult {
  isMatch: boolean;
  similarityScore: number;
  matchedIssueId?: string;
  matchedIssueTitle?: string;
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
}

export interface ArticleForClustering {
  title: string;
  summary: string;
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
  'banyak', 'beberapa', 'sebagai', 'bagi', 'sampai', 'hingga', 'terus', 'terus-menerus'
]);

// Semantic Synonym & Acronym mapping for socio-political issues
const SYNONYM_MAP: Record<string, string[]> = {
  kja: ['keramba', 'jaring', 'apung', 'kja'],
  keramba: ['kja', 'keramba', 'apung'],
  penataan: ['penertiban', 'penataan', 'pembongkaran', 'penggusuran'],
  penertiban: ['penataan', 'penertiban', 'pembongkaran'],
  pembudidaya: ['petani', 'nelayan', 'pembudidaya', 'peternak'],
  buruh: ['pekerja', 'karyawan', 'buruh', 'tenaga_kerja'],
  umk: ['upah', 'gaji', 'umk', 'ump'],
  upah: ['umk', 'ump', 'upah', 'gaji']
};

export function tokenizeAndClean(text: string): string[] {
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

// Jaccard & N-gram Token Overlap Similarity (0.0 to 1.0)
export function calculateTokenSimilarity(textA: string, textB: string): number {
  const tokensA = new Set(tokenizeAndClean(textA));
  const tokensB = new Set(tokenizeAndClean(textB));

  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  const intersection = new Set([...tokensA].filter(x => tokensB.has(x)));
  const union = new Set([...tokensA, ...tokensB]);

  const jaccard = intersection.size / union.size;

  // Additional bigram overlap check
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

  return (jaccard * 0.60) + (bigramScore * 0.40);
}

/**
 * Match a newly fetched article against existing issues in the database.
 * BERITA ≠ ISU: Clustered conservatively so multiple reports on the same
 * topic group into a single structured issue.
 */
export function matchArticleToIssue(
  article: ArticleForClustering,
  existingIssues: CandidateIssue[]
): ClusterMatchResult {
  if (!existingIssues || existingIssues.length === 0) {
    return {
      isMatch: false,
      similarityScore: 0,
      reason: 'Belum ada isu pembanding dalam basis data.',
    };
  }

  let bestMatch: CandidateIssue | null = null;
  let highestScore = 0;
  let matchReason = '';

  const articleLocation = (article.location || 'Nasional').toLowerCase();
  const articleSubLocation = (article.sub_location || '').toLowerCase();
  const articleCategory = (article.category || 'Sosial').toLowerCase();

  for (const issue of existingIssues) {
    const issueLocation = (issue.location || 'Nasional').toLowerCase();
    const issueSubLocation = (issue.sub_location || '').toLowerCase();
    const issueCategory = (issue.category || 'Sosial').toLowerCase();

    // 1. Title Similarity
    const titleSim = calculateTokenSimilarity(article.title, issue.title);

    // 2. Summary/Keyword Similarity
    const contentSim = calculateTokenSimilarity(
      `${article.title} ${article.summary}`,
      `${issue.title} ${issue.summary || ''}`
    );

    // 3. Location Match Boost
    let locationWeight = 0;
    const isExactSubLocation = articleSubLocation && issueSubLocation && articleSubLocation === issueSubLocation;
    if (articleLocation === issueLocation && articleLocation !== 'nasional') {
      locationWeight = 0.25;
      if (isExactSubLocation) {
        locationWeight = 0.38; // Exact kecamatan match
      }
    } else if (articleLocation === issueLocation) {
      locationWeight = 0.10;
    }

    // 4. Category Match Boost
    const isCategoryMatch = articleCategory === issueCategory;
    const categoryWeight = isCategoryMatch ? 0.15 : 0;

    // 5. Temporal Proximity
    let temporalWeight = 0;
    const issueTime = new Date(issue.last_activity_at || issue.detected_at || 0).getTime();
    if (issueTime > 0) {
      const diffHours = (Date.now() - issueTime) / (1000 * 60 * 60);
      if (diffHours <= 72) temporalWeight = 0.10;
      else if (diffHours <= 168) temporalWeight = 0.05;
    }

    // Composite Weighted Score
    const compositeScore = Math.min(
      1.0,
      (titleSim * 0.45) + (contentSim * 0.25) + locationWeight + categoryWeight + temporalWeight
    );

    if (compositeScore > highestScore) {
      highestScore = compositeScore;
      bestMatch = issue;
      matchReason = `Kesesuaian token judul (${(titleSim * 100).toFixed(0)}%), lokasi (${issue.location}), dan bidang (${issue.category}).`;
    }
  }

  // Conservative Threshold Rule:
  // >= 0.80: Sangat yakin isu yang sama
  // 0.68 - 0.79: Cocok jika lokasi & bidang sama persis
  // < 0.68: Ditetapkan sebagai isu baru
  const isMatch = highestScore >= 0.80 || (highestScore >= 0.68 && bestMatch !== null);

  if (isMatch && bestMatch) {
    return {
      isMatch: true,
      similarityScore: parseFloat(highestScore.toFixed(3)),
      matchedIssueId: bestMatch.id,
      matchedIssueTitle: bestMatch.title,
      reason: matchReason,
    };
  }

  return {
    isMatch: false,
    similarityScore: parseFloat(highestScore.toFixed(3)),
    matchedIssueId: bestMatch?.id,
    matchedIssueTitle: bestMatch?.title,
    reason: `Skor kemiripan tertinggi (${(highestScore * 100).toFixed(0)}%) di bawah ambang batas konservatif. Ditetapkan sebagai isu baru.`,
  };
}

/**
 * Generate a neutral, descriptive, policy-oriented issue title.
 * Converts sensational media headlines into durable research topics.
 * E.g., "Puluhan KJA Dibongkar di Jatiluhur" -> "Penataan KJA Waduk Jatiluhur dan Dampaknya terhadap Pembudidaya Lokal"
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
    .replace(/\s*-\s*(detikNews|Kompas\.com|Antara News|CNN Indonesia|Tempo\.co|Republika)$/i, '')
    .trim();

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
