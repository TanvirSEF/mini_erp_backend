import { Document } from 'mongoose';

export interface IRole extends Document {
  name: string;
  permissions: string[];
  description: string;
  // seeded roles cannot be deleted only permissions edited
  isSystem: boolean;
}
