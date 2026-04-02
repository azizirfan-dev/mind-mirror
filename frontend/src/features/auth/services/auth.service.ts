import api from '@/shared/services/api.config';

export interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export const registerWithPassword = async (input: RegisterInput): Promise<{ id?: string }> => {
  const res = await api.post<ApiEnvelope<{ id?: string }>>('/auth/register', input);
  if (!res.data.success || !res.data.data) throw new Error(res.data.error || 'Registration failed');
  return res.data.data;
};
