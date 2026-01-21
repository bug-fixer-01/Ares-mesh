import redisClient from '../config/redis.js';

export const getRateLimitStats = async (req, res) => {
  const keys = await redisClient.keys('rate:*');
  console.log(keys)

  const stats = await Promise.all(
    keys.map(async (key) => ({
      key,
      count: await redisClient.get(key)
    }))
  );

  res.json(stats);
};
