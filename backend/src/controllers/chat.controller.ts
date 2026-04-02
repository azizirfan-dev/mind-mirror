import { Response } from 'express';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { AuthRequest } from '../types';
import { StreamQuerySchema } from '@mindmirror/shared';
import { getLatestEntry } from '../services/journal.service';
import { streamSocraticResponse, ChatMessage } from '../services/ai/hf.service';

const sessions = new Map<string, string>();

const setSseHeaders = (res: Response): void => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
};

const startPing = (res: Response): ReturnType<typeof setInterval> =>
  setInterval(() => res.write('data: {"type":"ping"}\n\n'), 1500);

const pipeStream = async (
  res: Response,
  journalContent: string,
  messages: ChatMessage[]
): Promise<void> => {
  for await (const chunk of streamSocraticResponse(journalContent, messages)) {
    res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunk })}\n\n`);
  }
  res.write('data: {"type":"done"}\n\n');
};

export const initChat = async (req: AuthRequest, res: Response): Promise<void> => {
  const entry = await getLatestEntry(req.user!.id);
  if (!entry) {
    res.status(404).json({ success: false, data: null, error: 'No journal entries found' });
    return;
  }
  const sessionId = randomUUID();
  sessions.set(sessionId, entry.content);
  setTimeout(() => sessions.delete(sessionId), 30 * 60 * 1000);
  res.json({
    success: true,
    data: { sessionId, journalPreview: entry.content.slice(0, 80) },
    error: null,
  });
};

export const streamChat = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = StreamQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ success: false, data: null, error: parsed.error.message });
    return;
  }
  const { sessionId, message } = parsed.data;
  const journalContent = sessions.get(sessionId);
  if (!journalContent) {
    res.status(404).json({ success: false, data: null, error: 'Session not found' });
    return;
  }

  setSseHeaders(res);
  const pingInterval = startPing(res);
  req.on('close', () => clearInterval(pingInterval));

  try {
    await pipeStream(res, journalContent, [{ role: 'user', content: message }]);
  } catch (err) {
    console.error('[streamChat]', err);
    const msg = err instanceof Error ? err.message : 'Stream failed';
    res.write(`data: ${JSON.stringify({ type: 'error', message: msg })}\n\n`);
  } finally {
    clearInterval(pingInterval);
    res.end();
  }
};
