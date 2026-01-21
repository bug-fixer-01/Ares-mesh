import crypto from 'crypto';

export const generateApiKey = () => {
  return `sk_${crypto.randomBytes(16).toString('hex')}`;
};
