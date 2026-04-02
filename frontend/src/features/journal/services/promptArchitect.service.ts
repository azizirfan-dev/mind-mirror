import api from '@/shared/services/api.config';
import type { ApiResponse, PromptArchitectResponse } from '@mindmirror/shared';

export type { PromptArchitectResponse };

export const generateWritingPrompt = async (): Promise<PromptArchitectResponse> => {
  const res = await api.post<ApiResponse<PromptArchitectResponse>>('/agent/prompt');
  if (!res.data.success || !res.data.data) throw new Error(res.data.error || 'Failed to generate prompt');
  return res.data.data;
};
