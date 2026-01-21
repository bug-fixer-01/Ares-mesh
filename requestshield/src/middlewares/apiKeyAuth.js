import { apiKeys } from '../Data/apiKeys.js';

export const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({
      error: 'API key missing'
    });
  }

  const keyData = apiKeys[apiKey];

  if (!keyData) {
    return res.status(403).json({
      error: 'Invalid API key'
    });
  }

  req.client = {
    apiKey,
    ...keyData
  };

  next();
};
