import express from 'express';
import { UserControllers } from './user.controller';
import { UserValidations } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/register',
  validateRequest(UserValidations.registerValidation),
  UserControllers.registerUser
);

router.post(
  '/login',
  validateRequest(UserValidations.loginValidation),
  UserControllers.loginUser
);

export const UserRoutes = router;
