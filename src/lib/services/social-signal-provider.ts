export type SocialPlatform = 'X' | 'Instagram' | 'TikTok' | 'YouTube' | 'Facebook' | 'Forums';

export interface SocialSignal {
  id: string;
  issue_id?: string;
  platform: SocialPlatform;
  url: string;
  author_handle: string;
  content: string;
  published_at: string;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  sentiment: 'positive' | 'neutral' | 'negative' | 'critical';
  keywords: string[];
  source_type: 'social_signal';
  verification_status: 'UNVERIFIED';
  disclaimer: string;
}

export class SocialSignalProvider {
  /**
   * Evaluates if an evidence piece is purely a social media signal
   */
  static isSocialSignal(sourceType: string, url: string): boolean {
    const sType = (sourceType || '').toLowerCase();
    const sUrl = (url || '').toLowerCase();
    return sType.includes('social') || 
           sUrl.includes('twitter.com') || 
           sUrl.includes('x.com') || 
           sUrl.includes('instagram.com') || 
           sUrl.includes('tiktok.com') || 
           sUrl.includes('youtube.com');
  }

  /**
   * Normalizes a social post into a structured unverified public signal
   */
  static createSignal(data: Partial<SocialSignal>): SocialSignal {
    return {
      id: data.id || `sig-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      issue_id: data.issue_id,
      platform: data.platform || 'X',
      url: data.url || '#',
      author_handle: data.author_handle || '@warganet_jabar',
      content: data.content || '',
      published_at: data.published_at || new Date().toISOString(),
      engagement: data.engagement || { likes: 0, shares: 0, comments: 0 },
      sentiment: data.sentiment || 'neutral',
      keywords: data.keywords || [],
      source_type: 'social_signal',
      verification_status: 'UNVERIFIED',
      disclaimer: 'Sinyal persepsi publik warganet digunakan untuk deteksi momentum dan sentimen awal, bukan sebagai fakta empiris terkonfirmasi.'
    };
  }

  /**
   * Calculates a public attention & momentum score from signals
   */
  static calculatePublicAttentionIndex(signals: SocialSignal[]): {
    score: number;
    level: 'TENANG' | 'MODERAT' | 'TINGGI' | 'VIRAL';
    totalEngagement: number;
    criticalSentimentRatio: number;
  } {
    if (!signals || signals.length === 0) {
      return { score: 10, level: 'TENANG', totalEngagement: 0, criticalSentimentRatio: 0 };
    }

    const totalEngagement = signals.reduce(
      (acc, s) => acc + (s.engagement.likes + s.engagement.shares * 2 + s.engagement.comments * 3), 
      0
    );

    const criticalCount = signals.filter(s => s.sentiment === 'negative' || s.sentiment === 'critical').length;
    const criticalSentimentRatio = Math.round((criticalCount / signals.length) * 100);

    let score = Math.min(100, Math.round(signals.length * 15 + Math.log10(totalEngagement + 1) * 10));
    let level: 'TENANG' | 'MODERAT' | 'TINGGI' | 'VIRAL' = 'MODERAT';

    if (score >= 80) level = 'VIRAL';
    else if (score >= 60) level = 'TINGGI';
    else if (score >= 35) level = 'MODERAT';
    else level = 'TENANG';

    return {
      score,
      level,
      totalEngagement,
      criticalSentimentRatio
    };
  }
}
