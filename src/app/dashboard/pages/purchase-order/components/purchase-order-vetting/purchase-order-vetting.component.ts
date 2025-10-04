import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PurchaseOrderService } from '../../../../../services/purchase-order.service';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-purchase-order-vetting',
  templateUrl: './purchase-order-vetting.component.html',
  styleUrls: ['./purchase-order-vetting.component.css']
})
export class PurchaseOrderVettingComponent {
  constructor(
    private fb: FormBuilder,
    private purchaseOrderService: PurchaseOrderService,
    private toast: ToastService
  ) {}

  form = this.fb.group({
    id: [null, [Validators.required, Validators.min(1)]]
  });

  loading = false;
  status?: string;

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const id = Number(this.form.value.id);
    // First fetch current status
    this.purchaseOrderService.getOrderById(id).subscribe({
      next: (order: any) => {
        this.status = order?.status || order?.data?.status;
        if (this.status && this.status !== 'PENDING') {
          this.loading = false;
          this.toast.error(`Cannot vet. Current status is ${this.status}.`);
          return;
        }
        // Proceed to vet
        this.purchaseOrderService.vetOrder(id).subscribe({
          next: () => {
            this.loading = false;
            this.toast.success('Purchase order vetted successfully');
          },
          error: (err: any) => {
            this.loading = false;
            this.toast.error(err?.error?.message || err?.message || 'Failed to vet purchase order');
          }
        });
      },
      error: (err: any) => {
        this.loading = false;
        this.toast.error(err?.error?.message || err?.message || 'Failed to load purchase order');
      }
    });
  }
}


