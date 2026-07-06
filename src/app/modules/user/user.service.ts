import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { User } from './user.model';
import { ILoginUser, IUser } from './user_interface';

const createUserIntoDB = async (payload: IUser) => {
  const result = await User.create(payload);
  const userObj = result.toObject() as Partial<IUser>;
  delete userObj.password;
  return userObj;
};

const loginUser = async (payload: ILoginUser) => {
  // same message and 401 both times to avoid user enumeration
  const user = await User.findOne({ email: payload.email }).select('+password');
  if (!user) {
    throw new AppError(401, 'Incorrect email or password.');
  }

  const isPasswordMatched = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(401, 'Incorrect email or password.');
  }

  const accessToken = jwt.sign(
    { userId: user._id, role: user.role, email: user.email },
    config.jwt_access_secret as string,
    { expiresIn: config.jwt_access_expires_in as any }
  );

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

const getAllUsersFromDB = async () => {
  // password is select:false so it is never returned here
  return await User.find().sort({ createdAt: -1 });
};

const updateUserRoleIntoDB = async (id: string, role: string, currentUserId: string) => {
  if (String(currentUserId) === String(id)) {
    throw new AppError(400, 'You cannot change your own role.');
  }

  const user = await User.findById(id);
  if (!user) {
    throw new AppError(404, 'User not found.');
  }

  // never demote the last admin
  if (user.role === 'Admin' && role !== 'Admin') {
    const adminCount = await User.countDocuments({ role: 'Admin' });
    if (adminCount <= 1) {
      throw new AppError(400, 'Cannot demote the last admin account.');
    }
  }

  user.role = role as IUser['role'];
  await user.save();
  return user;
};

const deleteUserFromDB = async (id: string, currentUserId: string) => {
  if (String(currentUserId) === String(id)) {
    throw new AppError(400, 'You cannot delete your own account.');
  }

  const user = await User.findById(id);
  if (!user) {
    throw new AppError(404, 'User not found.');
  }

  // never delete the last admin
  if (user.role === 'Admin') {
    const adminCount = await User.countDocuments({ role: 'Admin' });
    if (adminCount <= 1) {
      throw new AppError(400, 'Cannot delete the last admin account.');
    }
  }

  await User.findByIdAndDelete(id);
  return user;
};

export const UserServices = {
  createUserIntoDB,
  loginUser,
  getAllUsersFromDB,
  updateUserRoleIntoDB,
  deleteUserFromDB,
};
