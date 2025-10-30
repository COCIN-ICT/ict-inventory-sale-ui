import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CreateCreditRequest {
  salesOrderId: number;
  amount: number;
  expectedRepaymentDate: string;
}

export interface ApproveCreditRequest {
  creditId: number;
  amount: number;
  paymentMethod: 'CASH' | 'TRANSFER' | 'DEPOSIT';
  accountId: number;
}

export interface CreditResponse {
  id: number;
  salesOrderId: number;
  amount: number;
  expectedRepaymentDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  salesOrder?: any;
  payments?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class SalesCreditService {
  private baseUrl = environment.apiUrl || '';

  constructor(private http: HttpClient) {}

  // GET /sales/credit - Get all credits
  getAllCredits(): Observable<CreditResponse[]> {
    return this.http.get<CreditResponse[]>(`${this.baseUrl}/sales/credit`);
  }

  // POST /sales/credit - Create credit
  createCredit(payload: CreateCreditRequest): Observable<CreditResponse> {
    return this.http.post<CreditResponse>(`${this.baseUrl}/sales/credit`, payload);
  }

  // PATCH /sales/credit/pay - Approve credit with payment details
  approveCreditWithPayment(payload: ApproveCreditRequest): Observable<any> {
    return this.http.patch(`${this.baseUrl}/sales/credit/pay`, payload);
  }

  // PATCH /sales/credit/approve/{id} - Approve credit by ID
  approveCreditById(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/sales/credit/approve/${id}`, {});
  }

  // GET /sales/credit/{id} - Get credit by ID
  getCreditById(id: number): Observable<CreditResponse> {
    return this.http.get<CreditResponse>(`${this.baseUrl}/sales/credit/${id}`);
  }

  // GET /sales/credit/pending - Get pending credits
  getPendingCredits(): Observable<CreditResponse[]> {
    return this.http.get<CreditResponse[]>(`${this.baseUrl}/sales/credit/pending`);
  }
}
