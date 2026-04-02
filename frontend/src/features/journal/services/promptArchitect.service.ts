import api from '@/shared/services/api.config';
import { type ApiEnvelope } from '@/features/auth/services/auth.service';

export interface PromptArchitectResponse {
  prompt: string;
}

export const generateWritingPrompt = async (): Promise<PromptArchitectResponse> => {
  const res = await api.post<ApiEnvelope<PromptArchitectResponse>>('/agent/prompt');
  if (!res.data.success || !res.data.data) throw new Error(res.data.error || 'Failed to generate prompt');
  return res.data.data;
};
