import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation Failed',
      errors: err.errors.map((e) => ({
        path: e.path,
        message: e.message,
      })),
    });
  }

  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
};
