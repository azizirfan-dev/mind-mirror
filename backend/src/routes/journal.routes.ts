import { Router } from 'express';
import * as journalController from '../controllers/journal.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', journalController.createEntry);
router.get('/', journalController.getEntries);
router.get('/:id', journalController.getEntryById);
router.put('/:id', journalController.updateEntry);
router.delete('/:id', journalController.deleteEntry);

export default router;
