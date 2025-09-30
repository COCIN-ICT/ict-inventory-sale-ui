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

  // Modal states
  showClearModal = false;
  showReceiveModal = false;
  
  // Clear modal data
  clearId: number = 0;
  
  // Receive modal data
  receivePayload = {
    purchaseOrderId: 0,
    receiveItems: [
      {
        purchaseItemId: 0,
        quantityReceived: 0,
        quantityDamaged: 0,
        expirationDate: ''
      }
    ]
  };

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

  goToDetails(order: any): void {
    this.router.navigate(['/home/purchase-order/details', order.id]);
  }

  goToCreate(): void {
    this.router.navigate(['/home/purchase-order/create']);
  }

  goToVetting(): void {
    this.router.navigate(['/home/purchase-order/vetting']);
  }

  // Clear Modal Methods
  openClearModal(order: any): void {
    this.clearId = order.id;
    this.showClearModal = true;
  }

  closeClearModal(): void {
    this.showClearModal = false;
    this.clearId = 0;
  }

  clearOrder(): void {
    if (!this.clearId) {
      this.toast.error('Please enter a valid Purchase Order ID');
      return;
    }

    this.purchaseOrderService.clearOrder(this.clearId).subscribe({
      next: (res: any) => {
        this.toast.success('Purchase order cleared successfully');
        this.closeClearModal();
        this.loadPurchaseOrders(); // Refresh the list
      },
      error: (err: any) => {
        this.toast.error(err?.error?.message || err?.message || 'Failed to clear purchase order');
      }
    });
  }

  // Receive Modal Methods
  openReceiveModal(order: any): void {
    this.receivePayload.purchaseOrderId = order.id;
    this.showReceiveModal = true;
  }

  closeReceiveModal(): void {
    this.showReceiveModal = false;
    this.resetReceivePayload();
  }

  resetReceivePayload(): void {
    this.receivePayload = {
      purchaseOrderId: 0,
      receiveItems: [
        {
          purchaseItemId: 0,
          quantityReceived: 0,
          quantityDamaged: 0,
          expirationDate: ''
        }
      ]
    };
  }

  addReceiveItem(): void {
    this.receivePayload.receiveItems.push({
      purchaseItemId: 0,
      quantityReceived: 0,
      quantityDamaged: 0,
      expirationDate: ''
    });
  }

  removeReceiveItem(index: number): void {
    if (this.receivePayload.receiveItems.length > 1) {
      this.receivePayload.receiveItems.splice(index, 1);
    }
  }

  receiveOrder(): void {
    if (!this.receivePayload.purchaseOrderId) {
      this.toast.error('Please enter a valid Purchase Order ID');
      return;
    }

    if (this.receivePayload.receiveItems.length === 0) {
      this.toast.error('Please add at least one item to receive');
      return;
    }

    // Validate receive items
    for (let item of this.receivePayload.receiveItems) {
      if (!item.purchaseItemId || item.quantityReceived <= 0) {
        this.toast.error('Please fill in all required fields for receive items');
        return;
      }
    }

    this.purchaseOrderService.receiveOrder(this.receivePayload).subscribe({
      next: (res: any) => {
        this.toast.success('Items received successfully');
        this.closeReceiveModal();
        this.loadPurchaseOrders(); // Refresh the list
      },
      error: (err: any) => {
        this.toast.error(err?.error?.message || err?.message || 'Failed to receive items');
      }
    });
  }
}
