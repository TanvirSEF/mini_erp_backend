// permission strings for route guards format is resource action
export const PERMISSIONS = {
  PRODUCT_READ: 'product:read',
  PRODUCT_CREATE: 'product:create',
  PRODUCT_UPDATE: 'product:update',
  PRODUCT_DELETE: 'product:delete',

  SALE_CREATE: 'sale:create',
  SALE_READ: 'sale:read',

  DASHBOARD_READ: 'dashboard:read',

  ROLE_MANAGE: 'role:manage',
  USER_MANAGE: 'user:manage',
} as const;

// admin only grants every route
export const WILDCARD_PERMISSION = '*';

// used to validate role updates
export const ALL_PERMISSIONS: string[] = Object.values(PERMISSIONS);
