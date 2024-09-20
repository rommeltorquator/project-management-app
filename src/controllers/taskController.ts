import { Response, NextFunction } from 'express';
import { z } from 'zod';
import Task from '../models/TaskModel';
import Project from '../models/ProjectModel';
import { AuthenticatedRequest } from '../middleware/auth';

export const taskSchema = z.object({
  project: z.string().min(1, 'Project ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(['To Do', 'In Progress', 'Completed']).optional(),
});

export const createTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { project, title, description, dueDate, status } = taskSchema.parse(req.body);

    // Verify that the project exists and belongs to the user
    const existingProject = await Project.findOne({ _id: project, user: req.user.id });
    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const newTask = new Task({
      project,
      title,
      description,
      dueDate,
      status,
    });

    const task = await newTask.save();
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const getTasksByProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.projectId;

    // Verify that the project exists and belongs to the user
    const existingProject = await Project.findOne({ _id: projectId, user: req.user.id });

    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const tasks = await Task.find({ project: projectId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

export const getTaskById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId).populate('project');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify that the project belongs to the user
    if ((task.project as any).user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.id;
    const updates = taskSchema.partial().parse(req.body);

    let task = await Task.findById(taskId).populate('project');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify that the project belongs to the user
    if ((task.project as any).user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Update task fields
    task = await Task.findByIdAndUpdate(taskId, { $set: updates }, { new: true });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId).populate('project');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify that the project belongs to the user
    if ((task.project as any).user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    await Task.findByIdAndDelete(taskId);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
};
