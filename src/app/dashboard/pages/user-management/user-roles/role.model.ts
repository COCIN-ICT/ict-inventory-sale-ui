export interface Permission {
  id?: number;
  permissionType?: string;
  selected?: boolean;
}

export interface NewPermission {
  roleId: number;
  permissionType: string;
}

export interface Role {
  id: number;
  roleName: string;
  permissions: Permission[];
}
