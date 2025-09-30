import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { PurchaseItemService } from '../../../../../services/purchase-item.service';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-purchase-item-form',
  templateUrl: './purchase-item-form.component.html',
  styleUrl: './purchase-item-form.component.css'
})
export class PurchaseItemFormComponent {

  form!: FormGroup;

  constructor(private fb: FormBuilder, private purchaseItemService: PurchaseItemService, private toast: ToastService) {}

  private initializeForm(): void {
    this.form = this.fb.group({
      itemId: [0, Validators.required],
      quantity: [0.001, Validators.required],
      unitPrice: [0, Validators.required],
      purchaseOrderId: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  onSubmit() {
    if (this.form.valid) {
      const itemToSubmit = {...this.form.value};
      this.purchaseItemService.createPurchaseItem(itemToSubmit).subscribe({
        next: (response) => {
          console.log('Purchase item created successfully!', response);
          this.toast.success('Purchase item created successfully');
          this.form.reset();
        },
        error: (err) => {
          console.error('Error creating purchase item:', err);
        }
      });
    }
  }
}