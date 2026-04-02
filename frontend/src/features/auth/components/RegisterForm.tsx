'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import AuthForm from './AuthForm';
import { RegisterSchema } from '@/features/auth/schemas';
import { useRegister } from '@/features/auth/hooks/useRegister';

export default function RegisterForm() {
  const register = useRegister();

  return (
    <AuthForm
      title="Create your account"
      subtitle="Start building clarity through Socratic reflection."
      submitLabel="Create account"
      isSubmitting={register.isPending}
      showNameField
      onSubmit={(values) => {
        const parsed = RegisterSchema.safeParse(values);
        if (!parsed.success) {
          toast.error(parsed.error.issues[0]?.message || 'Invalid input');
          return;
        }
        register.mutate(parsed.data);
      }}
      footer={
        <p className="font-sans text-sm text-foreground/70">
          Already have an account?{' '}
          <Link className="text-primary underline-offset-4 hover:underline" href="/login">
            Log in
          </Link>
        </p>
      }
    />
  );
}
