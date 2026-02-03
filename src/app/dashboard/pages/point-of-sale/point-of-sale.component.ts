import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-point-of-sale',
  templateUrl: './point-of-sale.component.html',
  styleUrls: ['./point-of-sale.component.css']
})
export class PointOfSaleComponent {

  constructor(private router: Router) { }

  navigateToSalesOrders(): void {
    this.router.navigate(['/home/pos/sales-orders']);
  }

  navigateToSalesItems(): void {
    this.router.navigate(['/home/pos/sales-items']);
  }

  navigateToSalesCredit(): void {
    this.router.navigate(['/home/pos/sales-credit']);
  }

  navigateToSalesPromotions(): void {
    this.router.navigate(['/home/pos/sales-promotions']);
  }
}
