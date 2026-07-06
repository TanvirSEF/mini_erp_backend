import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { RoleServices } from './role.service';

const getAllRoles = catchAsync(async (req, res) => {
  // #swagger.tags = ['Roles']
  // #swagger.summary = 'List all roles and their permissions (DB-driven RBAC)'
  // #swagger.security = [{ bearerAuth: [] }]
  // #swagger.responses[200] = { description: 'OK' }
  const result = await RoleServices.getAllRoles();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Roles retrieved successfully!',
    data: result,
  });
});

const updateRole = catchAsync(async (req, res) => {
  // #swagger.tags = ['Roles']
  // #swagger.summary = "Update a role's permissions (Admin role is immutable)"
  // #swagger.security = [{ bearerAuth: [] }]
  /* #swagger.parameters['name'] = { in: 'path', type: 'string', required: true, example: 'Manager' } */
  /* #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: '#/components/schemas/RoleUpdateInput' }
          }
        }
      } */
  // #swagger.responses[200] = { description: 'Updated', schema: { $ref: '#/components/schemas/Role' } }
  // #swagger.responses[400] = { description: 'Admin cannot be modified', schema: { $ref: '#/components/schemas/ErrorResponse' } }
  // #swagger.responses[404] = { description: 'Role not found', schema: { $ref: '#/components/schemas/ErrorResponse' } }
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
