import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/authorize.js';
import {
  createApiKey,
  revokeApiKey
} from '../controllers/apiKeyController.js';

const router = express.Router();

router.post('/keys', authenticate, authorize('admin'), createApiKey);
router.delete('/keys/:key', authenticate, authorize('admin'), revokeApiKey);

export default router;