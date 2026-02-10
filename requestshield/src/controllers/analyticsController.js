import redisClient from '../config/redis.js';

export const getUsageStats = async (req, res) => {
  const keys = await redisClient.keys('usage:*');
  const stats = await Promise.all(
    keys.map(async (key) => ({
      userId: key.replace('usage:', ''),
      username:req.user.username,
      totalRequests: Number(await redisClient.get(key))
    }))
  );
  
  res.json(stats);
};
    