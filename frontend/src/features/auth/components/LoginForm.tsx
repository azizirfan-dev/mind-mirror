'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import AuthForm from './AuthForm';
import { LoginSchema } from '@/features/auth/schemas';
import { useLogin } from '@/features/auth/hooks/useLogin';

export default function LoginForm() {
  const login = useLogin();

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Log in to continue your reflection."
      submitLabel="Log in"
      isSubmitting={login.isPending}
      onSubmit={(values) => {
        const parsed = LoginSchema.safeParse(values);
        if (!parsed.success) {
          toast.error(parsed.error.issues[0]?.message || 'Invalid input');
          return;
        }
        login.mutate(parsed.data);
      }}
      footer={
        <p className="font-sans text-sm text-foreground/70">
          Don't have an account?{' '}
          <Link className="text-primary underline-offset-4 hover:underline" href="/register">
            Create one
          </Link>
        </p>
      }
    />
  );
}
