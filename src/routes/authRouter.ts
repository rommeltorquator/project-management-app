import express from 'express';
import { registerUser, loginUser, registerSchema, loginSchema } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';

const router = express.Router();

// Register User
router.post('/register', validate(registerSchema), asyncHandler(registerUser));

// Login User
router.post('/login', validate(loginSchema), asyncHandler(loginUser));

export default router;
