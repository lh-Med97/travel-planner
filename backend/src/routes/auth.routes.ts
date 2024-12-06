import { Router } from 'express';
import { register, login, logout, refreshToken } from '../controllers/auth.controller';
import { validateAuth } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', validateAuth, register);
router.post('/login', validateAuth, login);
router.post('/logout', authenticate, logout);
router.post('/refresh-token', refreshToken);

export default router;
