import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Permission } from '../dashboard/pages/permissions/permission.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private http: HttpClient) { }

 createPermission(permission: Permission) {
     return this.http.post(`${environment.apiUrl}/permission`, permission);
   }
 
   getPermissions() {
     return this.http.get<Permission[]>(`${environment.apiUrl}/permission`);
   }

    updatePermission(permission: Permission) {
      return this.http.put(`${environment.apiUrl}/permission/${permission.id}`, permission);
    }

    deletePermission(permissionId: number) {
      return this.http.delete(`${environment.apiUrl}/permission/${permissionId}`);
    }

}
