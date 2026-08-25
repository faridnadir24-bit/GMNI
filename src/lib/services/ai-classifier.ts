import OpenAI from 'openai';

export interface AIClassificationOutput {
  relevant: boolean;
  title: string;
  summary: string;
  category: string;
  location: string;
  sub_location: string | null;
  impact_score: number;
  evidence_score: number;
  momentum_score: number;
  verified_facts: string[];
  claims: string[];
  unverified: string[];
  research_questions: string[];
  status: 'emerging' | 'monitoring' | 'confirmed';
}

const SYSTEM_PROMPT = `Anda adalah analis isu untuk platform Ruang Isu GMNI. Analisis artikel berita dan berikan output JSON valid dengan struktur: { "relevant": boolean, "title": string, "summary": string, "category": "Sosial|Politik|Ekonomi|Hukum|Pendidikan|Kesehatan|Lingkungan|Ketenagakerjaan|Agraria|Keamanan|Pemerintahan", "location": "Purwakarta|Jawa Barat|Nasional|Lainnya", "sub_location": string atau null, "impact_score": number 0-100, "evidence_score": number 0-100, "momentum_score": number 0-100, "verified_facts": [string], "claims": [string], "unverified": [string], "research_questions": [string], "status": "emerging|monitoring|confirmed" } Jika tidak relevan dengan sosial-politik Indonesia, set "relevant": false.`;

export async function classifyArticleWithAI(
  title: string,
  content: string
): Promise<AIClassificationOutput | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('[AI Classifier] OPENAI_API_KEY belum dikonfigurasi.');
    return null;
  }

  const openai = new OpenAI({ apiKey });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Analisis artikel berita berikut:\n\nJudul: ${title}\nKonten: ${content}\n\nKembalikan HANYA JSON valid.`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const rawJson = response.choices[0]?.message?.content;
    if (!rawJson) return null;

    const parsed: AIClassificationOutput = JSON.parse(rawJson);
    return parsed;
  } catch (error) {
    console.error('[AI Classifier] Error saat memanggil OpenAI API:', error);
    return null;
  }
}
