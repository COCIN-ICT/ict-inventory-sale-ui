import { Component } from '@angular/core';
import { PurchaseOrder } from '../../purchase-order.model';
import { PurchaseOrderService } from '../../../../../services/purchase-order.service';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrl: './purchase-order-list.component.css'
})
export class PurchaseOrderListComponent {
  purchaseOrders: PurchaseOrder[] = [];
  isLoading: boolean = true;
  constructor(private orderService: PurchaseOrderService, private toast: ToastService) { }

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


}
