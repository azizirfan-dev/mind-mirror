'use client';

import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { registerWithPassword, type RegisterInput } from '@/features/auth/services/auth.service';

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      await registerWithPassword(input);
      const result = await signIn('credentials', {
        email: input.email,
        password: input.password,
        redirect: false,
      });
      if (!result || result.error) throw new Error('Account created but auto-login failed. Please log in.');
      return result;
    },
    onSuccess: () => {
      toast.success('Account created.');
      router.push('/dashboard');
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : 'Registration failed';
      toast.error(message);
    },
  });
};
