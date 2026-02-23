import axios from 'axios';
import { generateToken } from '../utils/jwt.js';

const userAuthJwt = axios.create({
  timeout: 5000 // 2 seconds
});

export const authenticateUser = (endpoint) => async (req, res) => {
  try {
    const { username, password } = req.body;

    const response = await userAuthJwt.post(
      `http://user-service:5000/auth/${endpoint}`,
      { username, password }
    );

    const user = response.data;
    const token = generateToken(user);

    return res.status(200).json({ user, token });
  } catch (error) {
    console.log("error 👉", error.response?.data || error.message);

    // If error came from auth service
    if (error.response) {
      return res.status(error.response.status).json({
        message: error.response.data.message || "Authentication failed",
      });
    }

    // Network / unexpected error
    return res.status(500).json({
      message: "Authentication service unavailable",
    });
  }
};
