import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CreatePromotionRequest {
  stockId: number;
  discountType: 'AMOUNT' | 'PERCENTAGE' | 'FIXED_PRICE';
  discountValue: number;
  minimumQuantity: number;
  startDate: string;
  endDate: string;
}

export interface UpdatePromotionRequest {
  stockId: number;
  discountType: 'AMOUNT' | 'PERCENTAGE' | 'FIXED_PRICE';
  discountValue: number;
  minimumQuantity: number;
  startDate: string;
  endDate: string;
}

export interface PromotionResponse {
  id: number;
  stockId: number;
  discountType: string;
  discountValue: number;
  minimumQuantity: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  stock?: {
    id: number;
    name: string;
    location: string;
    storeType: string;
    unit: {
      id: number;
      name: string;
      description: string;
      address: string;
      active: boolean;
      unitHeadId: number;
    };
  };
}

export interface StockResponse {
  id: number;
  name: string;
  location: string;
  storeType: string;
  unit: {
    id: number;
    name: string;
    description: string;
    address: string;
    active: boolean;
    unitHeadId: number;
  };
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class SalesPromotionService {
  private baseUrl = environment.apiUrl || '';

  constructor(private http: HttpClient) {}

  // POST /sales/promotion - Create promotion
  createPromotion(payload: CreatePromotionRequest): Observable<PromotionResponse> {
    return this.http.post<PromotionResponse>(`${this.baseUrl}/sales/promotion`, payload);
  }

  // GET /sales/promotion/{id} - Get promotion by ID
  getPromotionById(id: number): Observable<PromotionResponse> {
    return this.http.get<PromotionResponse>(`${this.baseUrl}/sales/promotion/${id}`);
  }

  // PUT /sales/promotion/{id} - Update promotion by ID
  updatePromotion(id: number, payload: UpdatePromotionRequest): Observable<PromotionResponse> {
    return this.http.put<PromotionResponse>(`${this.baseUrl}/sales/promotion/${id}`, payload);
  }

  // GET /sales/promotion/stock/{stockId} - Get promotions by stock ID
  getPromotionsByStock(stockId: number): Observable<PromotionResponse[]> {
    return this.http.get<PromotionResponse[]>(`${this.baseUrl}/sales/promotion/stock/${stockId}`);
  }

  // GET /sales/promotion - Get all promotions (assuming this endpoint exists)
  getAllPromotions(): Observable<PromotionResponse[]> {
    return this.http.get<PromotionResponse[]>(`${this.baseUrl}/sales/promotion`);
  }

  // GET /stock - Get all stocks for dropdown
  getAllStocks(): Observable<StockResponse[]> {
    return this.http.get<StockResponse[]>(`${this.baseUrl}/stock`);
  }
}
