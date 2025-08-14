import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { Permission } from '../dashboard/pages/user-management/permissions/permission.model';


const API_URL = `${environment.apiUrl}/permission`;

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private http: HttpClient) { }

  getPermissions(): Observable<Permission[]> {
     return this.http.get<Permission[]>(API_URL);
   }

  getPermissionById(id: number): Observable<Permission> {
  return this.http.get<Permission>(`${API_URL}/${id}`);   
  }

  searchPermissionsByType(type: string): Observable<Permission[]> {
    return this.getPermissions().pipe(
      map(permissions => permissions.filter(p => p.permissionType.toLowerCase().includes(type.toLowerCase())))
    );
  }

 createPermission(permission: Permission): Observable<Permission> {
     return this.http.post<Permission>(API_URL, permission);
   }
 
  updatePermission(permission: Permission): Observable<Permission> {
    return this.http.put(`${API_URL}/${permission.id}`, permission) as Observable<Permission>;
  }

  deletePermission(permissionId: number) {
    return this.http.delete(`${API_URL}/${permissionId}`) ;
  }

   

  


}
