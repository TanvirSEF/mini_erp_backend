import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import AppError from '../errors/AppError';

const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errorMessage = result.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      throw new AppError(400, errorMessage);
    }
    req.body = result.data;
    next();
  };
};

export default validateRequest;
