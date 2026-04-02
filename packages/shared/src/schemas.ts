import { z } from 'zod';

// ── Auth ──────────────────────────────────────────────────────────────────────
export const LoginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterSchema = LoginSchema.extend({
  name: z.string().min(1, 'Username is required').max(50, 'Username must be 50 characters or less'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;

// ── Journal ───────────────────────────────────────────────────────────────────
export const CreateEntrySchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, 'Required'),
});

export const UpdateEntrySchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, 'Required'),
});

export const EntryParamsSchema = z.object({
  id: z.string().uuid('Invalid entry id'),
});

export const ListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateEntryInput = z.infer<typeof CreateEntrySchema>;
export type UpdateEntryInput = z.infer<typeof UpdateEntrySchema>;

// ── Insights ──────────────────────────────────────────────────────────────────
export const WindowQuerySchema = z.object({
  window: z.enum(['7d', '30d', '90d', 'all']).default('30d'),
});

export const SummaryBodySchema = z.object({
  window: z.enum(['7d', '30d', '90d', 'all']),
});

// ── Chat ──────────────────────────────────────────────────────────────────────
export const StreamQuerySchema = z.object({
  sessionId: z.string().uuid(),
  message: z.string().min(1).max(2000),
});
