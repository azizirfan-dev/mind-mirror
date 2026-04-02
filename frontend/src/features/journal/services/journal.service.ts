import api from '@/shared/services/api.config';
import { type ApiEnvelope } from '@/features/auth/services/auth.service';

export interface EmotionScores {
  anxiety: number | null;
  stress: number | null;
  happiness: number | null;
  anger: number | null;
  sadness: number | null;
  depression: number | null;
}

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

export interface CreateEntryInput {
  title?: string;
  content: string;
}

export const getEntries = async (page = 1, limit = 20): Promise<PaginatedEntries> => {
  const res = await api.get<ApiEnvelope<PaginatedEntries>>('/journal', { params: { page, limit } });
  if (!res.data.success || !res.data.data) throw new Error(res.data.error || 'Error');
  return res.data.data;
};

export const getEntryById = async (id: string): Promise<JournalEntry> => {
  const res = await api.get<ApiEnvelope<JournalEntry>>(`/journal/${id}`);
  if (!res.data.success || !res.data.data) throw new Error(res.data.error || 'Error');
  return res.data.data;
};

export const createEntry = async (input: CreateEntryInput): Promise<JournalEntry> => {
  const res = await api.post<ApiEnvelope<JournalEntry>>('/journal', input);
  if (!res.data.success || !res.data.data) throw new Error(res.data.error || 'Error');
  return res.data.data;
};

export interface UpdateEntryInput {
  title?: string;
  content: string;
}

export const updateEntry = async (id: string, input: UpdateEntryInput): Promise<JournalEntry> => {
  const res = await api.put<ApiEnvelope<JournalEntry>>(`/journal/${id}`, input);
  if (!res.data.success || !res.data.data) throw new Error(res.data.error || 'Error');
  return res.data.data;
};

export const deleteEntry = async (id: string): Promise<void> => {
  const res = await api.delete<ApiEnvelope<null>>(`/journal/${id}`);
  if (!res.data.success) throw new Error(res.data.error || 'Error');
};
