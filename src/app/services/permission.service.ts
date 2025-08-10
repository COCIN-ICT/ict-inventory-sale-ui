import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Permission } from '../dashboard/pages/permissions/permission.model';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private http: HttpClient) { }

 createPermission(permission: Permission): Observable<Permission> {
     return this.http.post<Permission>(`${environment.apiUrl}/permission`, permission);
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

    getPermissionById(id: string) {
  return this.http.get<Permission>(`${environment.apiUrl}/permission/${id}`);   
  }

  


}
