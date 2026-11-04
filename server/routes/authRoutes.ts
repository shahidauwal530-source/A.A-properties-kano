import { Router } from 'express';
import {
  signUp,
  signIn,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile,
} from '../controllers/authController.ts';
import { authMiddleware } from '../middleware/auth.ts';

const router = Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/logout', logout);
router.get('/me', authMiddleware, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/profile', authMiddleware, updateProfile);

export default router;
