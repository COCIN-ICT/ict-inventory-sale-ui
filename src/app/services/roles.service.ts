import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Permission, Role } from '../dashboard/pages/user-roles/role.model';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient) { }

  createPermission(permission: Permission) {
    return this.http.post(`${environment.apiUrl}/permission`, permission);
  }

  getAllPermissions() {
    return this.http.get<Permission[]>(`${environment.apiUrl}/permission`);
  }

  createRole(role: Role) {
    return this.http.post<Role>(`${environment.apiUrl}/role`, role);
  }

  getRoles() {
    return this.http.get(environment.apiUrl + '/role');
  }
  
  deleteRole(roleId: number) {
    return this.http.delete(`${environment.apiUrl}/role/${roleId}`);
  }

  attachPermissionsToRole(roleId: number, permissionId: number[]) {
  return this.http.patch(`${environment.apiUrl}/role/attach/role/${roleId}/permission/${permissionId}`, {});
}


}
