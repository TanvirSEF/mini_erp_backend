import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const createUser = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User created successfully!',
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await UserServices.loginUser(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User authenticated successfully!',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users retrieved successfully!',
    data: result,
  });
});

const updateUserRole = catchAsync(async (req, res) => {
  const result = await UserServices.updateUserRoleIntoDB(
    req.params.id as string,
    req.body.role,
    req.user!.userId
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User role updated successfully!',
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const result = await UserServices.deleteUserFromDB(req.params.id as string, req.user!.userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User deleted successfully!',
    data: result,
  });
});

export const UserControllers = {
  createUser,
  loginUser,
  getAllUsers,
  updateUserRole,
  deleteUser,
};
