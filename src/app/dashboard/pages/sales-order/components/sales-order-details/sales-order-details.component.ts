import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesOrderService } from '../../../../../services/sales-order.service';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-sales-order-details',
  templateUrl: './sales-order-details.component.html',
  styleUrls: ['./sales-order-details.component.css']
})
export class SalesOrderDetailsComponent implements OnInit {
  order: any = null;
  isLoading = false;
  isUpdating = false;
  errorMessage = '';
  orderId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private salesOrderService: SalesOrderService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.orderId) {
      this.isLoading = false;
      this.errorMessage = 'Invalid sales order id';
      this.toast.error('Invalid sales order id');
      this.router.navigate(['/home/pos/sales-orders']);
      return;
    }
    
    this.loadOrderDetails(this.orderId);
  }

  loadOrderDetails(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.salesOrderService.getById(id).subscribe({
      next: (res: any) => {
        this.order = res?.data || res || null;
        this.isLoading = false;
        console.log('Sales Order', this.order);
      },
      error: (err: any) => {
        console.error('Error loading sales order', err);
        this.errorMessage = 'Failed to load sales order.';
        this.toast.error(err?.error?.message || err?.message || 'Failed to load sales order');
        this.isLoading = false;
      }
    });
  }

  finishOrder(): void {
    if (!this.order?.id) {
      return;
    }

    if (!confirm('Are you sure you want to finish this sales order?')) {
      return;
    }

    this.isUpdating = true;
    this.errorMessage = '';

    this.salesOrderService.finish(this.order.id).subscribe({
      next: (res: any) => {
        this.toast.success('Sales order finished successfully');
        this.loadOrderDetails(this.order.id);
        this.isUpdating = false;
      },
      error: (err: any) => {
        console.error('Error finishing sales order', err);
        this.errorMessage = 'Failed to finish sales order.';
        this.toast.error(err?.error?.message || err?.message || 'Failed to finish sales order');
        this.isUpdating = false;
      }
    });
  }

  deleteOrder(): void {
    if (!this.order?.id) {
      return;
    }

    if (!confirm('Are you sure you want to delete this sales order? This action cannot be undone.')) {
      return;
    }

    this.isUpdating = true;
    this.errorMessage = '';

    this.salesOrderService.delete(this.order.id).subscribe({
      next: () => {
        this.toast.success('Sales order deleted successfully');
        this.isUpdating = false;
        this.router.navigate(['/home/pos/sales-orders/list']);
      },
      error: (err: any) => {
        console.error('Error deleting sales order', err);
        this.errorMessage = 'Failed to delete sales order.';
        this.toast.error(err?.error?.message || err?.message || 'Failed to delete sales order');
        this.isUpdating = false;
      }
    });
  }

  goBackToList(): void {
    this.router.navigate(['/home/pos/sales-orders/list']);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
}
