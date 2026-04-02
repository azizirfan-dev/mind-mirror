import { Request, Response } from 'express';
import { z } from 'zod';
import type { AuthRequest } from '../types';
import * as authService from '../services/auth.service';

const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const RegisterSchema = AuthSchema.extend({
  name: z.string().min(1, 'Username is required').max(50),
});

const sendSuccess = (res: Response, data: unknown, status = 200) => {
  res.status(status).json({ success: true, data });
};

const sendErr = (res: Response, error: unknown, status = 500) => {
  const message = error instanceof Error ? error.message : 'Error';
  res.status(status).json({ success: false, error: message });
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = AuthSchema.parse(req.body);
    const tokenData = await authService.login(email, password);
    sendSuccess(res, tokenData);
  } catch (err) {
    const isZod = err instanceof z.ZodError;
    sendErr(res, err, isZod ? 400 : 401);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = RegisterSchema.parse(req.body);
    const user = await authService.register(email, password, name);
    sendSuccess(res, user, 201);
  } catch (err) {
    const isZod = err instanceof z.ZodError;
    sendErr(res, err, isZod ? 400 : 409);
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) return sendErr(res, new Error('Unauthorized'), 401);
    const user = await authService.getMe(req.user.id);
    if (!user) return sendErr(res, new Error('Unauthorized'), 401);
    sendSuccess(res, user);
  } catch (err) {
    sendErr(res, err);
  }
};
