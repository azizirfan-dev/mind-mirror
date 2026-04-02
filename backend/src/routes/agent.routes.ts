import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authMiddleware } from '../middlewares/auth.middleware';
import { generatePrompt } from '../controllers/agent.controller';
import { AuthRequest } from '../types';

const promptLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => (req as AuthRequest).user?.id ?? 'anonymous',
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

router.use(authMiddleware);
router.post('/prompt', promptLimiter, generatePrompt);

export default router;
