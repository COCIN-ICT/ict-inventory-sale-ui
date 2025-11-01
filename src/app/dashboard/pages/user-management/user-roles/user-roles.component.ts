import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../../../services/roles.service';
import { Role, Permission } from './role.model';
import { forkJoin } from 'rxjs';
import { ToastService } from '../../../../services/toast.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.css']
})
export class UserRolesComponent implements OnInit {
  roles: Role[] = [];
  // permissions: (Permission & { selected?: boolean })[] = []; // Add selected property
  permissions: Permission[] = [];
  newRole: Role = { id: 0, roleName: '', permissions: [] };
  roleCreated = false;

  editMode = false;
  currentRole: Role | null = null;
  selectedPermissionIds: number[] = [];

  isRoleModalOpen = false;
  editing = false;
  sModalOpen = false;

  successMessage: string | null = null;


  
  constructor(
    private rolesService: RolesService, 
    private toast: ToastService, 
    private router: Router,
    private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissions();
  }

  hasSelectedPermissions(): boolean {
    return this.permissions.some(p => p.selected);
  }

  createRole() {
  if (!this.newRole.roleName.trim() || !this.hasSelectedPermissions()) {
    this.toast.error('Role name and at least one permission are required');
    return;
  }

  const createPayload: Role = {
    id: 0,
    roleName: this.newRole.roleName,
    permissions: []
  };

  this.rolesService.createRole(createPayload).subscribe({
    next: (createdRole) => {
      const roleId = createdRole.id!;
      const selectedPermissions = this.permissions.filter(p => p.selected && p.id != null);
      const attachCalls = selectedPermissions.map(p =>
        this.rolesService.attachPermissionToRole(roleId, p.id!)
      );

      // Use forkJoin to wait for all attach calls to complete

      forkJoin(attachCalls).subscribe({
        next: () => {
          createdRole.permissions = selectedPermissions;
          this.roles.unshift(createdRole);
          this.toast.success('Role created successfully!');
          // this.successMessage = 'Role and all permissions attached successfully!';
         
          // ✅ Auto close modal and clear message after 2.5s
          setTimeout(() => {
             this.router.navigate(['/home/user-management/user-roles']);
            this.isRoleModalOpen = false;
            // this.successMessage = null;
          }, 1000);
        },
        error: err => {
          console.error('Error attaching permissions:', err);
          this.toast.error('Role created, but some permissions failed to attach.');
        }
      });
    },
    error: err => {
      console.error('Error creating role:', err);
      this.toast.error('Failed to create role.');
    }
  });
}


saveRole() {
  if (!this.newRole.roleName.trim()) {
    this.toast.error('Role name is required');
    return;
  }

  // Only enforce permission selection in create mode
  if (!this.editMode && !this.hasSelectedPermissions()) {
    this.toast.error('At least one permission must be selected');
    return;
  }

  if (this.editMode && this.currentRole) {
    this.updateRole();
  } else {
    this.createRole();
  }
}

updateRole() {
  // Keep selected or original permissions
  let selectedPermissions = this.permissions.filter(p => p.selected && p.id != null);

  // If none selected in the UI, assume user wants to keep old ones
  if (selectedPermissions.length === 0) {
    selectedPermissions = [...(this.currentRole?.permissions || [])];
  }

  const updatedRole: Role = {
    ...this.currentRole!,
    roleName: this.newRole.roleName,
    permissions: selectedPermissions // ✅ Always send current permissions
  };

  this.rolesService.updateRole(updatedRole.id!, updatedRole).subscribe({
    next: () => {
      const detachCalls = (this.currentRole?.permissions || [])
        .filter(p => !selectedPermissions.some(sp => sp.id === p.id))
        .map(p => this.rolesService.detachPermissionFromRole(updatedRole.id!, p.id!));

      const attachCalls = selectedPermissions
        .filter(p => !this.currentRole?.permissions.some(cp => cp.id === p.id))
        .map(p => this.rolesService.attachPermissionToRole(updatedRole.id!, p.id!));

      if (detachCalls.length === 0 && attachCalls.length === 0) {
        // No permission changes, just update UI
        const idx = this.roles.findIndex(r => r.id === updatedRole.id);
        if (idx > -1) {
          this.roles[idx] = { ...updatedRole };
        }
        this.isRoleModalOpen = false;
        this.successMessage = 'Role updated successfully!';
        setTimeout(() => this.successMessage = null, 3000);
        return;
      }

      forkJoin([...detachCalls, ...attachCalls]).subscribe({
        next: () => {
          const idx = this.roles.findIndex(r => r.id === updatedRole.id);
          if (idx > -1) {
            this.roles[idx] = { ...updatedRole };
          }
          this.isRoleModalOpen = false;
          this.successMessage = 'Role updated successfully!';
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: err => {
          console.error('Error updating role:', err);
          this.toast.error('Failed to update role.');
        }
      });
    }
  });
}


editRole(role: Role) {
  this.editMode = true;
  // Keep a copy of the original role
  this.currentRole = { ...role, permissions: role.permissions || [] };
  // This is the new role object that will be used in the form  
  this.newRole = { id: role.id!, roleName: role.roleName, permissions: [] };

  // Extract selected permission IDs from the current role
  this.selectedPermissionIds = this.currentRole.permissions.map(p => p.id!);
  this.permissions.forEach(p => p.selected = this.selectedPermissionIds.includes(p.id!));

  this.isRoleModalOpen = true;
}



  resetRoleForm() {
    this.newRole = { id: 0, roleName: '', permissions: [] };
    this.permissions.forEach(p => (p.selected = false));
    this.editMode = false;
    this.currentRole = null;
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
        this.roles.sort((a, b) => b.id - a.id);
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.roles = [];
      }
    });
  }

  getRolePermissions(role: Role): string {
    return role.permissions?.map(p => p.permissionType || (p as any).name || p).filter(Boolean).join(', ') || '—';
  }

  getRolePermissionsDisplay(role: any): string {
    return Array.isArray(role?.permissions) && role.permissions.length > 0
      ? role.permissions.map((p: Permission) => p?.permissionType || '').filter((perm: string) => perm).join(', ')
      : '—';
  }

  // editRole(role: Role) {
  //   this.editMode = true;
  //   this.currentRole = { ...role };
  //   this.selectedPermissionIds = role.permissions.map(p => p.id!);
  //   this.newRole = { ...role, permissions: [] };
  //   this.permissions.forEach(p => p.selected = this.selectedPermissionIds.includes(p.id!));
  //   this.isRoleModalOpen = true;
  // }

  // deleteRole(roleId: number): void {
  //   if( !confirm('Are you sure you want to delete this role?')) return;

  //   this.rolesService.deleteRole(roleId).subscribe({
  //     next: () => {
  //       this.roles = this.roles.filter(r => r.id !== roleId);
  //       this.successMessage = 'Role deleted successfully!';
  //       setTimeout(() => {
  //         this.successMessage = null;
  //       }, 3000);
  //     },
  //     error: (err) => {
  //       console.error('Delete failed:', err);
  //       this.toast.error('Failed to delete role');
  //     }
  // });
  // }
    deleteRole(roleId: Role): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete role', message: 'Are you sure you want to delete this role?' }
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

    //Detach all permissions first from the role
    const detachCalls = (roleId.permissions || []).map(p =>
      this.rolesService.detachPermissionFromRole(roleId.id!, p.id!)
    );

    // Use forkJoin to wait for all detach calls to complete

    forkJoin(detachCalls).subscribe({
      next: () => {
        // Now delete the role
        this.rolesService.deleteRole(roleId.id!).subscribe({
          next: () => {
            this.roles = this.roles.filter(r => r.id !== roleId.id);
            this.successMessage = 'Role deleted successfully!';
            setTimeout(() => {
              this.successMessage = null;
            }, 3000);
          },
          error: (err) => {
            console.error('Delete failed:', err);
            this.toast.error('Failed to delete role');
          }
        });
      }
    })
  });
    }
  }