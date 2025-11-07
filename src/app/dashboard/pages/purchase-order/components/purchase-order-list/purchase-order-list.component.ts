import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseOrderService } from '../../../../../services/purchase-order.service';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.css']
})
export class PurchaseOrderListComponent implements OnInit {
  purchaseOrders: any[] = [];
  isLoading = false;

  constructor(
    private router: Router,
    private purchaseOrderService: PurchaseOrderService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.loadPurchaseOrders();
  }

  loadPurchaseOrders(): void {
    this.isLoading = true;
    this.purchaseOrderService.getAllOrders().subscribe({
      next: (res: any) => {
        this.purchaseOrders = res?.data || res || [];
        this.isLoading = false;
      },
      error: (err: any) => {
        this.toast.error(err?.error?.message || err?.message || 'Failed to load purchase orders');
        this.isLoading = false;
      }
    });
  }

  createPurchaseOrder(): void {
    // According to Swagger, items and quotations are optional arrays
    // Try with empty object first (like production orders)
    const payload: any = {};
    
    console.log('Creating purchase order with payload:', payload);
    
    this.purchaseOrderService.createOrder(payload).subscribe({
      next: (res: any) => {
        const id = res.id || res.data?.id;
        console.log('Purchase Order created successfully!', res);
        this.toast.success('Purchase Order created successfully');
        this.router.navigate([`/home/purchase-order/details/${id}`]);
      },
      error: (err: any) => {
        console.error('Error creating purchase order:', err);
        console.error('Full error object:', JSON.stringify(err, null, 2));
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          error: err.error,
          errorType: typeof err.error,
          errorKeys: err.error ? Object.keys(err.error) : [],
          message: err.message,
          url: err.url
        });
        
        // The error object is empty {}, so the backend might have validation issues
        // Try to show a helpful message
        let errorMessage = 'Failed to create purchase order. Please check the console for details.';
        
        // Check if there's any error information
        if (err.error) {
          if (typeof err.error === 'string' && err.error.length > 0) {
            errorMessage = err.error;
          } else if (err.error && typeof err.error === 'object') {
            const errorKeys = Object.keys(err.error);
            if (errorKeys.length > 0) {
              errorMessage = JSON.stringify(err.error);
            } else {
              errorMessage = 'Bad Request: The server rejected the request. This might be a validation error.';
            }
          }
        }
        
        this.toast.error(errorMessage);
      }
    });
  }

  navigateToDetails(id: number): void {
    console.log("Navigating to purchase order details...");
    this.router.navigate([`/home/purchase-order/details/${id}`]);
  }
}
