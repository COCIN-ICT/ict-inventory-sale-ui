import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseOrder } from '../dashboard/pages/purchase-order/purchase-order.model';
import { environment } from '../../environments/environment';


const API_URL = `${environment.apiUrl}/purchase/order`;

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(API_URL);
  }

  getOrderById(id: number): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(`${API_URL}/${id}`);
  }
}
