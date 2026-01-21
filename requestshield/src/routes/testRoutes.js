import express from 'express';
import { rateLimiter } from '../middlewares/rateLimiter.js';
import { apiKeyAuth } from '../middlewares/apiKeyAuth.js';


const router = express.Router();

router.get('/secure',apiKeyAuth, rateLimiter, (req, res) => {
  res.json({
    message: 'Request successful',
    time: new Date().toISOString()
  });
});

export default router;
