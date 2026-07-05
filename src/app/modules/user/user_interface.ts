import { Document } from 'mongoose';

export type TUserRole = 'Admin' | 'Manager' | 'Employee';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: TUserRole;
}

export interface ILoginUser {
  email: string;
  password: string;
}
