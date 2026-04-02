import { ActivityDay, StreakData } from './insights.types';

const DAY_MS = 24 * 60 * 60 * 1000;

const toUtcDateStr = (date: Date): string =>
  date.toISOString().slice(0, 10);

export const buildActivityData = (entries: { createdAt: Date }[]): ActivityDay[] => {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const key = toUtcDateStr(entry.createdAt);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

const buildDateSet = (activity: ActivityDay[]): Set<string> =>
  new Set(activity.map((d) => d.date));

const computeCurrentStreak = (dateSet: Set<string>, today: string): number => {
  let streak = 0;
  let cursor = new Date(today);
  while (dateSet.has(toUtcDateStr(cursor))) {
    streak++;
    cursor = new Date(cursor.getTime() - DAY_MS);
  }
  return streak;
};

const computeLongestStreak = (sortedDates: string[]): number => {
  if (sortedDates.length === 0) return 0;
  let longest = 1;
  let current = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]).getTime();
    const curr = new Date(sortedDates[i]).getTime();
    if (curr - prev === DAY_MS) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }
  return longest;
};

export const computeStreaks = (activity: ActivityDay[]): StreakData => {
  const dateSet = buildDateSet(activity);
  const sortedDates = activity.map((d) => d.date).sort();
  const today = toUtcDateStr(new Date());
  return {
    currentStreak: computeCurrentStreak(dateSet, today),
    longestStreak: computeLongestStreak(sortedDates),
    totalActiveDays: activity.length,
  };
};
