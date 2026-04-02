import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status: number | undefined = error?.response?.status;
    const message: string | undefined = error?.response?.data?.error;

    if (status === 401) {
      await signOut({ redirect: false });
      toast.error(message || 'Unauthorized. Please log in again.');
    } else if (status && status >= 500) {
      toast.error(message || 'Server error. Please try again.');
    }

    return Promise.reject(error);
  },
);

export default api;
