import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OtherIncomeRequest {
  budgetLineItemId: number;
  amount: number;
  source: string;
  reference: string;
  paymentMethod: 'CASH' | 'TRANSFER' | 'POS';
  accountId?: number;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OtherIncomeService {
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
    return this.http.get<any>(`${this.base}/other-income`, { params: httpParams });
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/other-income/${id}`);
  }

  getPending(): Observable<any> {
    return this.http.get<any>(`${this.base}/other-income/pending`);
  }

  create(payload: OtherIncomeRequest): Observable<any> {
    return this.http.post<any>(`${this.base}/other-income`, payload);
  }

  update(id: number, payload: Partial<OtherIncomeRequest>): Observable<any> {
    return this.http.put<any>(`${this.base}/other-income/${id}`, payload);
  }

  approve(id: number): Observable<any> {
    return this.http.patch<any>(`${this.base}/other-income/approve/${id}`, {});
  }

  reject(id: number): Observable<any> {
    return this.http.patch<any>(`${this.base}/other-income/reject/${id}`, {});
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/other-income/${id}`);
  }
}
