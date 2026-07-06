import express from 'express';
import { UserControllers } from './user.controller';
import { UserValidations } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/register',
  validateRequest(UserValidations.registerValidation),
  /* #swagger.tags = ['Auth'] */
  /* #swagger.summary = 'Register a new user' */
  /* #swagger.requestBody = {
        required: true,
        content: { "application/json": { schema: { $ref: '#/components/schemas/RegisterInput' } } }
      } */
  /* #swagger.responses[201] = { description: 'Created', schema: { $ref: '#/components/schemas/UserResponse' } } */
  /* #swagger.responses[400] = { description: 'Duplicate email / invalid role', schema: { $ref: '#/components/schemas/ErrorResponse' } } */
  UserControllers.registerUser
);

router.post(
  '/login',
  validateRequest(UserValidations.loginValidation),
  /* #swagger.tags = ['Auth'] */
  /* #swagger.summary = 'Log in and receive a JWT' */
  /* #swagger.requestBody = {
        required: true,
        content: { "application/json": { schema: { $ref: '#/components/schemas/LoginInput' } } }
      } */
  /* #swagger.responses[200] = { description: 'OK', schema: { $ref: '#/components/schemas/LoginResponse' } } */
  /* #swagger.responses[401] = { description: 'Invalid credentials', schema: { $ref: '#/components/schemas/ErrorResponse' } } */
  UserControllers.loginUser
);

export const UserRoutes = router;
