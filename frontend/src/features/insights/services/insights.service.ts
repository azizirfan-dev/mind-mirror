import api from '@/shared/services/api.config';
import type { ApiResponse, InsightsData, SummaryData, TimeWindow } from '@mindmirror/shared';

export type { TimeWindow, InsightsData, SummaryData, EmotionAverages, EmotionTrendPoint, ActivityDay, StreakData, JournalStats, EntryRef } from '@mindmirror/shared';

export const getInsights = async (window: TimeWindow): Promise<InsightsData> => {
  const res = await api.get<ApiResponse<InsightsData>>('/insights', { params: { window } });
  if (!res.data.success || !res.data.data) throw new Error(res.data.error || 'Failed to load insights');
  return res.data.data;
};

export const generateSummary = async (window: TimeWindow): Promise<SummaryData> => {
  const res = await api.post<ApiResponse<SummaryData>>('/insights/summary', { window }, { timeout: 60000 });
  if (!res.data.success || !res.data.data) throw new Error(res.data.error || 'Failed to generate summary');
  return res.data.data;
};

export const downloadPdf = async (window: TimeWindow): Promise<Blob> => {
  const res = await api.get('/insights/pdf', { params: { window }, responseType: 'blob', timeout: 90000 });
  return res.data as Blob;
};
