import type { NextFunction, Request, Response } from 'express';
import AppError from '../errors/AppError';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const hits = new Map<string, { count: number; resetAt: number }>();

export const loginRateLimit = (req: Request, _res: Response, next: NextFunction) => {
  const key = req.ip ?? 'unknown';
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }

  entry.count += 1;
  if (entry.count > MAX_ATTEMPTS) {
    return next(new AppError(429, 'Too many login attempts. Please try again later.'));
  }

  next();
};
