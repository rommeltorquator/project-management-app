import express from 'express';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
  taskSchema
} from '../controllers/taskController';

const router = express.Router();

// Apply auth middleware to all routes in this router
router.use(auth);

// Create Task
router.post('/', validate(taskSchema), asyncHandler(createTask));

// Get Tasks by Project
router.get('/project/:projectId', asyncHandler(getTasksByProject));

// Get Single Task
router.get('/:id', asyncHandler(getTaskById));

// Update Task
router.put('/:id', validate(taskSchema.partial()), asyncHandler(updateTask));

// Delete Task
router.delete('/:id', asyncHandler(deleteTask));

export default router;
