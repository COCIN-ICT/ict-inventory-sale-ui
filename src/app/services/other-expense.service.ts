import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OtherExpenseRequest {
  budgetLineItemId: number;
  amount: number;
  category: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OtherExpenseService {
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
    return this.http.get<any>(`${this.base}/other-expense`, { params: httpParams });
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/other-expense/${id}`);
  }

  getPending(): Observable<any> {
    return this.http.get<any>(`${this.base}/other-expense/pending`);
  }

  create(payload: OtherExpenseRequest): Observable<any> {
    return this.http.post<any>(`${this.base}/other-expense`, payload);
  }

  update(id: number, payload: Partial<OtherExpenseRequest>): Observable<any> {
    return this.http.put<any>(`${this.base}/other-expense/${id}`, payload);
  }

  approve(id: number): Observable<any> {
    return this.http.patch<any>(`${this.base}/other-expense/approve/${id}`, {});
  }

  reject(id: number): Observable<any> {
    return this.http.patch<any>(`${this.base}/other-expense/reject/${id}`, {});
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/other-expense/${id}`);
  }
}
