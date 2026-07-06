// Permission catalogue for the route guards. Format: resource:action, e.g. auth('product:create').
export const PERMISSIONS = {
  PRODUCT_READ: 'product:read',
  PRODUCT_CREATE: 'product:create',
  PRODUCT_UPDATE: 'product:update',
  PRODUCT_DELETE: 'product:delete',

  SALE_CREATE: 'sale:create',
  SALE_READ: 'sale:read',

  DASHBOARD_READ: 'dashboard:read',

  ROLE_MANAGE: 'role:manage',
} as const;

// Reserved for Admin — grants every route so the system can't be locked out
export const WILDCARD_PERMISSION = '*';

// Used to validate role-management payloads (rejects unknown strings)
export const ALL_PERMISSIONS: string[] = Object.values(PERMISSIONS);
