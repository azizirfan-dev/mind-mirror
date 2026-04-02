import type { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';
import { prisma } from '../lib/prisma';

interface NextAuthPayload {
  sub: string;
  email: string;
  name?: string;
}

const extractToken = (req: AuthRequest): string | null => {
  const header = req.headers.authorization;
  if (header) {
    const [scheme, token] = header.split(' ');
    if (scheme === 'Bearer' && token) return token;
  }
  // Fallback for EventSource (SSE) which cannot set custom headers
  const queryToken = req.query?.token;
  if (typeof queryToken === 'string' && queryToken) return queryToken;
  return null;
};

const verifyToken = (token: string): NextAuthPayload => {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('Missing NEXTAUTH_SECRET');
  return jwt.verify(token, secret) as NextAuthPayload;
};

const upsertUser = async (payload: NextAuthPayload) => {
  if (!payload.email) throw new Error('Missing email in token');
  return prisma.user.upsert({
    where: { email: payload.email },
    update: { name: payload.name ?? undefined },
    create: { email: payload.email, name: payload.name ?? undefined },
  });
};

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const payload = verifyToken(token);
    const user = await upsertUser(payload);
    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Unauthorized' });
  }
};
