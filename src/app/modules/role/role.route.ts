import { Router } from 'express';
import { RoleControllers } from './role.controller';
import { RoleValidations } from './role.validation';
import { PERMISSIONS } from './role.permissions';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

const router = Router();

router.get(
  '/',
  auth(PERMISSIONS.ROLE_MANAGE),
  /* #swagger.tags = ['Roles'] */
  /* #swagger.summary = 'List all roles and their permissions (DB-driven RBAC)' */
  /* #swagger.security = [{ bearerAuth: [] }] */
  /* #swagger.responses[200] = { description: 'OK' } */
  RoleControllers.getAllRoles
);

router.patch(
  '/:name',
  auth(PERMISSIONS.ROLE_MANAGE),
  validateRequest(RoleValidations.updateRoleValidation),
  /* #swagger.tags = ['Roles'] */
  /* #swagger.summary = "Update a role's permissions (Admin role is immutable)" */
  /* #swagger.security = [{ bearerAuth: [] }] */
  /* #swagger.parameters['name'] = { in: 'path', required: true, type: 'string', example: 'Manager' } */
  /* #swagger.requestBody = {
        required: true,
        content: { "application/json": { schema: { $ref: '#/components/schemas/RoleUpdateInput' } } }
      } */
  /* #swagger.responses[200] = { description: 'Updated', schema: { $ref: '#/components/schemas/Role' } } */
  /* #swagger.responses[400] = { description: 'Admin cannot be modified', schema: { $ref: '#/components/schemas/ErrorResponse' } } */
  /* #swagger.responses[404] = { description: 'Role not found', schema: { $ref: '#/components/schemas/ErrorResponse' } } */
  RoleControllers.updateRole
);

export const RoleRoutes = router;
