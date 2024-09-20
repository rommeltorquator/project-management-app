import express from 'express';
import { auth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../middleware/asyncHandler';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  projectSchema
} from '../controllers/projectController';

const router = express.Router();

router.use(auth);

// Create Project
router.post('/', validate(projectSchema), asyncHandler(createProject));

// Get All Projects
router.get('/', asyncHandler(getProjects));

// Get Single Project
router.get('/:id', asyncHandler(getProjectById));

// Update Project
router.put('/:id', validate(projectSchema.partial()), asyncHandler(updateProject));

// Delete Project
router.delete('/:id', asyncHandler(deleteProject));

export default router;

