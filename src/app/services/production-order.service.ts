import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { ProductionOrderResponse as ProductionOrder}  from '../api/models';



const API_URL = `${environment.apiUrl}/production/order`;

@Injectable({
  providedIn: 'root'
})
export class ProductionOrderService {

  constructor(private http: HttpClient) { }

  getAllProductionOrders(): Observable<ProductionOrder[]> {
     return this.http.get<ProductionOrder[]>(API_URL);
   }

   createProductionOrders(productionOrders: ProductionOrder): Observable<ProductionOrder> {
       return this.http.post<ProductionOrder>(API_URL, productionOrders);
     }

  getProductionOrder(id: number): Observable<ProductionOrder> {
  return this.http.get<ProductionOrder>(`${API_URL}/${id}`);   
  }

 
   

  


}
