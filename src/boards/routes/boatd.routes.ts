import express from 'express';
import { authenticateToken } from '../../auth/middleware/jwt.middleware';
import { createBoard, deleteBoard, getBoards, getOneById } from '../services/board.service';
import { body, param } from 'express-validator';
import { validate } from '../../auth/middleware/validate.middleware';

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  [
    body('name')
      .isString().withMessage('Title must be a string')
      .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
  ],
  validate,
  createBoard
);

router.get('/', authenticateToken, getBoards);

router.get(
  '/:id',
  authenticateToken,
  [
    param('id').isUUID().withMessage('Invalid board ID'),
  ],
  validate,
  getOneById
);

router.delete(
  '/:id',
  authenticateToken,
  deleteBoard
);

export default router;
