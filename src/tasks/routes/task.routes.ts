import express from 'express';
import { authenticateToken } from '../../auth/middleware/jwt.middleware';
import { body, param } from 'express-validator';
import { validate } from '../../auth/middleware/validate.middleware';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from '../services/task.service';
import { TaskStatus } from '../models/enums/task-status.enum';

const router = express.Router();

router.post(
  '/',
  authenticateToken,
  [
    body('title')
      .isString().withMessage('Title must be a string')
      .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
    body('description')
      .optional()
      .isString().withMessage('Description must be a string'),
    body('boardId')
      .isString().withMessage('boardId must be a valid UUID'),
  ],
  validate,
  createTask
);

router.get('/', authenticateToken, getTasks);

router.put(
  '/:id',
  authenticateToken,
  [
    param('id').isString().withMessage('Invalid task ID'),
    body('title')
      .optional()
      .isString().withMessage('Title must be a string')
      .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
    body('description')
      .optional()
      .isString().withMessage('Description must be a string'),
    body('status')
      .optional()
      .isIn(Object.values(TaskStatus)).withMessage(`Status must be one of: ${Object.values(TaskStatus).join(', ')}`),
  ],
  validate,
  updateTask
);

router.delete(
  '/:id',
  authenticateToken,
  [
    param('id').isString().withMessage('Invalid task ID'),
  ],
  validate,
  deleteTask
);

export default router;