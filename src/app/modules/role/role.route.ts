import { Router } from 'express';
import { RoleControllers } from './role.controller';
import { RoleValidations } from './role.validation';
import { PERMISSIONS } from './role.permissions';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

const router = Router();

// Only accounts holding the role:manage permission (Admin by default)
// can view or reassign role permissions at runtime.
router.get('/', auth(PERMISSIONS.ROLE_MANAGE), RoleControllers.getAllRoles);

router.patch(
  '/:name',
  auth(PERMISSIONS.ROLE_MANAGE),
  validateRequest(RoleValidations.updateRoleValidation),
  RoleControllers.updateRole
);

export const RoleRoutes = router;
