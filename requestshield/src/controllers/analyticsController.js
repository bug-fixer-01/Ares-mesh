import redisClient from '../config/redis.js';

export const getUsageStats = async (req, res) => {
  const keys = await redisClient.keys('usage:*');
  console.log(keys)

  const stats = await Promise.all(
    keys.map(async (key) => ({
      apiKey: key.replace('usage:', ''),
      totalRequests: Number(await redisClient.get(key))
    }))
  );

  res.json(stats);
};
    