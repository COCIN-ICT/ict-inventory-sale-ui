import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { PurchaseItemResponse as ProductionItem}  from '../api/models';



const API_URL = `${environment.apiUrl}/production/input-item`;

@Injectable({
  providedIn: 'root'
})
export class ProductionInputItemService {

  constructor(private http: HttpClient) { }

  getAllProductionInputItems(): Observable<ProductionItem[]> {
     return this.http.get<ProductionItem[]>(API_URL);
   }

  addInputItem(productionItems: ProductionItem): Observable<ProductionItem> {
       return this.http.post<ProductionItem>(API_URL, productionItems);
     }

  getProductionInputItemById(id: number): Observable<ProductionItem> {
  return this.http.get<ProductionItem>(`${API_URL}/${id}`);   
  }

    deleteInputItem(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }

 
   

  


}