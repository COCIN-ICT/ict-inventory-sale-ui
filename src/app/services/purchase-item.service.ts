import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseItem } from '../dashboard/pages/purchase-item/purchase-item.model';
import { environment } from '../../environments/environment';

export interface PurchaseItemRequest {
  itemId: number;
  quantity: number;
  unitPrice: number;
  purchaseOrderId: number;
}

export interface PurchaseItemResponse {
  id: number;
}

const API_URL = `${environment.apiUrl}/purchase/item`;

@Injectable({
  providedIn: 'root'
})
export class PurchaseItemService {
 
  constructor(private http: HttpClient) {}

  createPurchaseItem(item: PurchaseItem): Observable<PurchaseItem> {
    return this.http.post<PurchaseItem>(API_URL, item);
  }

  createPurchaseItemWithRequest(payload: PurchaseItemRequest): Observable<PurchaseItemResponse> {
    return this.http.post<PurchaseItemResponse>(`${environment.apiUrl}/purchase/item`, payload);
  }

  getItemsByPurchaseOrder(orderId: number): Observable<{ purchaseOrderId: number, items: PurchaseItem[] }> {
    return this.http.get<{ purchaseOrderId: number, items: PurchaseItem[] }>(
      `${API_URL}/purchase-orders/${orderId}/items`
    );
  }

  getPurchaseItems(): Observable<PurchaseItem[]> {
    return this.http.get<PurchaseItem[]>(API_URL);
  }
}
