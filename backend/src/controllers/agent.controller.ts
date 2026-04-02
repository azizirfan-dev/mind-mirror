import { Response } from 'express';
import { AuthRequest } from '../types';
import { runPromptArchitect } from '../services/ai/langGraph/promptArchitect.graph';

const sendSuccess = (res: Response, data: unknown, status = 200) =>
  res.status(status).json({ success: true, data });

const sendErr = (res: Response, error: unknown, status = 500) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  res.status(status).json({ success: false, error: message });
};

export const generatePrompt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) throw new Error('Unauthorized');
    const prompt = await runPromptArchitect(req.user.id);
    sendSuccess(res, { prompt });
  } catch (err) {
    sendErr(res, err);
  }
};
