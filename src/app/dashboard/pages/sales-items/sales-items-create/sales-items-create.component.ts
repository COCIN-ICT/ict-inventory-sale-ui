import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemResponse, ItemService } from '../../../../services/item.service';
import { SalesOrderService } from '../../../../services/sales-order.service';
import { SalesItemService } from '../../../../services/sales-item.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-sales-items-create',
  templateUrl: './sales-items-create.component.html',
  styleUrls: ['./sales-items-create.component.css']
})
export class SalesItemsCreateComponent {
  items: ItemResponse[] = [];
  salesOrders: any[] = [];
  isSubmitting = false;

  form = this.fb.group({
    itemId: [null, Validators.required],
    salesOrderId: [null],
    quantity: [1, [Validators.required, Validators.min(1)]]
  });

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private salesOrderService: SalesOrderService,
    private salesItemService: SalesItemService,
    private toast: ToastService,
    private router: Router
  ) {
    this.loadDropdowns();
  }

  private loadDropdowns(): void {
    this.itemService.getAllItems().subscribe({
      next: (data) => (this.items = data),
      error: () => {}
    });

    this.salesOrderService.getAll().subscribe({
      next: (data) => (this.salesOrders = Array.isArray(data) ? data : (data?.content || [])),
      error: () => {}
    });
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const payload = {
      itemId: Number(this.form.value.itemId),
      salesOrderId: this.form.value.salesOrderId ? Number(this.form.value.salesOrderId) : null,
      quantity: Number(this.form.value.quantity)
    };

    this.salesItemService.create(payload).subscribe({
      next: () => {
        this.toast.success('Sales item created');
        this.router.navigate(['/home/sales-items']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toast.error('Failed to create sales item');
      }
    });
  }
}


