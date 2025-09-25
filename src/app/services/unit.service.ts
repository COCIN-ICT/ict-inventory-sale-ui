import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Department, Unit } from '../dashboard/pages/user-management/unit/unit.model';

const API_URL = `${environment.apiUrl}/unit`;

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  constructor(private http: HttpClient) {}

  
  getUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(API_URL);
  }

  
  getUnitById(id: number): Observable<Unit> {
    return this.http.get<Unit>(`${API_URL}/${id}`);
  }

  
  createUnit(unit: { name: string; description: string; address: string; unitHeadId?: number; departmentId: number }): Observable<Unit> {
    return this.http.post<Unit>(API_URL, unit);
  }

  
  updateUnit(id: number, unit: { name: string; description: string; address: string; unitHeadId?: number; departmentId: number }): Observable<Unit> {
    return this.http.put<Unit>(`${API_URL}/${id}`, unit);
  }

  changeUnitStatus(id: number, status: 'active' | 'deactivate'): Observable<Unit> {
    return this.http.patch<Unit>(`${API_URL}/change-status/${id}`, {status});
  }

  
  getUnitsByDepartment(id: number): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${API_URL}/department/${id}`);
  }

  searchUnitsByType(type: string): Observable<Unit[]> {
      return this.getUnits().pipe(
        map(units => units.filter(p => p.name.toLowerCase().includes(type.toLowerCase())))
      );
    }


getUnitHeads(): Observable<any[]> { // Adjust type based on API
  return this.http.get<any[]>(`${environment.apiUrl}/user?role=unitHead`); // Hypothetical endpoint
}
}