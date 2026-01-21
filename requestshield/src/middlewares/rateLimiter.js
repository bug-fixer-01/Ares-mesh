import redisClient from '../config/redis.js';

export const rateLimiter = async (req, res, next) => {
  try {
    const { apiKey, limit } = req.client;

    const redisKey = `rate:${apiKey}`;
    const usageKey = `usage:${apiKey}`;
    const current = await redisClient.get(redisKey);

    await redisClient.incr(usageKey);
    
    if (current && Number(current) >= limit) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        tier: req.client.tier
      });
    }

    if (current) {
      await redisClient.incr(redisKey);
    } else {
      await redisClient.set(redisKey, 1, { EX: 60 });
    }

    next();
  } catch (err) {
    console.error(err);
    next();
  }
};
