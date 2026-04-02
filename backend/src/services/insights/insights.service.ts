import { prisma } from '../../lib/prisma';
import { JournalEntry } from '@prisma/client';
import {
  TimeWindow, EmotionAverages, EntryRef, JournalStats,
  EmotionTrendPoint, InsightsData,
} from './insights.types';
import { buildActivityData, computeStreaks } from './insights.activity.service';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const EMOTION_KEYS = ['anxietyScore', 'stressScore', 'happinessScore', 'angerScore', 'sadnessScore', 'depressionScore'] as const;

export const getWindowStart = (window: TimeWindow): Date | null => {
  if (window === 'all') return null;
  const days = window === '7d' ? 7 : window === '30d' ? 30 : 90;
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - days);
  return since;
};

const fetchWindowEntries = async (userId: string, since: Date | null): Promise<JournalEntry[]> =>
  prisma.journalEntry.findMany({
    where: { userId, ...(since ? { createdAt: { gte: since } } : {}) },
    orderBy: { createdAt: 'asc' },
  });

const fetchAllTimeCount = async (userId: string): Promise<number> =>
  prisma.journalEntry.count({ where: { userId } });

const countWords = (content: string): number =>
  content.trim().split(/\s+/).filter(Boolean).length;

const buildEntryRef = (entry: JournalEntry): EntryRef => ({
  id: entry.id,
  wordCount: countWords(entry.content),
  date: entry.createdAt.toISOString(),
  title: entry.title,
});

const computeEmotionAverages = (entries: JournalEntry[]): EmotionAverages => {
  const scored = entries.filter((e) => e.anxietyScore !== null);
  if (scored.length === 0) return { anxiety: 0, stress: 0, happiness: 0, anger: 0, sadness: 0, depression: 0 };
  const sum = scored.reduce((acc, e) => ({
    anxiety: acc.anxiety + (e.anxietyScore ?? 0),
    stress: acc.stress + (e.stressScore ?? 0),
    happiness: acc.happiness + (e.happinessScore ?? 0),
    anger: acc.anger + (e.angerScore ?? 0),
    sadness: acc.sadness + (e.sadnessScore ?? 0),
    depression: acc.depression + (e.depressionScore ?? 0),
  }), { anxiety: 0, stress: 0, happiness: 0, anger: 0, sadness: 0, depression: 0 });
  const n = scored.length;
  return { anxiety: sum.anxiety / n, stress: sum.stress / n, happiness: sum.happiness / n, anger: sum.anger / n, sadness: sum.sadness / n, depression: sum.depression / n };
};

const computeJournalStats = (entries: JournalEntry[]): Omit<JournalStats, 'totalEntriesInWindow'> => {
  if (entries.length === 0) return { longestEntry: null, shortestEntry: null, mostActiveDayOfWeek: 'N/A', dominantEmotion: 'N/A' };
  const refs = entries.map(buildEntryRef);
  const longest = refs.reduce((a, b) => (a.wordCount >= b.wordCount ? a : b));
  const shortest = refs.reduce((a, b) => (a.wordCount <= b.wordCount ? a : b));
  const dayCounts = new Array<number>(7).fill(0);
  entries.forEach((e) => dayCounts[e.createdAt.getUTCDay()]++);
  const mostActiveDayOfWeek = DAY_NAMES[dayCounts.indexOf(Math.max(...dayCounts))];
  const avgs = computeEmotionAverages(entries);
  const emotionMap: Record<string, number> = { anxiety: avgs.anxiety, stress: avgs.stress, happiness: avgs.happiness, anger: avgs.anger, sadness: avgs.sadness, depression: avgs.depression };
  const dominantEmotion = Object.entries(emotionMap).reduce((a, b) => (a[1] >= b[1] ? a : b))[0];
  return { longestEntry: longest, shortestEntry: shortest, mostActiveDayOfWeek, dominantEmotion };
};

const buildTrendPoints = (entries: JournalEntry[]): EmotionTrendPoint[] => {
  const scored = entries.filter((e) => e.anxietyScore !== null);
  const byDate = new Map<string, JournalEntry[]>();
  for (const e of scored) {
    const key = e.createdAt.toISOString().slice(0, 10);
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key)!.push(e);
  }
  return Array.from(byDate.entries()).map(([date, group]) => {
    const avgs = computeEmotionAverages(group);
    return { date, anxietyScore: avgs.anxiety, stressScore: avgs.stress, happinessScore: avgs.happiness, angerScore: avgs.anger, sadnessScore: avgs.sadness, depressionScore: avgs.depression };
  });
};

export const getInsightsData = async (userId: string, window: TimeWindow): Promise<InsightsData> => {
  const since = getWindowStart(window);
  const [entries, allTimeCount, user] = await Promise.all([
    fetchWindowEntries(userId, since),
    fetchAllTimeCount(userId),
    prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { name: true, email: true, createdAt: true } }),
  ]);
  const activity = buildActivityData(entries);
  const stats = computeJournalStats(entries);
  return {
    user: { name: user.name, email: user.email, createdAt: user.createdAt.toISOString(), allTimeEntryCount: allTimeCount },
    emotionAverages: computeEmotionAverages(entries),
    journalStats: { totalEntriesInWindow: entries.length, ...stats },
    activity,
    streaks: computeStreaks(activity),
    emotionTrend: buildTrendPoints(entries),
  };
};
