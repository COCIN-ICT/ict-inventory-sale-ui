import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { Store } from "../dashboard/pages/store/store.model";

const API_URL = `${environment.apiUrl}/store`;
const API_URL_STOCK = `${environment.apiUrl}/stock`;

@Injectable({ providedIn: 'root'})

export class StoreService{
    constructor(private http: HttpClient){}

getStore(): Observable<Store[]> { // Changed from [Store] to Store[]
    return this.http.get<Store[]>(API_URL);
  }

getStoreById(id: number): Observable<Store> {
    return this.http.get<Store>(`${API_URL}/${id}`);
  }

createStore(store: Store): Observable<Store> {
    return this.http.post<Store>(API_URL, store);
}

updateStore(id: number, store: Store): Observable<Store> {
  return this.http.put<Store>(`${API_URL}/${id}`, store);
}

getStockByStoreId(storeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL_STOCK}/store/${storeId}`);
  }



// getStoreByDepartmentId(departmentId: number): Observable<Store[]> {
//     return this.http.get<Store[]>(`${API_URL}/department/${departmentId}`);
//   }



}