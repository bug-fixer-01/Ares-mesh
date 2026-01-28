import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import {
  createApiKey,
  revokeApiKey
} from '../controllers/apiKeyController.js';

const router = express.Router();

router.post('/keys', authenticate, createApiKey);
router.delete('/keys/:key', authenticate, revokeApiKey);

export default router;