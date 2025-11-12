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

  //  transferStock(payload: any): Observable<StockTransfer[]> {
  //   return this.http.post<StockTransfer[]>(`${API_URL}/stock/transfer`, payload);
  // }

   transferStock(payload: any): Observable<StockTransfer> {
    return this.http.post<any>(`${API_URL}/stock/transfer`, payload).pipe(
      map((res) => {
        // normalize response: backend may return an object or an array
        if (Array.isArray(res)) {
          return res[0] as StockTransfer;
        }
        return res as StockTransfer;
      })
    );
  }

  approveStockTransfer(transferId: number): Observable<any> {
    return this.http.patch(`${API_URL}/stock/transfer/approve/${transferId}`, {}); 
}

receiveStockTransfer(transferId: number): Observable<any> {
  return this.http.patch(`${API_URL}/stock/transfer/receive/${transferId}`, {});  
}
}