import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import { User } from '../modules/user/user.model';
import { Role } from '../modules/role/role.model';
import { WILDCARD_PERMISSION } from '../modules/role/role.permissions';

export type TAuthUser = JwtPayload & {
  role: string;
  email: string;
  permissions: string[];
};

declare global {
  namespace Express {
    interface Request {
      user?: TAuthUser;
    }
  }
}

// database driven role based access control
const auth = (...requiredPermissions: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

    if (!token) {
      throw new AppError(401, 'Authentication required. Please log in.');
    }

    // bad or expired token returns 401 not 500
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
    } catch {
      throw new AppError(401, 'Invalid or expired access token.');
    }

    // reject tokens of deleted users
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      throw new AppError(401, 'The account belonging to this token no longer exists.');
    }

    // load permissions from db
    const role = await Role.findOne({ name: user.role });
    if (!role) {
      throw new AppError(403, 'Your account role is not configured. Contact an administrator.');
    }

    const permissions = role.permissions || [];
    req.user = {
      userId: decoded.userId,
      email: user.email,
      role: user.role,
      permissions,
    } as TAuthUser;

    // any logged in user passes when no permission is required
    if (requiredPermissions.length === 0) {
      return next();
    }

    // admin wildcard passes every check
    const allowed =
      permissions.includes(WILDCARD_PERMISSION) ||
      requiredPermissions.some((perm) => permissions.includes(perm));

    if (!allowed) {
      throw new AppError(403, 'Forbidden: you do not have permission to perform this action.');
    }

    next();
  });
};

export default auth;
