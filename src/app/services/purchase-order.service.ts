import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  private readonly base = environment.apiUrl || '';

  constructor(private readonly http: HttpClient) {}

  getAllOrders(): Observable<any> {
    return this.http.get<any>(`${this.base}/purchase/order`);
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/purchase/order/${id}`);
  }

  createOrder(payload: any): Observable<any> {
    return this.http.post<any>(`${this.base}/purchase/order`, payload);
  }

  vetOrder(id: number): Observable<any> {
    return this.http.post<any>(`${this.base}/purchase/order/vet/${id}`, {});
  }

  clearOrder(id: number): Observable<any> {
    return this.http.post<any>(`${this.base}/purchase/order/clear/${id}`, {});
  }

  receiveOrder(payload: any): Observable<any> {
    return this.http.post<any>(`${this.base}/purchase/order/receive`, payload);
  }

  approveOrder(payload: any): Observable<any> {
    return this.http.post<any>(`${this.base}/purchase/order/approve`, payload);
  }

  getOrdersByStatus(status: string): Observable<any> {
    return this.http.get<any>(`${this.base}/purchase/order/status/${status}`);
  }

  getPendingOrders(): Observable<any> {
    return this.http.get<any>(`${this.base}/purchase/order/pending`);
  }
}