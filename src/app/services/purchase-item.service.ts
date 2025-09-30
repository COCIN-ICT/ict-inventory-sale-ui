import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

@Injectable({ providedIn: 'root' })
export class PurchaseItemService {

  constructor(private http: HttpClient) {}

  createPurchaseItem(payload: PurchaseItemRequest): Observable<PurchaseItemResponse> {
    return this.http.post<PurchaseItemResponse>(`${environment.apiUrl}/purchase/item`, payload);
  }
}


