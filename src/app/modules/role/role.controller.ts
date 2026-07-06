import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RoleServices } from './role.service';

const getAllRoles = catchAsync(async (req, res) => {
  const result = await RoleServices.getAllRoles();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Roles retrieved successfully!',
    data: result,
  });
});

const updateRole = catchAsync(async (req, res) => {
  const result = await RoleServices.updateRolePermissions(
    req.params.name as string,
    req.body.permissions
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Role permissions updated successfully!',
    data: result,
  });
});

export const RoleControllers = {
  getAllRoles,
  updateRole,
};
