import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SalesItemRequest {
  itemId: number;
  salesOrderId?: number | null;
  quantity: number;
}

export interface SalesItemResponse {
  id: number;
  itemId: number;
  salesOrderId?: number | null;
  quantity: number;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class SalesItemService {
  private readonly baseUrl = environment.apiUrl || '';
  private readonly createdItems$ = new BehaviorSubject<SalesItemResponse[]>([]);

  constructor(private http: HttpClient) {}

  create(payload: SalesItemRequest): Observable<SalesItemResponse> {
    return this.http.post<SalesItemResponse>(`${this.baseUrl}/sales/item`, payload).pipe(
      tap((created) => {
        const current = this.createdItems$.value;
        this.createdItems$.next([created, ...current]);
      })
    );
  }

  getCreatedItems(): Observable<SalesItemResponse[]> {
    return this.createdItems$.asObservable();
  }
}


