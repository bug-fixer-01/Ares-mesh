import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/authorize.js';
import { getRateLimitStats } from '../controllers/adminController.js';

const router = express.Router();

router.get(
  '/rate-limits',
  authenticate,
  authorize('admin'),
  getRateLimitStats
);

export default router;
    