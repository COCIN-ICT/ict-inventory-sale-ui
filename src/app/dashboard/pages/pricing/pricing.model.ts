export class Pricing {
}

export interface Stock {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}

export interface Pricing {
  id?: number; // Optional, assigned by server on create
  stockId: number; // ID of the stock item
  price: number; // Price value
  createdAt?: string; // Optional, may come from response
  updatedAt?: string; // Optional, may come from response
}