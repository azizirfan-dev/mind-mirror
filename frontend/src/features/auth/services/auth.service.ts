import api from '@/shared/services/api.config';
import type { ApiResponse, AuthUser } from '@/shared/types';

export type { ApiResponse as ApiEnvelope } from '@/shared/types';
export type { AuthUser } from '@/shared/types';
export type { LoginInput, RegisterInput } from '@/shared/schemas';

export const registerWithPassword = async (input: { email: string; password: string; name: string }): Promise<{ id?: string }> => {
  const res = await api.post<ApiResponse<{ id?: string }>>('/auth/register', input);
  if (!res.data.success || !res.data.data) throw new Error(res.data.error || 'Registration failed');
  return res.data.data;
};
