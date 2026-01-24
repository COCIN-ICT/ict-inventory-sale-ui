import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Pricing as PricingModel } from '../dashboard/pages/pricing/pricing.model';


const API_URL = `${environment.apiUrl}`;
@Injectable({
  providedIn: 'root'
})
export class PricingService {
    constructor(private http: HttpClient) { }

  
  createPricing(pricingModel: PricingModel): Observable<PricingModel> {
    return this.http.post<PricingModel>(`${API_URL}/pricing`, pricingModel);
  }
  // getPricingByID(id: number): Observable<PricingModel[]> {
  //   return this.http.get<PricingModel[]>(`${API_URL}/pricing/${id}`);
  // }

  updatePricing(id: number, pricingModel: PricingModel): Observable<PricingModel> {
    return this.http.put<PricingModel>(`${API_URL}/pricing/${id}`, pricingModel);
  }

  // getPricingByStock(stockId: number): Observable<PricingModel[]> {
  //   return this.http.get<PricingModel[]>(`${API_URL}/stock/${stockId}`);
  // }

  getPricingByStock(stockId: number): Observable<PricingModel> {
  return this.http.get<PricingModel>(
    `${API_URL}/pricing/stock/${stockId}`
  );
}

  // getStock(): Observable<any[]> {
  //   return this.http.get<any[]>(`${API_URL}/stock`);
  // }
}