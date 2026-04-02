import api from '@/shared/services/api.config';
import { getSession } from 'next-auth/react';
import type { ApiResponse, ChatInitResponse } from '@/shared/types';

export type { ChatInitResponse };

export const initChat = async (previousSessionId?: string): Promise<ChatInitResponse> => {
  const res = await api.post<ApiResponse<ChatInitResponse>>('/chat/init', { previousSessionId });
  if (!res.data.success || !res.data.data) throw new Error(res.data.error ?? 'Failed to init chat');
  return res.data.data;
};

const getAuthToken = async (): Promise<string> => {
  const session = await getSession();
  return session?.accessToken ?? '';
};

const buildSseUrl = async (path: string, params: Record<string, string>): Promise<string> => {
  const token = await getAuthToken();
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';
  return `${base}${path}?${new URLSearchParams({ ...params, token }).toString()}`;
};

export const createChatStream = async (sessionId: string, message: string): Promise<EventSource> =>
  new EventSource(await buildSseUrl('/chat/stream', { sessionId, message }));

export const createWelcomeStream = async (sessionId: string): Promise<EventSource> =>
  new EventSource(await buildSseUrl('/chat/welcome-stream', { sessionId }));
