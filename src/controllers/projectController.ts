import { Response, NextFunction } from 'express';
import Project from '../models/ProjectModel';
import { AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  priority: z.enum(['High', 'Medium', 'Low']).optional(),
});

export const createProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, startDate, endDate, priority } = projectSchema.parse(req.body);

    const newProject = new Project({
      user: req.user.id,
      title,
      description,
      startDate,
      endDate,
      priority,
    });

    const project = await newProject.save();
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

export const getProjects = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

export const getProjectById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findOne({ _id: projectId, user: req.user.id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    next(err);
  }
};

export const updateProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id;
    const updates = projectSchema.partial().parse(req.body);

    const project = await Project.findOneAndUpdate(
      { _id: projectId, user: req.user.id },
      { $set: updates },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    next(err);
  }
};

export const deleteProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findOneAndDelete({ _id: projectId, user: req.user.id });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    next(err);
  }
};

