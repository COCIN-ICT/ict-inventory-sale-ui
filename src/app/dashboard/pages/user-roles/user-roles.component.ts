import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrl: './user-roles.component.css'
})
export class UserRolesComponent {
  constructor(private userService: UserService) {}
  roles: any[] = [];

  ngOnInit(): void {
    this.loadRoles();
  }
  loadRoles() {
    // Assumming UserService is injected in the constructor
    this.userService.getRoles()
      .subscribe({
        next: (res: any) => {
          console.log('API response:', res);
          // Try different response structures
          this.roles = res.data || res.roles || res.result || res || [];
          console.log('Final roles:', this.roles);
        },
        error: (error) => {
          console.error('Error:', error);
          this.roles = []; // Set empty array on error
        }
      })
  }

  getRolePermissions(role: any): string {
    return role.permissions?.map((p: { permissionType: string }) => p.permissionType).join(', ') || '—';
  }

}

