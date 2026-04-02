import { prisma } from '../../lib/prisma';
import { collectHfResponse } from '../ai/hf.service';
import { TimeWindow, SummaryData } from './insights.types';
import { getWindowStart } from './insights.service';

const SUMMARY_ENTRY_LIMIT = 30;

const buildEntrySnippet = (entry: {
  createdAt: Date;
  title: string | null;
  content: string;
  anxietyScore: number | null;
  happinessScore: number | null;
  sadnessScore: number | null;
}): string => {
  const date = entry.createdAt.toISOString().slice(0, 10);
  const title = entry.title ?? 'Untitled';
  const snippet = entry.content.slice(0, 100);
  const scores = entry.anxietyScore !== null
    ? `(Anxiety:${entry.anxietyScore} Happiness:${entry.happinessScore} Sadness:${entry.sadnessScore})`
    : '(scores pending)';
  return `[${date}] "${title}" ${scores} — ${snippet}...`;
};

const buildSummaryPrompt = (snippets: string[], windowLabel: string): string =>
  `You are a compassionate mental wellness guide. Based on the user's journal entries from ${windowLabel}, write a warm, insightful 2-3 paragraph summary of their emotional journey. Focus on patterns, progress, and gentle observations. Do not give clinical advice.

Entries:
${snippets.join('\n')}`;

const getWindowLabel = (window: TimeWindow): string => {
  const labels: Record<TimeWindow, string> = { '7d': 'the last 7 days', '30d': 'the last 30 days', '90d': 'the last 90 days', all: 'all time' };
  return labels[window];
};

export const generateSummary = async (userId: string, window: TimeWindow): Promise<SummaryData> => {
  const since = getWindowStart(window);
  const entries = await prisma.journalEntry.findMany({
    where: { userId, ...(since ? { createdAt: { gte: since } } : {}) },
    orderBy: { createdAt: 'desc' },
    take: SUMMARY_ENTRY_LIMIT,
    select: { createdAt: true, title: true, content: true, anxietyScore: true, happinessScore: true, sadnessScore: true },
  });
  if (entries.length === 0) return { summary: 'No journal entries found for this period.', entryCount: 0 };
  const snippets = entries.map(buildEntrySnippet);
  const systemPrompt = buildSummaryPrompt(snippets, getWindowLabel(window));
  const summary = await collectHfResponse(systemPrompt, 'Please write the emotional journey summary.');
  return { summary, entryCount: entries.length };
};
