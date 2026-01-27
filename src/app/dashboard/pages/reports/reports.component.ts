import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {

  constructor(private router: Router) { }

  navigateToSalesOrderReport(): void {
    this.router.navigate(['/home/reports/sales-order']);
  }

  navigateToPurchaseOrderReport(): void {
    this.router.navigate(['/home/reports/purchase-order']);
  }

  navigateToProductionOrderReport(): void {
    this.router.navigate(['/home/reports/production-order']);
  }
}
