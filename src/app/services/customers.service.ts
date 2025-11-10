import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';

export interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
  email: string;
}



const API_URL = `${environment.apiUrl}/customer`;

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  getCustomers(): Observable<Customer[]> {
     return this.http.get<Customer[]>(API_URL);
   }
  }