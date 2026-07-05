import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { User } from './user.model';
import { ILoginUser, IUser } from './user_interface';

const registerUserIntoDB = async (payload: IUser) => {
  const result = await User.create(payload);
  const userObj = result.toObject() as Partial<IUser>;
  delete userObj.password;
  return userObj;
};

const loginUser = async (payload: ILoginUser) => {
  const user = await User.findOne({ email: payload.email }).select('+password');
  if (!user) {
    throw new AppError(404, 'User explicitly not found with this email.');
  }

  const isPasswordMatched = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(403, 'Password credentials do not match.');
  }

  const jwtPayload = {
    userId: user._id,
    role: user.role,
    email: user.email,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expires_in as any,
  });

  return {
    accessToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const UserServices = {
  registerUserIntoDB,
  loginUser,
};
