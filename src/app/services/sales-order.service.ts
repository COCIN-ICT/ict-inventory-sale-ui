import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {
  private base = environment.apiUrl || '';

  constructor(private http: HttpClient) {}

  getAll(params?: any): Observable<any> {
    // params optional for pagination/search
    return this.http.get<any>(`${this.base}/sales/order`, { params });
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/sales/order/${id}`);
  }

  create(payload: any): Observable<any> {
    return this.http.post<any>(`${this.base}/sales/order`, payload);
  }

  patch(id: number, payload: any): Observable<any> {
    return this.http.patch<any>(`${this.base}/sales/order/${id}`, payload);
  }
}