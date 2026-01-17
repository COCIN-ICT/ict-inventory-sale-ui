import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private readonly base = environment.apiUrl || '';

  constructor(private readonly http: HttpClient) {}

  getAllBudgets(): Observable<any> {
    return this.http.get<any>(`${this.base}/budget`);
  }

  getBudgetById(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/budget/${id}`);
  }

  createBudget(payload: { year: number; allocatedAmount: number; budgetType: string }): Observable<any> {
    return this.http.post<any>(`${this.base}/budget`, payload);
  }

  updateBudget(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.base}/budget/${id}`, payload);
  }

  deleteBudget(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/budget/${id}`);
  }

  approveBudget(id: number): Observable<any> {
    return this.http.patch<any>(`${this.base}/budget/approve/${id}`, {});
  }

  getPendingBudgets(): Observable<any> {
    return this.http.get<any>(`${this.base}/budget/pending`);
  }

  getBudgetsByYearAndUnit(year: number): Observable<any> {
    return this.http.get<any>(`${this.base}/budget/year/unit?year=${year}`);
  }

  getBudgetsByYearAndType(year: number, type: string): Observable<any> {
    return this.http.get<any>(`${this.base}/budget/year/type?year=${year}&type=${type}`);
  }

  getBudgetsByYearAndDepartment(year: number): Observable<any> {
    return this.http.get<any>(`${this.base}/budget/year/department?year=${year}`);
  }
}
