import redisClient from '../config/redis.js';

export const rateLimiter = async (req, res, next) => {
  try {
    const { _id , role , username} = req.user;
    const limit = role === 'admin' ? 100 : 50; // higher limit for admins

    const redisKey = `rate:${_id}`;
    const usageKey = `usage:${_id}-${username}`;
    const current = await redisClient.get(redisKey);
    console.log("this" + current)
   
    console.log(usageKey);
     
    await redisClient.incr(usageKey);
    
    if (current && Number(current) >= limit) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        tier: role === 'admin' ? 'pro' : 'free',
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
