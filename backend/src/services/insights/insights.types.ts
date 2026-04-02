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
