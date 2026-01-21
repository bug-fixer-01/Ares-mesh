import { apiKeys } from '../Data/apiKeys.js';
import { generateApiKey } from '../utils/apiKeys.js';

export const createApiKey = (req, res) => {
  const { owner, tier } = req.body;

  const limits = {
    free: 20,
    pro: 100
  };

  const apiKey = generateApiKey();

  apiKeys[apiKey] = {
    owner,
    tier,
    limit: limits[tier] || limits.free,
    createdAt: new Date()
  };

  res.status(201).json({
    apiKey,
    metadata: apiKeys[apiKey]
  });
};

export const revokeApiKey = (req, res) => {
  const { key } = req.params;

  if (!apiKeys[key]) {
    return res.status(404).json({ error: 'Key not found' });
  }

  delete apiKeys[key];
  res.json({ message: 'API key revoked' });
};
