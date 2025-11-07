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
    // Create payload matching API structure with empty arrays
    // Based on API spec: items and quotations are arrays
    const payload = {};
    
    console.log('=== Creating Purchase Order ===');
    console.log('Payload being sent:', JSON.stringify(payload, null, 2));
    console.log('Method: POST');
    console.log('Content-Type: application/json');
    
    this.purchaseOrderService.createOrder(payload).subscribe({
      next: (res: any) => {
        
        const id = res.id || res.data?.id || res.result?.id;
        console.log('Extracted ID:', id);
        
        this.toast.success('Purchase Order created successfully');
        if (id) {
          this.router.navigate([`/home/purchase-order/details/${id}`]);
        } else {
          this.toast.error('Order created but ID not found. Please refresh the list.');
          this.loadPurchaseOrders();
        }
      },
      error: (err: any) => {
        console.error('=== ERROR: Purchase Order Creation Failed ===');
        console.error('Error object:', err);
        console.error('Error status:', err.status);
        console.error('Error statusText:', err.statusText);
        console.error('Error URL:', err.url);
        console.error('Error message:', err.message);
        console.error('Error error property:', err.error);
        console.error('Error error type:', typeof err.error);
        
        if (err.error) {
          console.error('Error.error details:');
          if (typeof err.error === 'string') {
            console.error('Error.error is a string:', err.error);
          } else if (typeof err.error === 'object') {
            console.error('Error.error keys:', Object.keys(err.error));
            console.error('Error.error full:', JSON.stringify(err.error, null, 2));
            
            // Try to extract validation errors
            if (err.error.errors) {
              console.error('Validation errors:', err.error.errors);
            }
            if (err.error.message) {
              console.error('Error message:', err.error.message);
            }
            if (err.error.error) {
              console.error('Error error:', err.error.error);
            }
          }
        }
        
        // Extract error message for user
        let errorMessage = 'Failed to create purchase order.';
        if (err.error) {
          if (typeof err.error === 'string' && err.error.length > 0) {
            errorMessage = err.error;
          } else if (err.error && typeof err.error === 'object') {
            if (err.error.message) {
              errorMessage = err.error.message;
            } else if (err.error.error) {
              errorMessage = err.error.error;
            } else if (Object.keys(err.error).length > 0) {
              errorMessage = JSON.stringify(err.error);
            } else {
              errorMessage = `Bad Request (${err.status}): The server rejected the request. Check console for details.`;
            }
          }
        } else {
          errorMessage = `HTTP ${err.status}: ${err.statusText || 'Bad Request'}`;
        }
        
        console.error('Final error message to show user:', errorMessage);
        this.toast.error(errorMessage);
      }
    });
  }

  navigateToDetails(id: number): void {
    console.log("Navigating to purchase order details...");
    this.router.navigate([`/home/purchase-order/details/${id}`]);
  }
}
