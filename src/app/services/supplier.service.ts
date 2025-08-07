import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface Supplier {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(private http: HttpClient) { }

  getAllSuppliers() {
    return this.http.get<Supplier[]>(environment.apiUrl + '/supplier');
  }

  getSupplierById(id: number) {
    return this.http.get<Supplier>(`${environment.apiUrl}/supplier/${id}`);
  }

  createSupplier(supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.http.post<Supplier>(`${environment.apiUrl}/supplier`, supplier);
  }

  updateSupplier(id: number, supplier: Partial<Supplier>) {
    return this.http.put<Supplier>(`${environment.apiUrl}/supplier/${id}`, supplier);
  }

  deleteSupplier(id: number) {
    return this.http.delete(`${environment.apiUrl}/supplier/${id}`);
  }
} 