import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface UnitOfMeasure {
  id?: number;
  code?: string;
  description?: string;
}

export interface UnitOfMeasureRequest {
  code: string;
  description: string;
}

export interface UnitOfMeasureResponse {
  id?: number;
  code?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UnitOfMeasureService {

  constructor(private http: HttpClient) { }

  getAllUnitOfMeasures() {
    return this.http.get<UnitOfMeasureResponse[]>(`${environment.apiUrl}/unit-of-measure`);
  }

  getUnitOfMeasureById(id: number) {
    return this.http.get<UnitOfMeasureResponse>(`${environment.apiUrl}/unit-of-measure/${id}`);
  }

  createUnitOfMeasure(unitOfMeasure: UnitOfMeasureRequest) {
    return this.http.post<UnitOfMeasureResponse>(`${environment.apiUrl}/unit-of-measure`, unitOfMeasure);
  }

  updateUnitOfMeasure(id: number, unitOfMeasure: UnitOfMeasureRequest) {
    return this.http.put<UnitOfMeasureResponse>(`${environment.apiUrl}/unit-of-measure/${id}`, unitOfMeasure);
  }

  deleteUnitOfMeasure(id: number) {
    return this.http.delete(`${environment.apiUrl}/unit-of-measure/${id}`);
  }
} 