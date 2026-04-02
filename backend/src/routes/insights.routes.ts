import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as insightsController from '../controllers/insights.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { AuthRequest } from '../types';

const summaryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => (req as AuthRequest).user?.id ?? 'anonymous',
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

router.use(authMiddleware);

router.get('/', insightsController.getInsights);
router.post('/summary', summaryLimiter, insightsController.generateSummary);
router.get('/pdf', insightsController.downloadPdf);

export default router;
