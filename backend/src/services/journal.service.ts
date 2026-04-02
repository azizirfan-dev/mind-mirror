import { prisma } from '../lib/prisma';
import { JournalEntry } from '@prisma/client';
import { computeEmotionScores } from './emotion.service';

const extractEmotionScores = (entry: JournalEntry) => ({
  anxiety: entry.anxietyScore,
  stress: entry.stressScore,
  happiness: entry.happinessScore,
  anger: entry.angerScore,
  sadness: entry.sadnessScore,
  depression: entry.depressionScore,
});

const toListItem = (entry: JournalEntry) => ({
  id: entry.id,
  title: entry.title ?? null,
  preview: entry.content.slice(0, 80),
  createdAt: entry.createdAt,
  emotionScores: extractEmotionScores(entry),
});

const toDetailItem = (entry: JournalEntry) => ({
  ...entry,
  emotionScores: extractEmotionScores(entry),
});

const nullScores = () => ({
  anxietyScore: null, stressScore: null, happinessScore: null,
  angerScore: null, sadnessScore: null, depressionScore: null,
});

const saveEntry = async (userId: string, content: string, title?: string) => {
  return prisma.journalEntry.create({
    data: { userId, title: title ?? null, content },
  });
};

const applyEmotionScores = async (entryId: string, content: string) => {
  const scores = await computeEmotionScores(content);
  if (!scores) return;
  await prisma.journalEntry.update({ where: { id: entryId }, data: scores });
};

const scheduleScoring = (entryId: string, content: string) => {
  setImmediate(() => applyEmotionScores(entryId, content));
};

export const processEntry = async (userId: string, content: string, title?: string) => {
  const entry = await saveEntry(userId, content, title);
  scheduleScoring(entry.id, content);
  return toDetailItem(entry);
};

export const getUserEntries = async (userId: string, page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const [entries, total] = await Promise.all([
    prisma.journalEntry.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.journalEntry.count({ where: { userId } }),
  ]);
  return { data: entries.map(toListItem), total, page };
};

export const getEntry = async (userId: string, entryId: string) => {
  const entry = await prisma.journalEntry.findFirst({ where: { id: entryId, userId } });
  if (!entry) return null;
  return toDetailItem(entry);
};

export const getLatestEntry = async (userId: string) => {
  return prisma.journalEntry.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      content: true,
      anxietyScore: true,
      stressScore: true,
      happinessScore: true,
      angerScore: true,
      sadnessScore: true,
      depressionScore: true,
    },
  });
};

export const updateEntry = async (userId: string, entryId: string, content: string, title?: string) => {
  const existing = await prisma.journalEntry.findFirst({ where: { id: entryId, userId } });
  if (!existing) return null;
  const updated = await prisma.journalEntry.update({
    where: { id: entryId },
    data: { title: title ?? existing.title, content, ...nullScores() },
  });
  scheduleScoring(entryId, content);
  return toDetailItem(updated);
};

export const deleteEntry = async (userId: string, entryId: string): Promise<boolean> => {
  const existing = await prisma.journalEntry.findFirst({ where: { id: entryId, userId } });
  if (!existing) return false;
  await prisma.journalEntry.delete({ where: { id: entryId } });
  return true;
};
