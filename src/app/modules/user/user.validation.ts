import { z } from 'zod';

const loginValidation = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

const createUserValidation = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Admin', 'Manager', 'Employee']),
});

const updateRoleValidation = z.object({
  role: z.enum(['Admin', 'Manager', 'Employee']),
});

export const UserValidations = {
  loginValidation,
  createUserValidation,
  updateRoleValidation,
};
