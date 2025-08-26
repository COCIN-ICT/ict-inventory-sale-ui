import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ItemCategory {
  id: number;
  name: string;
}

export interface ItemCategoryRequest {
  name: string;
}

export interface ItemCategoryResponse {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ItemCategoryService {

  constructor(private http: HttpClient) { }

  getAllItemCategories(): Observable<ItemCategoryResponse[]> {
    return this.http.get<ItemCategoryResponse[]>(`${environment.apiUrl}/item-category`);
  }

  getItemCategoryById(id: number): Observable<ItemCategoryResponse> {
    return this.http.get<ItemCategoryResponse>(`${environment.apiUrl}/item-category/${id}`);
  }

  createItemCategory(itemCategory: ItemCategoryRequest): Observable<ItemCategoryResponse> {
    return this.http.post<ItemCategoryResponse>(`${environment.apiUrl}/item-category`, itemCategory);
  }

  updateItemCategory(id: number, itemCategory: ItemCategoryRequest): Observable<ItemCategoryResponse> {
    return this.http.put<ItemCategoryResponse>(`${environment.apiUrl}/item-category/${id}`, itemCategory);
  }

  deleteItemCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/item-category/${id}`);
  }
} 