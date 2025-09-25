import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UnitOfMeasureResponse } from './unit-of-measure.service';
import { ItemCategoryResponse } from './item-category.service';

export enum ItemType {
  RAW = 'RAW',
  RESALABLE = 'RESALABLE',
  FINISHED = 'FINISHED'
}

export interface ItemRequest {
  name: string;
  itemType: ItemType;
  isExpirable: boolean;
  unitOfMeasureId: number;
  itemCategoryId: number;
}

export interface ItemResponse {
  id: number;
  name: string;
  itemCode: string;
  itemType: ItemType;
  isExpirable: boolean;
  isActive: boolean;
  unitOfMeasure: UnitOfMeasureResponse;
  itemCategory: ItemCategoryResponse;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

  getAllItems(): Observable<ItemResponse[]> {
    return this.http.get<ItemResponse[]>(`${environment.apiUrl}/item`);
  }

  getItemById(id: number): Observable<ItemResponse> {
    return this.http.get<ItemResponse>(`${environment.apiUrl}/item/${id}`);
  }

  createItem(item: ItemRequest): Observable<ItemResponse> {
    return this.http.post<ItemResponse>(`${environment.apiUrl}/item`, item);
  }

  updateItem(id: number, item: ItemRequest): Observable<ItemResponse> {
    return this.http.put<ItemResponse>(`${environment.apiUrl}/item/${id}`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/item/${id}`);
  }

  changeItemStatus(id: number): Observable<ItemResponse> {
    return this.http.patch<ItemResponse>(`${environment.apiUrl}/item/change-status/${id}`, {});
  }

  getItemsByStatus(isActive: boolean): Observable<ItemResponse[]> {
    return this.http.get<ItemResponse[]>(`${environment.apiUrl}/item/status/${isActive}`);
  }
} 