import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SalesItemRequest {
  itemId: number;
  salesOrderId?: number;
  quantity: number;
}

export interface CustomerRequest {
  name: string;
  phone: string;
  address: string;
  email?: string;
}

export interface SalesOrderRequest {
  items: SalesItemRequest[];
  customerId?: number;
  customerRequest?: CustomerRequest;
}

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {
  private base = environment.apiUrl || '';

  constructor(private http: HttpClient) {}

  getAll(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return this.http.get<any>(`${this.base}/sales/order`, { params: httpParams });
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/sales/order/${id}`);
  }

  getByCustomerId(customerId: number): Observable<any> {
    return this.http.get<any>(`${this.base}/sales/order/customer/${customerId}`);
  }

  getPendingByUnit(): Observable<any> {
    return this.http.get<any>(`${this.base}/sales/order/unit/pending`);
  }

  create(payload: SalesOrderRequest): Observable<any> {
    return this.http.post<any>(`${this.base}/sales/order`, payload);
  }

  finish(id: number): Observable<any> {
    return this.http.patch<any>(`${this.base}/sales/order/finish`, { id });
  }

  update(id: number, payload: Partial<SalesOrderRequest>): Observable<any> {
    return this.http.patch<any>(`${this.base}/sales/order/${id}`, payload);
  }

  // Alias for update() to maintain backward compatibility with old components
  patch(id: number, payload: any): Observable<any> {
    return this.update(id, payload);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/sales/order/${id}`);
  }
}