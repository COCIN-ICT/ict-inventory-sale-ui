import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../../services/permission.service';
import { Permission } from './permission.model';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit {
  permissions: Permission[] = [];
  newPermission: Permission = { permissionType: '' };
  editing = false;
  editingId: number | null = null;

  isPermissionModalOpen = false;
  successMessage: string | null = null;

  constructor(private permissionService: PermissionService) {}

  ngOnInit(): void {
    this.loadPermissions();
  }

  /** Load all permissions from backend */
  loadPermissions(): void {
    this.permissionService.getPermissions().subscribe(
      res => this.permissions = res || [],
      err => console.error('Error loading permissions:', err)
    );
  }

  /** Open modal for create or edit */
  openPermissionModal(edit = false, permission?: Permission): void {
    this.editing = edit;
    this.isPermissionModalOpen = true;

    if (edit && permission) {
      this.editingId = permission.id ?? null;
      this.newPermission = { ...permission };
    } else {
      this.editingId = null;
      this.newPermission = { permissionType: '' };
    }
  }

  /** Close modal and reset form */
  closePermissionModal(): void {
    this.isPermissionModalOpen = false;
    this.editing = false;
    this.editingId = null;
    this.newPermission = { permissionType: '' };
  }

  /** Prepare modal for editing */
  startEdit(permission: Permission): void {
    this.openPermissionModal(true, permission);
  }

  cancelEdit(): void {
    this.closePermissionModal();
  }

  /** Display success alert for 3 seconds */
  showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => this.successMessage = null, 3000);
  }

  /** Create new permission */
  createPermission(): void {
    if (!this.newPermission.permissionType.trim()) {
      alert('Permission Type is required.');
      return;
    }

    this.permissionService.createPermission(this.newPermission).subscribe(
      created => {
        this.permissions.unshift(created);
        this.showSuccess('✅ Permission created successfully!');
        this.closePermissionModal();
      },
      err => {
        console.error('Create failed:', err);
        alert('Failed to create permission');
      }
    );
  }

  /** Update existing permission */
  updatePermission(): void {
    if (this.editingId === null) return;

    this.permissionService.updatePermission(this.newPermission).subscribe(
      () => {
        const idx = this.permissions.findIndex(p => p.id === this.editingId);
        if (idx !== -1) {
          this.permissions[idx] = { ...this.newPermission, id: this.editingId! };
        }
        this.showSuccess('✏️ Permission updated successfully!');
        this.closePermissionModal();
      },
      err => {
        console.error('Update failed:', err);
        alert('Failed to update permission');
      }
    );
  }

  /** Delete permission with confirmation */
  deletePermission(permissionId: number): void {
    if (!window.confirm('⚠️ Are you sure you want to delete this permission?')) return;

    this.permissionService.deletePermission(permissionId).subscribe({
      next: () => {
        this.permissions = this.permissions.filter(p => p.id !== permissionId);
        this.showSuccess('🗑️ Permission deleted successfully!');
      },
      error: err => {
        console.error('Delete failed:', err);
        alert('Failed to delete permission');
      }
    });
  }
}
