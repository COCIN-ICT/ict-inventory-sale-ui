/**
 * Mock Auth Data
 * ──────────────
 * Provides mock users and a simulated reset-token store so that every
 * auth flow (login, forgot-password, reset-password) works without
 * a real backend.
 */

export interface MockUser {
  id: number;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: { roleName: string; permissions: { permissionType: string }[] }[];
  unit: string;
  phone: string;
  department: string;
}

/** Pre-seeded users – use these credentials in the UI */
export const MOCK_USERS: MockUser[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@cocin.org',
    password: 'password123',
    firstName: 'Admin',
    lastName: 'User',
    roles: [
      {
        roleName: 'SUPER_ADMIN',
        permissions: [
          { permissionType: 'BUDGET_READ' },
          { permissionType: 'USER_MANAGE' },
          { permissionType: 'STORE_MANAGE' }
        ]
      }
    ],
    unit: 'HQ',
    phone: '08000000001',
    department: 'Management'
  },
  {
    id: 2,
    username: 'jethro',
    email: 'jethro@cocin.org',
    password: 'jethro123',
    firstName: 'Jethro',
    lastName: 'Dang',
    roles: [
      {
        roleName: 'STORE_KEEPER',
        permissions: [
          { permissionType: 'STORE_MANAGE' }
        ]
      }
    ],
    unit: 'Store A',
    phone: '08000000002',
    department: 'Logistics'
  }
];

/**
 * In-memory map that tracks password-reset tokens.
 * Key   = token string (UUID-like)
 * Value = email of the user who requested the reset
 */
export const RESET_TOKENS: Map<string, string> = new Map();
