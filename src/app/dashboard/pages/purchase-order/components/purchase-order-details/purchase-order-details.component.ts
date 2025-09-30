import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PurchaseOrderService } from '../../../../../services/purchase-order.service';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-purchase-order-details',
  templateUrl: './purchase-order-details.component.html',
  styleUrl: './purchase-order-details.component.css'
})
export class PurchaseOrderDetailsComponent {
  constructor(
    private route: ActivatedRoute,
    private purchaseOrderService: PurchaseOrderService,
    private toast: ToastService
  ) {}

  isLoading = true;
  order: any;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.isLoading = false;
      this.toast.error('Invalid purchase order id');
      return;
    }
    this.purchaseOrderService.getOrderById(id).subscribe({
      next: (res: any) => {
        this.order = res?.data || res;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.toast.error(err?.error?.message || err?.message || 'Failed to load purchase order');
        this.isLoading = false;
      }
    });
  }
}
