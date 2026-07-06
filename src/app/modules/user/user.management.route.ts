import { Router } from 'express';
import { UserControllers } from './user.controller';
import { UserValidations } from './user.validation';
import { PERMISSIONS } from '../role/role.permissions';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

// admin user management mounted at /users
const userRouter = Router();

userRouter.post(
  '/',
  auth(PERMISSIONS.USER_MANAGE),
  validateRequest(UserValidations.createUserValidation),
  /* #swagger.tags = ['Users'] */
  /* #swagger.summary = 'Create a new user (admin)' */
  /* #swagger.security = [{ bearerAuth: [] }] */
  /* #swagger.requestBody = {
        required: true,
        content: { "application/json": { schema: { $ref: '#/components/schemas/UserInput' } } }
      } */
  /* #swagger.responses[201] = { description: 'Created', schema: { $ref: '#/components/schemas/UserResponse' } } */
  /* #swagger.responses[400] = { description: 'Duplicate email / invalid input', schema: { $ref: '#/components/schemas/ErrorResponse' } } */
  UserControllers.createUser
);

userRouter.get(
  '/',
  auth(PERMISSIONS.USER_MANAGE),
  /* #swagger.tags = ['Users'] */
  /* #swagger.summary = 'List all users (admin)' */
  /* #swagger.security = [{ bearerAuth: [] }] */
  /* #swagger.responses[200] = { description: 'OK' } */
  UserControllers.getAllUsers
);

userRouter.patch(
  '/:id/role',
  auth(PERMISSIONS.USER_MANAGE),
  validateRequest(UserValidations.updateRoleValidation),
  /* #swagger.tags = ['Users'] */
  /* #swagger.summary = "Change a user's role (admin)" */
  /* #swagger.security = [{ bearerAuth: [] }] */
  /* #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' } */
  /* #swagger.requestBody = {
        required: true,
        content: { "application/json": { schema: { $ref: '#/components/schemas/UserRoleInput' } } }
      } */
  /* #swagger.responses[200] = { description: 'Updated', schema: { $ref: '#/components/schemas/UserResponse' } } */
  /* #swagger.responses[400] = { description: 'Cannot change own role / last admin', schema: { $ref: '#/components/schemas/ErrorResponse' } } */
  UserControllers.updateUserRole
);

userRouter.delete(
  '/:id',
  auth(PERMISSIONS.USER_MANAGE),
  /* #swagger.tags = ['Users'] */
  /* #swagger.summary = 'Delete a user (admin)' */
  /* #swagger.security = [{ bearerAuth: [] }] */
  /* #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' } */
  /* #swagger.responses[200] = { description: 'Deleted', schema: { $ref: '#/components/schemas/UserResponse' } } */
  /* #swagger.responses[400] = { description: 'Cannot delete self / last admin', schema: { $ref: '#/components/schemas/ErrorResponse' } } */
  /* #swagger.responses[404] = { description: 'Not found', schema: { $ref: '#/components/schemas/ErrorResponse' } } */
  UserControllers.deleteUser
);

export const UserManagementRoutes = userRouter;
