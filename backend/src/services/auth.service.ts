import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export interface RegisteredUser {
  id: string;
  email: string;
}

export interface LoginResult {
  access_token: string;
  user: { id: string; email: string; name: string | null };
}

const SALT_ROUNDS = 12;

const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

const createUser = async (email: string, hashedPassword: string, name: string): Promise<RegisteredUser> => {
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
    select: { id: true, email: true },
  });
  return user;
};

const signToken = (payload: { sub: string; email: string; name: string | null }): string => {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error('Missing NEXTAUTH_SECRET');
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

export const login = async (email: string, password: string): Promise<LoginResult> => {
  const user = await findUserByEmail(email);
  if (!user?.password) throw new Error('Invalid credentials');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Invalid credentials');

  const access_token = signToken({ sub: user.id, email: user.email, name: user.name });
  return { access_token, user: { id: user.id, email: user.email, name: user.name } };
};

export const register = async (email: string, password: string, name: string): Promise<RegisteredUser> => {
  const existing = await findUserByEmail(email);
  if (existing) throw new Error('Email already registered');
  const hashedPassword = await hashPassword(password);
  return createUser(email, hashedPassword, name);
};

export const getMe = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
  });
};
