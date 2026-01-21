import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/authorize.js';
import { getUsageStats } from '../controllers/analyticsController.js';

const router = express.Router();

router.get(
  '/analytics/usage',
  authenticate,
  authorize('admin'),
  getUsageStats
);

export default router;
