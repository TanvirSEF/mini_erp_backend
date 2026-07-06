import { Document } from 'mongoose';

export interface IRole extends Document {
  name: string;
  permissions: string[];
  description: string;
  // System roles are seeded automatically. They cannot be deleted,
  // only their permission set can be edited at runtime.
  isSystem: boolean;
}
