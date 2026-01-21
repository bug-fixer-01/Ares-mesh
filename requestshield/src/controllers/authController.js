import { generateToken } from '../utils/jwt.js';

export const login = (req, res) => {
  const { username, role = 'user' } = req.body;

  const user = {
    id: username,
    role
  };

  const token = generateToken(user);

  res.json({ token });
};
