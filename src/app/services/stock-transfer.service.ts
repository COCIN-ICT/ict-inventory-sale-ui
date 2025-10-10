import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { Store } from '../dashboard/pages/store/store.model';
import { Item } from '../dashboard/pages/items/item.model';
import { StockTransfer } from '../dashboard/pages/stock-transfer/stock-transfer.model';



const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class StockTransferService {

  constructor(private http: HttpClient) { }

  getStores(): Observable<Store[]> {
     return this.http.get<Store[]>(`${API_URL}/store`);
   }

   getItems(): Observable<Item[]> {
     return this.http.get<Item[]>(`${API_URL}/item`);
   }

   createStockTransfer(data: any): Observable<StockTransfer[]> {
    return this.http.post<StockTransfer[]>(`${API_URL}/stock/transfer`, data);
  }
}