import { verifyToken } from '../utils/jwt.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    req.user = decoded; // attach user info
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
