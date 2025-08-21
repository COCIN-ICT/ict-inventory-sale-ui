import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Role, Permission } from '../dashboard/pages/user-management/user-roles/role.model';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

const API_URL = `${environment.apiUrl}/role`;


@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient) { }

  // createPermission(permission: Permission) {
  //   return this.http.post(`${environment.apiUrl}/permission`, permission);
  // }

  getAllPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${environment.apiUrl}/permission`);
  }

  createRole(role: Role): Observable<Role> {
    return this.http.post<Role>(API_URL, role);
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(API_URL);
  }

  updateRole( id: number, role: Role): Observable<Role> {
    return this.http.put<Role>(`${API_URL}/${id}`, role);
  }
  
  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }

//   attachPermissionsToRole(roleId: number, permissionId: number[]) {
//   return this.http.patch(`${environment.apiUrl}/role/attach/role/${roleId}/permission/${permissionId}`, {});
// }

// Replace your bulk method with a singular one:
attachPermissionToRole(id: number, permissionId: number): Observable<void> {
  return this.http.patch<void>(`${API_URL}/attach/role/${id}/permission/${permissionId}`,{});   
}

detachPermissionFromRole(roleId: number, permissionId: number): Observable<void> {
  return this.http.patch<void>(`${API_URL}/detach/role/${roleId}/permission/${permissionId}`, {});
}


}
