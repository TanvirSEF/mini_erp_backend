import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import { User } from '../modules/user/user.model';

// Extend Express Request interface to include user payload context
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const auth = (...requiredRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError(401, 'You are not authorized to access this resource.');
    }

    // Verify token validity
    const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
    const { role, email } = decoded;

    // Verify if the user still exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(404, 'The user belonging to this token no longer exists.');
    }

    // Validate role permissions
    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(403, 'Forbidden: You do not have permission to perform this action.');
    }

    req.user = decoded;
    next();
  });
};

export default auth;
