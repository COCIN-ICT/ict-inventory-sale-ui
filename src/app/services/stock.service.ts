import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";


export interface Stock {
  id: number;
  totalQuantity: number;
  createdAt: string;
  updatedAt: string;
  item: Item;
  batches: Batch[];
  store: Store;
  price: Price;
  promotions: Promotion[];
}

export interface Item {
  id: number;
  name: string;
  itemCode: string;
  itemType: 'RAW' | 'FINISHED' | string;
  isExpirable: boolean;
  isActive: boolean;
  unitOfMeasure: UnitOfMeasure;
  itemCategory: ItemCategory;
  createdAt: string;
  updatedAt: string;
}

export interface UnitOfMeasure {
  id: number;
  code: string;
  description: string;
}

export interface ItemCategory {
  id: number;
  name: string;
}

export interface Batch {
  id: number;
  batchNumber: string;
  expirationDate: string;
  quantity: number;
  stockId: number;
  status: 'ACTIVE' | 'INACTIVE' | string;
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  id: number;
  name: string;
  location: string;
  storeType: 'PRIMARY' | 'SECONDARY' | string;
  unit: Unit;
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: number;
  name: string;
  description: string;
  address: string;
  active: boolean;
  unitHeadId: number;
}

export interface Price {
  id: number;
  price: number;
  createdBy: User;
  approvedBy: User;
  createdAt: string;
  updatedAt: string;
  stockId: number;
  isActive: boolean;
}

export interface Promotion {
  id: number;
  stockId: number;
  discountType: 'AMOUNT' | 'PERCENTAGE' | string;
  discountValue: number;
  minimumQuantity: number;
  createdAt: string;
  updatedAt: string;
  startDate: string;
  endDate: string;
  createdBy: User;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  username: string;
  address: string;
  phone: string;
  email: string;
  enabled: boolean;
  accountExpired: boolean;
  credentialsExpired: boolean;
  accountLocked: boolean;
  roles: Role[];
  unit: Unit;
}

export interface Role {
  id: number;
  roleName: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  roleId: number;
  permissionType: string;
}


@Injectable({ providedIn: 'root'})

export class StoreService{
    constructor(private http: HttpClient){}

    //const API_URL_STOCK = `${environment.apiUrl}/stock`;

}