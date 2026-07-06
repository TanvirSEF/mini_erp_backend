import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';
import { IUser } from './user_interface';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['Admin', 'Manager', 'Employee'],
      default: 'Employee',
    },
  },
  { timestamps: true }
);

// hash only when password changed
userSchema.pre('save', async function () {
  const user = this as IUser;
  if (!user.isModified('password')) return;
  user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds));
});

export const User = model<IUser>('User', userSchema);
