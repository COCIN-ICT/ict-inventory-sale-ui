import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface PurchaseQuotation {
  id?: number;
  invoiceUrl?: string;
  amount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PurchaseQuotationRequest {
  supplierId: number;
  amount: number;
  invoice?: File | string;
  purchaseOrderId?: number;
}

export interface PurchaseQuotationResponse {
  id?: number;
  invoiceUrl?: string;
  amount?: number;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseQuotationService {

  constructor(private http: HttpClient) { }

  getAllPurchaseQuotations() {
    return this.http.get<PurchaseQuotationResponse[]>(`${environment.apiUrl}/quotation`);
  }

  getPurchaseQuotationById(id: number) {
    return this.http.get<PurchaseQuotationResponse>(`${environment.apiUrl}/quotation/${id}`);
  }

  createPurchaseQuotation(purchaseQuotation: PurchaseQuotationRequest) {
    // Debug: Log the request
    console.log('Service: Creating purchase quotation with data:', purchaseQuotation);
    console.log('Service: Full URL:', `${environment.apiUrl}/quotation`);
    
    return this.http.post<PurchaseQuotationResponse>(`${environment.apiUrl}/quotation`, purchaseQuotation);
  }

  // Method for creating purchase quotation with optional file
  createPurchaseQuotationWithFile(supplierId: number, amount: number, file?: File) {
    console.log('Service: Creating purchase quotation with data:', { supplierId, amount, hasFile: !!file });
    
    if (file) {
      // If file is provided, use FormData
      const formData = new FormData();
      formData.append('supplierId', supplierId.toString());
      formData.append('amount', amount.toString());
      formData.append('invoice', file);
      
      console.log('Service: Using FormData with file');
      console.log('Service: FormData contents:', formData);
      return this.http.post<PurchaseQuotationResponse>(`${environment.apiUrl}/quotation`, formData);
    } else {
      // If no file, use JSON
      const requestData = {
        supplierId: supplierId,
        amount: amount
      };
      
      console.log('Service: Using JSON without file');
      console.log('Service: Request data:', requestData);
      console.log('Service: Request URL:', `${environment.apiUrl}/quotation`);
      return this.http.post<PurchaseQuotationResponse>(`${environment.apiUrl}/quotation`, requestData);
    }
  }

  createPurchaseQuotationForOrder(payload: { supplierId: number; amount: number; purchaseOrderId: number; invoiceFile?: File; }) {
    const { supplierId, amount, purchaseOrderId, invoiceFile } = payload;
    if (invoiceFile) {
      const formData = new FormData();
      formData.append('supplierId', String(supplierId));
      formData.append('amount', String(amount));
      formData.append('purchaseOrderId', String(purchaseOrderId));
      formData.append('invoiceFile', invoiceFile);
      return this.http.post<PurchaseQuotationResponse>(`${environment.apiUrl}/purchase/quotation`, formData);
    }
    return this.http.post<PurchaseQuotationResponse>(`${environment.apiUrl}/purchase/quotation`, { supplierId, amount, purchaseOrderId });
  }

  // Alternative method with different field names
  createPurchaseQuotationAlternative(data: any) {
    console.log('Service: Creating purchase quotation with alternative data:', data);
    console.log('Service: Full URL:', `${environment.apiUrl}/quotation`);
    
    return this.http.post<PurchaseQuotationResponse>(`${environment.apiUrl}/quotation`, data);
  }

  updatePurchaseQuotation(id: number, purchaseQuotation: PurchaseQuotationRequest) {
    return this.http.put<PurchaseQuotationResponse>(`${environment.apiUrl}/quotation/${id}`, purchaseQuotation);
  }

  deletePurchaseQuotation(id: number) {
    return this.http.delete(`${environment.apiUrl}/quotation/${id}`);
  }
} 