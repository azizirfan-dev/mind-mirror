import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { initChat, streamChat } from '../controllers/chat.controller';

const router = Router();

router.post('/init', authMiddleware, initChat);
router.get('/stream', authMiddleware, streamChat);

export default router;
