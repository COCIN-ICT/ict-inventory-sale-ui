export interface Permission {
  id: number;
  permissionType: string;
}

export interface Role {
  id: number;
  roleName: string; // Note: The JSON uses "roleName"
  permissions: Permission[];
}

export interface Department {
  id: number;
  name: string;
  departmentHeadFirstName: string;
  departmentHeadLastName: string;
  departmentHeadId: number;
}

export interface Unit {
  id: number;
  name: string;
  description: string;
  address: string;
  active: boolean;
  unitHead: string;
  department: Department;
}

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  middleName: string;
  username: string;
  password?: string; // Make password optional
 
  address: string;
  phone: string;
  email: string;
  enabled: boolean;
  accountExpired: boolean;
  credentialsExpired: boolean;
  accountLocked: boolean;
  roles: Role[]; // Correctly defined as an array of Role objects
  unit: Unit; // Correctly defined as a single Unit object
}

// Ensure this interface is exported
export interface UserDisplay extends User {
  resolvedRoleNames?: string;
  resolvedUnitName?: string;
}