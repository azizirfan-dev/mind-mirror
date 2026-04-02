import api from '@/shared/services/api.config';
import { type ApiEnvelope } from '@/features/auth/services/auth.service';

export type TimeWindow = '7d' | '30d' | '90d' | 'all';

export interface EmotionAverages {
  anxiety: number;
  stress: number;
  happiness: number;
  anger: number;
  sadness: number;
  depression: number;
}

export interface EntryRef {
  id: string;
  wordCount: number;
  date: string;
  title: string | null;
}

export interface JournalStats {
  totalEntriesInWindow: number;
  longestEntry: EntryRef | null;
  shortestEntry: EntryRef | null;
  mostActiveDayOfWeek: string;
  dominantEmotion: string;
}

export interface ActivityDay {
  date: string;
  count: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
}

export interface EmotionTrendPoint {
  date: string;
  anxietyScore: number;
  stressScore: number;
  happinessScore: number;
  angerScore: number;
  sadnessScore: number;
  depressionScore: number;
}

export interface InsightsData {
  user: {
    name: string | null;
    email: string;
    createdAt: string;
    allTimeEntryCount: number;
  };
  emotionAverages: EmotionAverages;
  journalStats: JournalStats;
  activity: ActivityDay[];
  streaks: StreakData;
  emotionTrend: EmotionTrendPoint[];
}

export interface SummaryData {
  summary: string;
  entryCount: number;
}

export const getInsights = async (window: TimeWindow): Promise<InsightsData> => {
  const res = await api.get<ApiEnvelope<InsightsData>>('/insights', { params: { window } });
  if (!res.data.success || !res.data.data) throw new Error(res.data.error || 'Failed to load insights');
  return res.data.data;
};

export const generateSummary = async (window: TimeWindow): Promise<SummaryData> => {
  const res = await api.post<ApiEnvelope<SummaryData>>('/insights/summary', { window }, { timeout: 60000 });
  if (!res.data.success || !res.data.data) throw new Error(res.data.error || 'Failed to generate summary');
  return res.data.data;
};

export const downloadPdf = async (window: TimeWindow): Promise<Blob> => {
  const res = await api.get('/insights/pdf', { params: { window }, responseType: 'blob', timeout: 90000 });
  return res.data as Blob;
};
