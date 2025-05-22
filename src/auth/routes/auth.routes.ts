import express from 'express';
import { login, register } from '../services/auth.service';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.middleware';

const router = express.Router();

router.post(
  '/register',
  [
    body('username')
      .isString().withMessage('Username must be a string')
      .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('password')
      .isString().withMessage('Password must be a string')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('username')
      .isString().withMessage('Username must be a string')
      .notEmpty().withMessage('Username is required'),
    body('password')
      .isString().withMessage('Password must be a string')
      .notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

export default router;
