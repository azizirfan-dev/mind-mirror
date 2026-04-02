import api from '@/shared/services/api.config';
import { getSession } from 'next-auth/react';

export interface ChatInitResponse {
  sessionId: string;
  journalPreview: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  error: string | null;
}

export const initChat = async (): Promise<ChatInitResponse> => {
  const res = await api.post<ApiEnvelope<ChatInitResponse>>('/chat/init');
  if (!res.data.success || !res.data.data) throw new Error(res.data.error ?? 'Failed to init chat');
  return res.data.data;
};

const buildStreamUrl = async (sessionId: string, message: string): Promise<string> => {
  const session = await getSession();
  const token = session?.accessToken ?? '';
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';
  const params = new URLSearchParams({ sessionId, message, token });
  return `${base}/chat/stream?${params.toString()}`;
};

export const createChatStream = async (
  sessionId: string,
  message: string,
): Promise<EventSource> => {
  const url = await buildStreamUrl(sessionId, message);
  return new EventSource(url);
};
