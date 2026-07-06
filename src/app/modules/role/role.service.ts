import { Role } from './role.model';
import AppError from '../../errors/AppError';

const getAllRoles = async () => {
  return await Role.find().sort({ name: 1 });
};

const updateRolePermissions = async (name: string, permissions: string[]) => {
  const role = await Role.findOne({ name });
  if (!role) {
    throw new AppError(404, `Role "${name}" does not exist.`);
  }

  // admin permissions cannot be changed
  if (role.name === 'Admin') {
    throw new AppError(400, 'The Admin role permissions cannot be modified.');
  }

  role.permissions = permissions;
  await role.save();
  return role;
};

export const RoleServices = {
  getAllRoles,
  updateRolePermissions,
};
