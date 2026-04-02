// ── API Envelope ──────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Emotion ───────────────────────────────────────────────────────────────────
export type EmotionKey = 'anxiety' | 'stress' | 'happiness' | 'anger' | 'sadness' | 'depression';

// API response shape — nullable because scoring runs async after entry creation
export type EmotionScores = Record<EmotionKey, number | null>;

// ── Journal ───────────────────────────────────────────────────────────────────
export interface JournalListItem {
  id: string;
  title: string | null;
  preview: string;
  createdAt: string;
  emotionScores: EmotionScores | null;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  emotionScores: EmotionScores | null;
}

export interface PaginatedEntries {
  data: JournalListItem[];
  total: number;
  page: number;
}

// ── Chat ──────────────────────────────────────────────────────────────────────
export interface ChatInitResponse {
  sessionId: string;
  journalPreview: string;
}

// ── Agent ─────────────────────────────────────────────────────────────────────
export interface PromptArchitectResponse {
  prompt: string;
}

// ── Insights ──────────────────────────────────────────────────────────────────
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
