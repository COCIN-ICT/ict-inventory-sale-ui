import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseOrder } from '../../purchase-order.model';
import { PurchaseOrderService } from '../../../../../services/purchase-order.service';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.css']
})
export class PurchaseOrderListComponent {
  purchaseOrders: PurchaseOrder[] = [];
  isLoading: boolean = true;
  constructor(private orderService: PurchaseOrderService, private toast: ToastService, private router: Router) { }

  loadOrders() {
    this.orderService.getAllOrders().subscribe({next: (res: any) => {
      this.purchaseOrders = res.data || res.users || res.result || res || [] ;
      this.isLoading = false;},
      error: (error: any) => {
        this.toast.error(error.message);
        this.isLoading = false;
      }
    });
  }

  ngOnInit() {
    this.loadOrders();
  }

  goToDetails(order: PurchaseOrder) {
    if (!order?.id) return;
    this.router.navigate(['/home/purchase-order', order.id]);
  }

  showStatusModal = false;
  selectedOrder?: PurchaseOrder;
  selectedStatus: string = 'PENDING';

  openStatusModal(order: PurchaseOrder) {
    this.selectedOrder = order;
    this.selectedStatus = (order as any)?.status || 'PENDING';
    this.showStatusModal = true;
  }

  closeStatusModal() { this.showStatusModal = false; this.selectedOrder = undefined; }

  updateStatus() {
    if (!this.selectedOrder?.id || !this.selectedStatus) return;
    (this.orderService as any).patchStatus
      ? (this.orderService as any).patchStatus(this.selectedOrder.id, this.selectedStatus).subscribe({
          next: () => { this.toast.success('Status updated'); this.closeStatusModal(); this.loadOrders(); },
          error: (err: any) => this.toast.error(err?.error?.message || err?.message || 'Failed to update status')
        })
      : this.toast.error('Status update not available');
  }

  // Approve modal state
  showApproveModal = false;
  approvePayload: any = {
    purchaseOrderId: 0,
    quotationId: 0,
    discountType: 'AMOUNT',
    discountValue: 0,
    taxRate: 0
  };

  openApproveModal(order: PurchaseOrder) {
    this.selectedOrder = order;
    this.approvePayload = {
      purchaseOrderId: (order as any)?.id || 0,
      quotationId: 0,
      discountType: 'AMOUNT',
      discountValue: 0,
      taxRate: 0
    };
    this.showApproveModal = true;
  }

  closeApproveModal() { this.showApproveModal = false; }

  approveOrder() {
    if (!this.approvePayload.purchaseOrderId) return;
    this.orderService.approveOrder(this.approvePayload).subscribe({
      next: () => {
        this.toast.success('Purchase order approved successfully');
        this.closeApproveModal();
        this.loadOrders();
      },
      error: (err: any) => this.toast.error(err?.error?.message || err?.message || 'Failed to approve purchase order')
    });
  }

  // Clear modal state
  showClearModal = false;
  clearId: number = 0;

  openClearModal(order: PurchaseOrder) {
    this.selectedOrder = order;
    this.clearId = (order as any)?.id || 0;
    this.showClearModal = true;
  }

  closeClearModal() { this.showClearModal = false; }

  clearOrder() {
    if (!this.clearId) return;
    this.orderService.clearOrder(this.clearId).subscribe({
      next: () => {
        this.toast.success('Purchase order cleared successfully');
        this.closeClearModal();
        this.loadOrders();
      },
      error: (err: any) => this.toast.error(err?.error?.message || err?.message || 'Failed to clear purchase order')
    });
  }

  // Receive modal state
  showReceiveModal = false;
  receivePayload: any = {
    purchaseOrderId: 0,
    receiveItems: [
      { purchaseItemId: 0, quantityReceived: 0, quantityDamaged: 0, expirationDate: '' }
    ]
  };

  openReceiveModal(order: PurchaseOrder) {
    this.selectedOrder = order;
    this.receivePayload = {
      purchaseOrderId: (order as any)?.id || 0,
      receiveItems: [
        { purchaseItemId: 0, quantityReceived: 0, quantityDamaged: 0, expirationDate: '' }
      ]
    };
    this.showReceiveModal = true;
  }

  closeReceiveModal() { this.showReceiveModal = false; }

  addReceiveItem() {
    this.receivePayload.receiveItems.push({ purchaseItemId: 0, quantityReceived: 0, quantityDamaged: 0, expirationDate: '' });
  }

  removeReceiveItem(index: number) {
    if (this.receivePayload.receiveItems.length > 1) {
      this.receivePayload.receiveItems.splice(index, 1);
    }
  }

  submitReceive() {
    if (!this.receivePayload.purchaseOrderId) return;
    this.orderService.receiveOrder(this.receivePayload).subscribe({
      next: () => {
        this.toast.success('Items received successfully');
        this.closeReceiveModal();
        this.loadOrders();
      },
      error: (err: any) => this.toast.error(err?.error?.message || err?.message || 'Failed to receive items')
    });
  }

}
