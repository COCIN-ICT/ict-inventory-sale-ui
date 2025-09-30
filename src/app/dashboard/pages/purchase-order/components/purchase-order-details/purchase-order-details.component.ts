import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseOrderService } from '../../../../../services/purchase-order.service';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-purchase-order-details',
  templateUrl: './purchase-order-details.component.html',
  styleUrls: ['./purchase-order-details.component.css']
})
export class PurchaseOrderDetailsComponent implements OnInit {
  order: any = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseOrderService: PurchaseOrderService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.isLoading = false;
      this.toast.error('Invalid purchase order id');
      this.router.navigate(['/home/purchase-order']);
      return;
    }
    this.loadOrderDetails(id);
  }

  loadOrderDetails(id: number): void {
    this.isLoading = true;
    this.purchaseOrderService.getOrderById(id).subscribe({
      next: (res: any) => {
        this.order = res?.data || res;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.toast.error(err?.error?.message || err?.message || 'Failed to load purchase order');
        this.isLoading = false;
        this.router.navigate(['/home/purchase-order']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/home/purchase-order']);
  }
}
