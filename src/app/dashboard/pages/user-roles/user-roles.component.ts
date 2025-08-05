import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../../services/roles.service';
import { Role, Permission } from './role.model';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.css']
})
export class UserRolesComponent implements OnInit {
  roles: Role[] = [];
  permissions: (Permission & { selected?: boolean })[] = [];
  newRole: Role = { id: 0, roleName: '', permissions: [] };
  roleCreated = false;

  constructor(private rolesService: RolesService) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissions();
  }

  hasSelectedPermissions(): boolean {
    return this.permissions.some(p => p.selected);
  }

createRole() {
  if (!this.newRole.roleName.trim() || !this.hasSelectedPermissions()) {
    alert('Role name and at least one permission are required');
    return;
  }
console.log('Payload being sent:', { id: 0, roleName: this.newRole.roleName, permissions: [] });
  // Step 1: Create Role
  this.rolesService.createRole({ id: 0, roleName: this.newRole.roleName, permissions: [] }).subscribe({
    next: (res: Role) => {
      const roleId = res.id;
      const selectedPermissionIds: number[] = this.permissions
  .filter(p => p.selected && p.id !== undefined)
  .map(p => p.id as number);

  console.log('Selected permission IDs:', selectedPermissionIds);

      // Step 2: Attach Permissions
      this.rolesService.attachPermissionsToRole(roleId, selectedPermissionIds).subscribe({
        next: () => {
          alert('Role and permissions attached!');
          this.loadRoles(); // Refresh roles to see permissions
          this.resetRoleForm();
          this.roleCreated = true;
        },
        error: err => {
          console.error('Permission attach failed:', err);
          alert('Role created but permission attach failed.');
        }
      });
    },
    error: err => {
      console.error('Error creating role:', err);
      alert('Failed to create role.');
    }
  });
}


  resetRoleForm() {
    this.newRole = { id: 0, roleName: '', permissions: [] };
    this.permissions.forEach(p => (p.selected = false));
  }

  loadPermissions() {
    this.rolesService.getAllPermissions().subscribe({
      next: (res: Permission[]) => {
        this.permissions = (res || []).map(p => ({ ...p, selected: false }));
      },
      error: (error) => console.error('Error loading permissions:', error)
    });
  }

  loadRoles() {
  this.rolesService.getRoles().subscribe({
    next: (res: any) => {
      this.roles = res.data || res.roles || res.result || res || [];

      // ✅ Add this for debugging
      console.log('Loaded roles:', this.roles);
      this.roles.forEach((r, i) => {
        console.log(`Role ${i}:`, r.roleName, 'Permissions:', r.permissions);
      });
    },
    error: (error) => {
      console.error('Error loading roles:', error);
      this.roles = [];
    }
  });
}


  getRolePermissions(role: Role): string {
    if (!role.permissions) return '—';
    return role.permissions
      .map(p => p.permissionType || (p as any).name || p)
      .filter(Boolean)
      .join(', ') || '—';
  }

   getRolePermissionsDisplay(role: any): string {
    if (Array.isArray(role?.permissions) && role.permissions.length > 0) {
      return role.permissions
        .map((p: any) => p?.permissionType || '')
        .filter((perm: string) => perm)
        .join(', ');
    }
    return '—';
  }
}
