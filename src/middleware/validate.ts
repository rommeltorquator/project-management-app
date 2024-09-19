import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema<any>): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate the request body
      req.body = schema.parse(req.body);
      next(); // Proceed to the next middleware or route handler
    } catch (err) {
      next(err); // Pass the error to the error handling middleware
    }
  };
};
