import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authMiddleware } from '../middlewares/auth.middleware';
import { initChat, streamWelcome, streamChat } from '../controllers/chat.controller';
import { AuthRequest } from '../types';

const initLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  keyGenerator: (req) => (req as AuthRequest).user?.id ?? 'anonymous',
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

router.post('/init', authMiddleware, initLimiter, initChat);
router.get('/welcome-stream', authMiddleware, streamWelcome);
router.get('/stream', authMiddleware, streamChat);

export default router;
