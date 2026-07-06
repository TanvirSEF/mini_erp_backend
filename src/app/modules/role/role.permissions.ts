// Central catalogue of permission strings used by the route guards.
// Format is resource:action so they read clearly, e.g. auth('product:create').
// Keep this list in sync with the seeded roles below.
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

// The wildcard permission grants access to every route. Reserved for Admin
// so a single super-user can never be locked out by a misconfiguration.
export const WILDCARD_PERMISSION = '*';

// Every permission the system knows about. Used to validate payloads sent
// to the role-management API so unknown strings cannot sneak in.
export const ALL_PERMISSIONS: string[] = Object.values(PERMISSIONS);
