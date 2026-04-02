'use client';

import { useState } from 'react';

export type AuthFormValues = {
  email: string;
  password: string;
  name?: string;
};

type Props = {
  title: string;
  subtitle: string;
  submitLabel: string;
  isSubmitting: boolean;
  showNameField?: boolean;
  onSubmit: (values: AuthFormValues) => void | Promise<void>;
  footer: React.ReactNode;
};

export default function AuthForm({
  title,
  subtitle,
  submitLabel,
  isSubmitting,
  showNameField = false,
  onSubmit,
  footer,
}: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const canSubmit =
    email.length > 0 && password.length > 0 && (!showNameField || name.length > 0);

  return (
    <div className="mx-auto w-full max-w-md px-6 py-10">
      <div className="rounded-3xl border border-foreground/10 bg-background/70 p-8 shadow-sm backdrop-blur">
        <div className="mb-8">
          <h1 className="font-sans text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-2 font-serif text-base italic text-foreground/70">
            {subtitle}
          </p>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ email, password, ...(showNameField ? { name } : {}) });
          }}
        >
          {showNameField && (
            <label className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-foreground/60">
                Username
              </span>
              <input
                className="h-11 rounded-2xl border border-foreground/10 bg-background px-4 font-sans text-base text-foreground outline-none ring-0 transition focus:border-accent/50"
                type="text"
                autoComplete="username"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          )}

          <label className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-foreground/60">
              Email
            </span>
            <input
              className="h-11 rounded-2xl border border-foreground/10 bg-background px-4 font-sans text-base text-foreground outline-none ring-0 transition focus:border-accent/50"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-foreground/60">
              Password
            </span>
            <input
              className="h-11 rounded-2xl border border-foreground/10 bg-background px-4 font-sans text-base text-foreground outline-none ring-0 transition focus:border-accent/50"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="mt-2 h-11 rounded-[2rem] bg-accent px-6 font-sans text-sm font-medium text-foreground transition-transform duration-300 disabled:cursor-not-allowed disabled:opacity-60 hover:scale-[1.01]"
            style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
          >
            {isSubmitting ? 'Please wait…' : submitLabel}
          </button>
        </form>

        <div className="mt-6 border-t border-foreground/10 pt-6">{footer}</div>
      </div>
    </div>
  );
}
