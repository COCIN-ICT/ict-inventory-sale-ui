import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { BankAccount } from '../dashboard/pages/bank-account/bank-account.model';


const API_URL = `${environment.apiUrl}/bank-account`;
@Injectable({
  providedIn: 'root'
})
export class BankAccountService {
    constructor(private http: HttpClient) { }
  getBankAccounts(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(API_URL);
  }

  createBankAccount(bankAccount: BankAccount): Observable<BankAccount> {
    return this.http.post<BankAccount>(API_URL, bankAccount);
  }

  updateBankAccount(id: number, bankAccount: BankAccount): Observable<BankAccount> {
    return this.http.put<BankAccount>(`${API_URL}/${id}`, bankAccount);
  }

  changeStatus(id: number, status: 'active' | 'deactivate'): Observable<void> {
    return this.http.patch<void>(`${API_URL}/change-status/${id}`, { status });
  }
}