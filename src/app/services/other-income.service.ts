import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  private readonly base = environment.apiUrl || '';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.base}/other-income`);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/other-income/${id}`);
  }

  create(payload: OtherIncomeRequest): Observable<any> {
    return this.http.post<any>(`${this.base}/other-income`, payload);
  }

  update(id: number, payload: OtherIncomeRequest): Observable<any> {
    return this.http.put<any>(`${this.base}/other-income/${id}`, payload);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/other-income/${id}`);
  }

  approve(id: number): Observable<any> {
    return this.http.patch<any>(`${this.base}/other-income/approve/${id}`, {});
  }

  getPending(): Observable<any> {
    return this.http.get<any>(`${this.base}/other-income/pending`);
  }
}

