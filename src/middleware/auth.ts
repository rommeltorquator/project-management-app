import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const auth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');

  // Check if Authorization header exists and is in Bearer token format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  try {
    // Verify token and attach decoded user information to req.user
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { user: { id: string } };
    req.user = decoded.user;

    next(); // Proceed to the next middleware
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
