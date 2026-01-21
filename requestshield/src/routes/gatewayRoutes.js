import express from 'express';
import { apiKeyAuth } from '../middlewares/apiKeyAuth.js';
import { rateLimiter } from '../middlewares/rateLimiter.js';
import { forwardRequest } from '../service/backendProxy.js';
import {
  canProceed,
  recordFailure,
  recordSuccess
} from '../utils/circuitBreaker.js';

const router = express.Router();

router.post(
  '/gateway/data',
  apiKeyAuth,
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
