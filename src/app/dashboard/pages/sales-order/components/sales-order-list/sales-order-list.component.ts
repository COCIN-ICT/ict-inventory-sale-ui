import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SalesOrderService } from '../../../../../services/sales-order.service';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-sales-order-list',
  templateUrl: './sales-order-list.component.html',
  styleUrls: ['./sales-order-list.component.css']
})
export class SalesOrderListComponent implements OnInit {
  salesOrders: any[] = [];
  isLoading = false;
  selectedStatus: string = 'all'; // 'all', 'PENDING', 'COMPLETED', 'CANCELLED', etc.

  constructor(
    private router: Router,
    private salesOrderService: SalesOrderService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadSalesOrders();
  }

  loadSalesOrders(): void {
    this.isLoading = true;
    
    let request: any;
    
    if (this.selectedStatus === 'all') {
      request = this.salesOrderService.getAll();
    } else if (this.selectedStatus === 'pending') {
      request = this.salesOrderService.getPendingByUnit();
    } else {
      request = this.salesOrderService.getAll({ status: this.selectedStatus });
    }

    request.subscribe({
      next: (res: any) => {
        this.salesOrders = Array.isArray(res) ? res : (res?.data || res?.content || []);
        this.isLoading = false;
      },
      error: (err: any) => {
        this.toast.error(err?.error?.message || err?.message || 'Failed to load sales orders');
        this.isLoading = false;
        this.salesOrders = [];
      }
    });
  }

  onStatusFilterChange(): void {
    this.loadSalesOrders();
  }

  navigateToCreate(): void {
    this.router.navigate(['/home/pos/sales-orders/create']);
  }

  navigateToDetails(id: number): void {
    if (!id) {
      return;
    }
    this.router.navigate(['/home/pos/sales-orders/details', id]);
  }

  private getOrderId(order: any): number | undefined {
    if (!order) {
      return undefined;
    }

    const directId = order.id ?? order.salesOrderId;

    if (typeof directId === 'number') {
      return directId;
    }

    for (const key of Object.keys(order)) {
      const value = (order as any)[key];
      if (typeof value === 'number' && key.toLowerCase().includes('id')) {
        return value;
      }
    }

    return undefined;
  }

  navigateToDetailsFromRow(order: any): void {
    const id = this.getOrderId(order);
    if (!id) {
      return;
    }
    this.router.navigate(['/home/pos/sales-orders/details', id]);
  }

  navigateToPOS(): void {
    this.router.navigate(['/home/point-of-sale']);
  }
}
