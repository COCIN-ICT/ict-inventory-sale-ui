import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseItemService } from '../../../../../services/purchase-item.service';
import { ToastService } from '../../../../../services/toast.service';
import { PurchaseItem, PurchaseItemResponse } from '../../purchase-item.model';

@Component({
  selector: 'app-purchase-item-form',
  templateUrl: './purchase-item-form.component.html',
  styleUrl: './purchase-item-form.component.css'
})
export class PurchaseItemFormComponent implements OnInit {
  form!: FormGroup;
  bulkForm!: FormGroup;
  isEditMode = false;
  purchaseItemId?: number;
  isBulkMode = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private purchaseItemService: PurchaseItemService,
    private toast: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  private initializeForm(): void {
    this.form = this.fb.group({
      itemId: [0, [Validators.required, Validators.min(1)]],
      quantity: [0.001, [Validators.required, Validators.min(0.001)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      purchaseOrderId: [0, [Validators.required, Validators.min(1)]]
    });
  }

  private initializeBulkForm(): void {
    this.bulkForm = this.fb.group({
      items: this.fb.array([this.createBulkItemFormGroup()])
    });
  }

  private createBulkItemFormGroup(): FormGroup {
    return this.fb.group({
      itemId: [0, [Validators.required, Validators.min(1)]],
      quantity: [0.001, [Validators.required, Validators.min(0.001)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      purchaseOrderId: [0, [Validators.required, Validators.min(1)]]
    });
  }

  get bulkItems(): FormArray {
    return this.bulkForm.get('items') as FormArray;
  }

  addBulkItem(): void {
    this.bulkItems.push(this.createBulkItemFormGroup());
  }

  removeBulkItem(index: number): void {
    if (this.bulkItems.length > 1) {
      this.bulkItems.removeAt(index);
    }
  }

  ngOnInit(): void {
    this.initializeForm();
    this.initializeBulkForm();
    
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.purchaseItemId = +id;
        this.isEditMode = true;
        this.loadPurchaseItem(this.purchaseItemId);
      }
    });
  }

  loadPurchaseItem(id: number): void {
    this.loading = true;
    // Note: There's no GET /purchase/item/{id} endpoint in the API
    // This is a workaround that fetches all items and finds the one by id
    // In production, you'd want a dedicated getById endpoint
    this.purchaseItemService.getPurchaseItems().subscribe({
      next: (items: any[]) => {
        const item = items.find((i: any) => i.id === id);
        if (item) {
          this.form.patchValue({
            itemId: item.item?.id || item.itemId || 0,
            quantity: item.quantity || 0.001,
            unitPrice: item.unitPrice || 0,
            purchaseOrderId: item.purchaseOrderId || 0
          });
        } else {
          this.toast.error('Purchase item not found');
          this.router.navigate(['/home/purchase-item']);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading purchase item:', err);
        this.toast.error('Failed to load purchase item');
        this.loading = false;
      }
    });
  }

  toggleBulkMode(): void {
    this.isBulkMode = !this.isBulkMode;
  }

  onSubmit(): void {
    if (this.isBulkMode) {
      this.onBulkSubmit();
      return;
    }

    if (this.form.valid) {
      this.loading = true;
      const itemToSubmit: PurchaseItem = {...this.form.value};

      if (this.isEditMode && this.purchaseItemId) {
        // Update existing item
        this.purchaseItemService.updatePurchaseItem(this.purchaseItemId, itemToSubmit).subscribe({
          next: (response) => {
            console.log('Purchase item updated successfully!', response);
            this.toast.success('Purchase item updated successfully');
            this.loading = false;
            this.router.navigate(['/home/purchase-item']);
          },
          error: (err) => {
            console.error('Error updating purchase item:', err);
            this.toast.error(err?.error?.message || 'Failed to update purchase item');
            this.loading = false;
          }
        });
      } else {
        // Create new item
        this.purchaseItemService.createPurchaseItem(itemToSubmit).subscribe({
          next: (response) => {
            console.log('Purchase item created successfully!', response);
            this.toast.success('Purchase item created successfully');
            this.form.reset();
            this.loading = false;
          },
          error: (err) => {
            console.error('Error creating purchase item:', err);
            this.toast.error(err?.error?.message || 'Failed to create purchase item');
            this.loading = false;
          }
        });
      }
    } else {
      this.markFormGroupTouched(this.form);
    }
  }

  onBulkSubmit(): void {
    if (this.bulkForm.valid) {
      this.loading = true;
      const items: PurchaseItem[] = this.bulkItems.value;

      this.purchaseItemService.createBulkPurchaseItems(items).subscribe({
        next: (response) => {
          console.log('Bulk purchase items created successfully!', response);
          this.toast.success(`${response.length} purchase items created successfully`);
          this.bulkForm.reset();
          this.initializeBulkForm(); // Reset to single item
          this.isBulkMode = false;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error creating bulk purchase items:', err);
          this.toast.error(err?.error?.message || 'Failed to create bulk purchase items');
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.bulkForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(item => {
          if (item instanceof FormGroup) {
            this.markFormGroupTouched(item);
          }
        });
      }
    });
  }
}