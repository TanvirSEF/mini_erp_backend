import { User } from './user.model';
import config from '../../config';

export const seedAdmin = async (): Promise<void> => {
  const adminExists = await User.findOne({ role: 'Admin' });
  if (adminExists) return;

  await User.create({
    name: 'System Admin',
    email: config.admin_email,
    password: config.admin_password,
    role: 'Admin',
  });
  console.log(`Default Admin user created successfully: ${config.admin_email}`);
};
