import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PurchaseOrder {
  id: number;
  status: string;
  orderDate: string;
  subTotal: number;
  totalAmount: number;
  items?: any[];
  supplier?: any;
  createdBy?: any;
}

const API_URL = `${environment.apiUrl}/purchase/order`;

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(API_URL);
  }

  createOrder(payload: any): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(API_URL, payload);
  }

  vetOrder(id: number): Observable<PurchaseOrder> {
    return this.http.patch<PurchaseOrder>(`${API_URL}/vet/${id}`, {});
  }

  getOrderById(id: number): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(`${API_URL}/${id}`);
  }

  patchStatus(id: number, status: string): Observable<PurchaseOrder> {
    return this.http.patch<PurchaseOrder>(`${API_URL}/status/${status}`, { id });
  }

  approveOrder(payload: {
    purchaseOrderId: number;
    quotationId: number;
    discountType: 'AMOUNT' | 'PERCENTAGE' | string;
    discountValue: number;
    taxRate: number;
  }): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(`${API_URL}/approve`, payload);
  }

  clearOrder(id: number): Observable<PurchaseOrder> {
    return this.http.patch<PurchaseOrder>(`${API_URL}/clear/${id}`, {});
  }

  receiveOrder(payload: { 
    purchaseOrderId: number; 
    receiveItems: Array<{ 
      purchaseItemId: number; 
      quantityReceived: number; 
      quantityDamaged: number; 
      expirationDate?: string; 
    }>; 
  }): Observable<PurchaseOrder> {
    return this.http.post<PurchaseOrder>(`${API_URL}/receive`, payload);
  }
}
