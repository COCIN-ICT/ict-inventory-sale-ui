import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  private readonly base = environment.apiUrl || '';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<any>(`${this.base}/other-expense`);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/other-expense/${id}`);
  }

  create(payload: OtherExpenseRequest): Observable<any> {
    return this.http.post<any>(`${this.base}/other-expense`, payload);
  }

  update(id: number, payload: OtherExpenseRequest): Observable<any> {
    return this.http.put<any>(`${this.base}/other-expense/${id}`, payload);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/other-expense/${id}`);
  }

  pay(payload: any): Observable<any> {
    // Backend is expected to define the exact payload; keep flexible
    return this.http.post<any>(`${this.base}/other-expense/pay`, payload);
  }

  approve(id: number): Observable<any> {
    return this.http.patch<any>(`${this.base}/other-expense/approve/${id}`, {});
  }

  getPending(): Observable<any> {
    return this.http.get<any>(`${this.base}/other-expense/pending`);
  }
}

