import { Role } from './role.model';
import { PERMISSIONS, WILDCARD_PERMISSION } from './role.permissions';

// never overwrites a role an admin has edited
const defaultRoles = [
  {
    name: 'Admin',
    isSystem: true,
    description: 'Super user with unrestricted access to every module.',
    permissions: [WILDCARD_PERMISSION],
  },
  {
    name: 'Manager',
    isSystem: true,
    description: 'Manages products, records sales and views the dashboard.',
    permissions: [
      PERMISSIONS.PRODUCT_READ,
      PERMISSIONS.PRODUCT_CREATE,
      PERMISSIONS.PRODUCT_UPDATE,
      PERMISSIONS.PRODUCT_DELETE,
      PERMISSIONS.SALE_CREATE,
      PERMISSIONS.SALE_READ,
      PERMISSIONS.DASHBOARD_READ,
    ],
  },
  {
    name: 'Employee',
    isSystem: true,
    description: 'Views products and records sales.',
    permissions: [PERMISSIONS.PRODUCT_READ, PERMISSIONS.SALE_CREATE],
  },
];

// only inserts missing roles
export const seedRoles = async (): Promise<void> => {
  for (const role of defaultRoles) {
    await Role.updateOne({ name: role.name }, { $setOnInsert: role }, { upsert: true });
  }
};
