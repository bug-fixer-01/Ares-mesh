import express from 'express';
import { authenticateUser } from '../service/userService.js';

const router = express.Router();

router.post('/login', authenticateUser);

export default router;
