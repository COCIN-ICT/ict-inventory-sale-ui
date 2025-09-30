import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Department {
  id?: number;
  name: string;
  departmentHeadId?: number;
}
@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  private baseUrl = `${environment.apiUrl}/department`;

  constructor(private http: HttpClient) { }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.baseUrl)
  }

  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.baseUrl}/${id}`);
  }

  createDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>(this.baseUrl, department);
  }


  getAllUsers(): Observable<{id: number; firstName: string; lastName: string}[]> {
  return this.http.get<{id: number; firstName: string; lastName: string}[]>(`${environment.apiUrl}/user`);
  }

  updateDepartment(id: number, department: Department): Observable<Department> {
    return this.http.put<Department>(`${this.baseUrl}/${id}`, department);
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
