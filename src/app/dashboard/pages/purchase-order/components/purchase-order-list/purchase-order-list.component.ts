import { Component } from '@angular/core';
import { PurchaseOrder } from '../../purchase-order.model';
import { PurchaseOrderService } from '../../../../../services/purchase-order.service';
import { ToastService } from '../../../../../services/toast.service';


import { PurchaseOrderApiApiService } from '../../../../../api/services';
import { PurchaseOrderResponse } from '../../../../../api/models';
import { finalize } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PurchaseOrderFormComponent } from '../purchase-order-form/purchase-order-form.component';


@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrl: './purchase-order-list.component.css'
})
export class PurchaseOrderListComponent {
  purchaseOrders: PurchaseOrderResponse[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  isModalOpen: boolean = false;
  constructor(private orderService: PurchaseOrderService, private toast: ToastService,
    private purchaseOrderApiService: PurchaseOrderApiApiService,
    private dialog: MatDialog
  ) { }

  // loadOrders() {
  //   this.isLoading = true;
  //   this.errorMessage = null;
  //   this.orderService.getAllOrders().subscribe({next: (res: any) => {
  //     this.purchaseOrders = res.data || res.users || res.result || res || [] ;
  //     this.isLoading = false;},
  //     error: (error: any) => {
  //       this.errorMessage = 'Failed to load purchase orders. Please try again later.';
  //       this.toast.error(error.message);
  //       this.toast.error(error.message || this.errorMessage);
  //       this.isLoading = false;
  //     }
  //   });
  // }

  ngOnInit() {
   // this.loadOrders();
    console.log('API returned this data:', this.purchaseOrders); 
   this.fetchPurchaseOrders();
  }

  fetchPurchaseOrders(): void {
  this.isLoading = true;
  this.errorMessage = null;

  this.purchaseOrderApiService.getAll5$Response({}).pipe(
    finalize(() => this.isLoading = false)
  ).subscribe({
    next: async (orders: any) => {

      const text = await (orders.body as Blob).text();
      const json = JSON.parse(text);
      console.log('Parsed JSON from Blob:', json);


      console.log('Full HTTP response:', orders); // 👀 log StrictHttpResponse
      console.log('Response body:', orders.body); // 👀 log the array
      console.log('Full API response:', orders);

      this.purchaseOrders = json.data || json.users || json.result || json || [];

      console.log('Mapped purchaseOrders:', this.purchaseOrders);
    },
    error: (error) => {
      this.errorMessage = 'Failed to load purchase orders. Please try again later.';
      this.toast.error(error.message || this.errorMessage);
    }
  });
}

openCreateOrderDialog(): void {
    const dialogRef = this.dialog.open(PurchaseOrderFormComponent, {disableClose: true});

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'created') {
        this.toast.success('Order created successfully!');
        this.fetchPurchaseOrders();
      }
    });
  }
  
  closeModal() {
    this.isModalOpen = false;
  }


  /*viewOrder(orderId: number): void {
    console.log(`View button clicked for Order ID: ${orderId}`);
    this.toast.info(`View button clicked for Order ID: ${orderId}`);
    // You would typically use a router here to navigate to a details page.
    // Example: this.router.navigate(['/purchase-orders', orderId]);
    
  }*/


}
