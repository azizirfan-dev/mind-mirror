import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterSchema = LoginSchema.extend({
  name: z.string().min(1, 'Username is required').max(50, 'Username must be 50 characters or less'),
});

export type LoginValues = z.infer<typeof LoginSchema>;
export type RegisterValues = z.infer<typeof RegisterSchema>;
