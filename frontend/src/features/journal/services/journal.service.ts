import api from '@/shared/services/api.config';
import type { ApiResponse, JournalEntry, JournalListItem, PaginatedEntries, EmotionScores, CreateEntryInput, UpdateEntryInput } from '@mindmirror/shared';

export type { EmotionScores, JournalEntry, JournalListItem, PaginatedEntries, CreateEntryInput, UpdateEntryInput };

export const getEntries = async (page = 1, limit = 20): Promise<PaginatedEntries> => {
  const res = await api.get<ApiResponse<PaginatedEntries>>('/journal', { params: { page, limit } });
  if (!res.data.success || !res.data.data) throw new Error(res.data.error || 'Error');
  return res.data.data;
};

export const getEntryById = async (id: string): Promise<JournalEntry> => {
  const res = await api.get<ApiResponse<JournalEntry>>(`/journal/${id}`);
  if (!res.data.success || !res.data.data) throw new Error(res.data.error || 'Error');
  return res.data.data;
};

export const createEntry = async (input: CreateEntryInput): Promise<JournalEntry> => {
  const res = await api.post<ApiResponse<JournalEntry>>('/journal', input);
  if (!res.data.success || !res.data.data) throw new Error(res.data.error || 'Error');
  return res.data.data;
};

export const updateEntry = async (id: string, input: UpdateEntryInput): Promise<JournalEntry> => {
  const res = await api.put<ApiResponse<JournalEntry>>(`/journal/${id}`, input);
  if (!res.data.success || !res.data.data) throw new Error(res.data.error || 'Error');
  return res.data.data;
};

export const deleteEntry = async (id: string): Promise<void> => {
  const res = await api.delete<ApiResponse<null>>(`/journal/${id}`);
  if (!res.data.success) throw new Error(res.data.error || 'Error');
};
