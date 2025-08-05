import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../../services/permission.service';
import { Permission } from './permission.model';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.css'
})
export class PermissionsComponent implements OnInit {

  constructor(private permissionService: PermissionService) { }

  permissions: Permission[] = [];
  newPermission: Permission = { permissionType: '' };
  editing: boolean = false;
  editingId: number | null = null;

  loadPermissions() {
    this.permissionService.getPermissions().subscribe({
      next: (res: Permission[]) => (this.permissions = res || []),
      error: (error) => console.error('Error loading permissions:', error)
    })
  }

  ngOnInit(): void {
    this.loadPermissions();
  }

 createPermission() {
    if (!this.newPermission.permissionType.trim()) {
      alert('All fields are required.');
      return;
    }

    this.permissionService.createPermission(this.newPermission).subscribe({
      next: (created:any) => {
        this.permissions.unshift(created); // update list instantly
        this.newPermission = { permissionType: '' };
      },
      error: (err) => {
        console.error('Create failed:', err);
        alert('Failed to create permission');
      }
    });
  }

  startEdit(permission: Permission) {
  this.editing = true;
  this.editingId = permission.id ?? null;
  this.newPermission = { ...permission }; // shallow copy
}

cancelEdit() {
  this.editing = false;
  this.editingId = null;
  this.newPermission = { permissionType: '' };
}

updatePermission() {
  // Call update service
  if (this.editingId === null) return;
  this.permissionService.updatePermission( this.newPermission).subscribe(() => {
    const index = this.permissions.findIndex(p => p.id === this.editingId);
    if (index !== -1) {
      this.permissions[index] = { ...this.newPermission, id: this.editingId !== null ? this.editingId : undefined };
    }
    this.editing = false;
    this.editingId = null;
    this.newPermission = { permissionType: '' };
    alert('Permission updated successfully!');
   
    this.cancelEdit(); // reset form
  })
}

deletePermission(permissionId: number) {
  if (!confirm('Are you sure you want to delete this permission?')) return;

  this.permissionService.deletePermission(permissionId).subscribe(() => {
    this.loadPermissions(); // reload permissions after deletion
  });
}
}
