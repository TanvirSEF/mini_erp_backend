import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const registerUser = catchAsync(async (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Register a new user'
  /* #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: '#/components/schemas/RegisterInput' }
      }
    }
  } */
  // #swagger.responses[201] = { description: 'Created', schema: { $ref: '#/components/schemas/UserResponse' } }
  // #swagger.responses[400] = { description: 'Duplicate email / invalid role', schema: { $ref: '#/components/schemas/ErrorResponse' } }
  const result = await UserServices.registerUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully!',
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Log in and receive a JWT'
  /* #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: '#/components/schemas/LoginInput' }
      }
    }
  } */
  // #swagger.responses[200] = { description: 'OK', schema: { $ref: '#/components/schemas/LoginResponse' } }
  // #swagger.responses[401] = { description: 'Invalid credentials', schema: { $ref: '#/components/schemas/ErrorResponse' } }
  const result = await UserServices.loginUser(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User authenticated successfully!',
    data: result,
  });
});

export const UserControllers = {
  registerUser,
  loginUser,
};
