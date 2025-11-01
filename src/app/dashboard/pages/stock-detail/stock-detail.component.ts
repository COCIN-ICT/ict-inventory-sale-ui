import { Component } from '@angular/core';

@Component({
  selector: 'app-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrl: './stock-detail.component.css'
})
export class StockDetailComponent {
   pricePerUnit = 2500;

  batches = [
    { quantity: 100, expiryDate: '2026-05-10', status: 'Active' },
    { quantity: 200, expiryDate: '2025-11-12', status: 'Active' },
    { quantity: 100, expiryDate: '2024-12-01', status: 'Expired' },
  ];

  promotions = [
    { title: 'Easter Discount', startDate: '2025-03-01', endDate: '2025-03-15', status: 'Expired' },
    { title: 'Summer Sale', startDate: '2025-07-01', endDate: '2025-07-10', status: 'Active' },
  ];

}
