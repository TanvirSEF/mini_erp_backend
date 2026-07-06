import { z } from 'zod';
import { ALL_PERMISSIONS, WILDCARD_PERMISSION } from './role.permissions';

const updateRoleValidation = z.object({
  permissions: z
    .array(z.string())
    .min(1, 'At least one permission is required')
    .refine(
      (perms) =>
        perms.every((p) => ALL_PERMISSIONS.includes(p) || p === WILDCARD_PERMISSION),
      'One or more permissions are not recognised.'
    ),
});

export const RoleValidations = {
  updateRoleValidation,
};
