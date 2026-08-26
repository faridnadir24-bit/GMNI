import { Contradiction, ChangeSeverity } from '@/types';

export interface NumericFact {
  metric: 'korban' | 'anggaran' | 'luas' | 'tenaga_kerja' | 'produksi' | 'persentase' | 'tanggal' | 'nominal';
  value: string;
  normalizedValue?: number;
  rawText: string;
  sourceName: string;
  publishedAt: string;
}

export interface DetectedContradiction {
  topic: string;
  severity: ChangeSeverity;
  sourceA: {
    source_name: string;
    statement: string;
    published_at: string;
  };
  sourceB: {
    source_name: string;
    statement: string;
    published_at: string;
  };
  discrepancyExplanation: string;
}

/**
 * Extract numeric facts from Indonesian text
 */
export function extractNumericFacts(text: string, sourceName: string, publishedAt: string): NumericFact[] {
  const facts: NumericFact[] = [];
  
  // 1. Anggaran / Nilai Rupiah (RpX miliar, RpX triliun, RpX juta)
  const rupiahPattern = /(?:rp\.?\s*|\brp\s*)(\d+(?:[.,]\d+)?)\s*(triliun|miliar|juta|ribu)?/gi;
  let match;
  while ((match = rupiahPattern.exec(text)) !== null) {
    const rawVal = parseFloat(match[1].replace(',', '.'));
    const unit = (match[2] || '').toLowerCase();
    let multiplier = 1;
    if (unit === 'triliun') multiplier = 1_000_000_000_000;
    else if (unit === 'miliar') multiplier = 1_000_000_000;
    else if (unit === 'juta') multiplier = 1_000_000;
    else if (unit === 'ribu') multiplier = 1_000;

    facts.push({
      metric: 'anggaran',
      value: match[0].trim(),
      normalizedValue: rawVal * multiplier,
      rawText: text.slice(Math.max(0, match.index - 30), Math.min(text.length, match.index + 60)).trim(),
      sourceName,
      publishedAt,
    });
  }

  // 2. Korban / Orang (X orang meninggal / terluka / hilang / korban)
  const korbanPattern = /(\d+)\s*(?:orang|jiwa|warga)?\s*(?:korban|meninggal|hilang|tewas|luka-luka|terdampak|mengungsi)/gi;
  while ((match = korbanPattern.exec(text)) !== null) {
    facts.push({
      metric: 'korban',
      value: match[0].trim(),
      normalizedValue: parseInt(match[1], 10),
      rawText: text.slice(Math.max(0, match.index - 30), Math.min(text.length, match.index + 60)).trim(),
      sourceName,
      publishedAt,
    });
  }

  // 3. Persentase (% atau persen)
  const persenPattern = /(\d+(?:[.,]\d+)?)\s*(?:%|persen)/gi;
  while ((match = persenPattern.exec(text)) !== null) {
    facts.push({
      metric: 'persentase',
      value: match[0].trim(),
      normalizedValue: parseFloat(match[1].replace(',', '.')),
      rawText: text.slice(Math.max(0, match.index - 30), Math.min(text.length, match.index + 60)).trim(),
      sourceName,
      publishedAt,
    });
  }

  // 4. Luas / Unit (hektare, ton, unit, kja)
  const unitPattern = /(\d+(?:[.,]\d+)?)\s*(hektare|ha|ton|unit|petak|kja)/gi;
  while ((match = unitPattern.exec(text)) !== null) {
    facts.push({
      metric: 'luas',
      value: match[0].trim(),
      normalizedValue: parseFloat(match[1].replace(',', '.')),
      rawText: text.slice(Math.max(0, match.index - 30), Math.min(text.length, match.index + 60)).trim(),
      sourceName,
      publishedAt,
    });
  }

  return facts;
}

/**
 * Compare facts from multiple sources to detect numeric and statement contradictions.
 * Does NOT declare a winner; flags discrepancies neutrally.
 */
export function detectContradictions(
  newContent: string,
  newSourceName: string,
  newPublishedAt: string,
  existingSourcesContent: { sourceName: string; content: string; publishedAt: string }[]
): DetectedContradiction[] {
  const contradictions: DetectedContradiction[] = [];
  const newFacts = extractNumericFacts(newContent, newSourceName, newPublishedAt);

  for (const existing of existingSourcesContent) {
    if (existing.sourceName.toLowerCase() === newSourceName.toLowerCase()) continue;
    const existingFacts = extractNumericFacts(existing.content, existing.sourceName, existing.publishedAt);

    // Cross compare same metrics
    for (const nf of newFacts) {
      for (const ef of existingFacts) {
        if (nf.metric === ef.metric && nf.normalizedValue !== undefined && ef.normalizedValue !== undefined) {
          // If values differ by more than 5%
          const diff = Math.abs(nf.normalizedValue - ef.normalizedValue);
          const maxVal = Math.max(nf.normalizedValue, ef.normalizedValue);

          if (diff > 0 && (diff / maxVal) > 0.05) {
            let topic = `Perbedaan Data ${nf.metric.toUpperCase()}`;
            let severity: ChangeSeverity = 'MEDIUM';

            if (nf.metric === 'korban') {
              topic = 'Perbedaan Jumlah Korban / Dampak Manusia';
              severity = 'HIGH';
            } else if (nf.metric === 'anggaran') {
              topic = 'Perbedaan Nilai Nominal / Alokasi Anggaran';
              severity = 'HIGH';
            }

            contradictions.push({
              topic,
              severity,
              sourceA: {
                source_name: ef.sourceName,
                statement: ef.rawText,
                published_at: ef.publishedAt,
              },
              sourceB: {
                source_name: nf.sourceName,
                statement: nf.rawText,
                published_at: nf.publishedAt,
              },
              discrepancyExplanation: `Terdapat perbedaan data ${nf.metric}: "${ef.sourceName}" menyebut ${ef.value}, sedangkan "${nf.sourceName}" menyebut ${nf.value}. Sistem mencatat perbedaan ini secara netral tanpa menentukan kebenaran sepihak.`,
            });
          }
        }
      }
    }
  }

  return contradictions;
}
