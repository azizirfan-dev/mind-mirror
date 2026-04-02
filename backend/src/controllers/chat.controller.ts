import { Response } from 'express';
import { ZodSchema } from 'zod';
import { randomUUID } from 'crypto';
import { AuthRequest } from '../types';
import { StreamQuerySchema, WelcomeQuerySchema, InitChatBodySchema } from '../shared/schemas';
import { getLatestEntry } from '../services/journal.service';
import { streamSocraticResponse, streamWelcomeMessage, EmotionContext, ChatMessage } from '../services/ai/hf.service';

interface SessionData {
  journalContent: string;
  emotionScores: EmotionContext | null;
}

const sessions = new Map<string, SessionData>();

type LatestEntry = NonNullable<Awaited<ReturnType<typeof getLatestEntry>>>;

const setSseHeaders = (res: Response): void => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
};

const startPing = (res: Response): ReturnType<typeof setInterval> =>
  setInterval(() => res.write('data: {"type":"ping"}\n\n'), 1500);

const safeParse = <T>(schema: ZodSchema<T>, data: unknown, res: Response): T | null => {
  const result = schema.safeParse(data);
  if (!result.success) {
    res.status(400).json({ success: false, data: null, error: result.error.message });
    return null;
  }
  return result.data;
};

const runSse = async (req: AuthRequest, res: Response, handler: () => Promise<void>): Promise<void> => {
  setSseHeaders(res);
  const ping = startPing(res);
  req.on('close', () => clearInterval(ping));
  try {
    await handler();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Stream failed';
    res.write(`data: ${JSON.stringify({ type: 'error', message: msg })}\n\n`);
  } finally {
    clearInterval(ping);
    res.end();
  }
};

const pipeStream = async (res: Response, journalContent: string, messages: ChatMessage[]): Promise<void> => {
  for await (const chunk of streamSocraticResponse(journalContent, messages)) {
    res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunk })}\n\n`);
  }
  res.write('data: {"type":"done"}\n\n');
};

const pipeWelcome = async (res: Response, data: SessionData): Promise<void> => {
  for await (const chunk of streamWelcomeMessage(data.journalContent, data.emotionScores)) {
    res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunk })}\n\n`);
  }
  res.write('data: {"type":"done"}\n\n');
};

const extractEmotionScores = (entry: LatestEntry): EmotionContext | null => {
  const vals = [entry.anxietyScore, entry.stressScore, entry.happinessScore, entry.angerScore, entry.sadnessScore, entry.depressionScore];
  if (!vals.some((v) => v !== null)) return null;
  return { anxiety: entry.anxietyScore, stress: entry.stressScore, happiness: entry.happinessScore, anger: entry.angerScore, sadness: entry.sadnessScore, depression: entry.depressionScore };
};

const toSessionData = (entry: LatestEntry): SessionData => ({
  journalContent: entry.content,
  emotionScores: extractEmotionScores(entry),
});

const registerSession = (data: SessionData): string => {
  const sessionId = randomUUID();
  sessions.set(sessionId, data);
  setTimeout(() => sessions.delete(sessionId), 30 * 60 * 1000);
  return sessionId;
};

export const initChat = async (req: AuthRequest, res: Response): Promise<void> => {
  const body = safeParse(InitChatBodySchema, req.body, res);
  if (body === null) return;
  if (body.previousSessionId) sessions.delete(body.previousSessionId);
  const entry = await getLatestEntry(req.user!.id);
  const sessionData = entry ? toSessionData(entry) : { journalContent: '', emotionScores: null };
  const sessionId = registerSession(sessionData);
  res.json({ success: true, data: { sessionId }, error: null });
};

export const streamWelcome = async (req: AuthRequest, res: Response): Promise<void> => {
  const query = safeParse(WelcomeQuerySchema, req.query, res);
  if (!query) return;
  const sessionData = sessions.get(query.sessionId);
  if (!sessionData) {
    res.status(404).json({ success: false, data: null, error: 'Session not found' });
    return;
  }
  await runSse(req, res, () => pipeWelcome(res, sessionData));
};

export const streamChat = async (req: AuthRequest, res: Response): Promise<void> => {
  const query = safeParse(StreamQuerySchema, req.query, res);
  if (!query) return;
  const sessionData = sessions.get(query.sessionId);
  if (!sessionData) {
    res.status(404).json({ success: false, data: null, error: 'Session not found' });
    return;
  }
  await runSse(req, res, () => pipeStream(res, sessionData.journalContent, [{ role: 'user', content: query.message }]));
};
