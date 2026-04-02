'use client';

import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { LoginInput } from '@/features/auth/services/auth.service';

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const result = await signIn('credentials', {
        email: input.email,
        password: input.password,
        redirect: false,
      });
      if (!result || result.error) throw new Error('Invalid credentials');
      return result;
    },
    onSuccess: () => {
      toast.success('Logged in.');
      router.push('/dashboard');
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Login failed';
      toast.error(message);
    },
  });
};
