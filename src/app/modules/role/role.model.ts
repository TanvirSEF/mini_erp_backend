import { Schema, model } from 'mongoose';
import { IRole } from './role_interface';

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      // Keep the role names in sync with the User model enum
      enum: ['Admin', 'Manager', 'Employee'],
    },
    permissions: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: '',
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Role = model<IRole>('Role', roleSchema);
