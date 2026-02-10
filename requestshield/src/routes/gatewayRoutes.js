import express from 'express';
import { rateLimiter } from '../middlewares/rateLimiter.js';
import { forwardRequest } from '../service/backendProxy.js';
import {
  canProceed,
  recordFailure,
  recordSuccess
} from '../utils/circuitBreaker.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post(
  '/gateway/data',
  authenticate,
  rateLimiter,
  async (req, res) => {
      if (!canProceed()) {
      return res.status(503).json({
        error: 'Service temporarily unavailable'
      });
    }
    
    try {
      const data = await forwardRequest(req,res);
       recordSuccess();
      res.json({ data });
    } catch (err) {
      recordFailure();  
      res.status(504).json({
        error: 'Backend service timeout'
      });
    }
  }
);

export default router;
