import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../../../services/permission.service';
import { Permission } from './permission.model';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit {
  permissions: Permission[] = [];
  newPermission: Permission = { permissionType: '' };
  isEditing = false;
  editingId: number | null = null;
  isModalOpen = false;
  searchTerm = '';


  constructor(private permissionService: PermissionService,
              private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadPermissions();
  }

  /** Load all permissions from backend */
 private loadPermissions(): void {
    this.permissionService.getPermissions().subscribe({
      next: (permission) => {
        this.permissions = permission;
      },
      error: (err) => {
        console.error('Error loading permissions:', err);
        this.toast.error('Failed to load permissions');
      }
    }
    );
  }

  /** Search permission by ID */
searchPermissions(): void{
 if (!this.searchTerm.trim()) {
  this.loadPermissions(); return; }
  this.permissionService.searchPermissionsByType(this.searchTerm).subscribe({
    next: (permissions) => {
      this.permissions = permissions ?? [];
    },
    error: (err) => {
      console.error('Error searching permissions:', err);
      this.toast.error('Failed to search permissions');
    }
  });
}

// clearSearch(): void {
//   this.searchTerm = '';
// }

  /** Open modal for create or edit */
 openModal(permission?: Permission): void {
    this.isModalOpen = true;
    this.isEditing = !!permission;
    this.editingId = permission?.id ?? null;
    this.newPermission = permission ? { ...permission } : { permissionType: '' };
  }


  /** Close modal and reset form */
  closeModal(): void {
    this.isModalOpen = false;
    this.isEditing = false;
    this.editingId = null;
    this.newPermission = { permissionType: '' };
  }

  /** Prepare modal for editing */
  startEdit(permission: Permission): void {
    this.openModal( permission);
  }

  cancelEdit(): void {
    this.closeModal();
  }

  /** Create new permission */
  createPermission(): void {
    if (!this.newPermission.permissionType.trim()) {
      this.toast.error('Permission Type is required.');
      return;
    }

    this.permissionService.createPermission(this.newPermission).subscribe({
      next: (created) => {
        this.permissions.unshift(created);
        this.toast.success('Permission created successfully!');
        this.closeModal();
      },
      error: err => {
        console.error('Create failed:', err);
        this.toast.error('Failed to create permission');
      }
   });
  }

  /** Update existing permission */
  updatePermission(): void {
    if (this.editingId === null || !this.newPermission.permissionType.trim()) {
      this.toast.error('Permission Type is required.');
      return;
    }

    const updatedPermission: Permission = {...this.newPermission, id: this.editingId };
    this.permissionService.updatePermission(updatedPermission).subscribe({
      next:() => {
        const index = this.permissions.findIndex(p => p.id === this.editingId);
        if (index !== -1) {
          this.permissions[index] = updatedPermission;
        }
        this.toast.success('Permission updated successfully!');
        this.closeModal();
      },
      error: err => {
        console.error('Update failed:', err);
        this.toast.error('Failed to update permission');
      }
    });
  }

  /** Delete permission with confirmation */
  deletePermission(permissionId: number): void {
    if (!window.confirm('Are you sure you want to delete this permission?')) return;

    this.permissionService.deletePermission(permissionId).subscribe({
      next: () => {
        this.permissions = this.permissions.filter(p => p.id !== permissionId);
        this.toast.success('Permission deleted successfully!');

      },
      error: err => {
        console.error('Delete failed:', err);
        this.toast.error('Failed to delete permission');
      }
    });
  }
}
