import { z } from 'zod';

const loginValidation = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

const registerValidation = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['Admin', 'Manager', 'Employee']).optional(),
});

export const UserValidations = {
  loginValidation,
  registerValidation,
};
