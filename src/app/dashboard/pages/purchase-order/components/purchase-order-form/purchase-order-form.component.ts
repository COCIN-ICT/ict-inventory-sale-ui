import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { finalize, map } from 'rxjs/operators';
// Import your generated API services for Items and Suppliers
import { PurchaseOrderApiApiService, ItemApiApiService, SupplierApiApiService } from '../../../../../api/services';
import { ToastService } from '../../../../../services/toast.service';
import { Observable } from 'rxjs';
import { PurchaseItemRequest, PurchaseQuotationRequest } from '../../../../../api/models';
import { Item, Supplier } from '../../purchase-order.model';

@Component({
  selector: 'app-purchase-order-form',
  templateUrl: './purchase-order-form.component.html',
  styleUrls: ['./purchase-order-form.component.css']
})
export class PurchaseOrderFormComponent {

  purchaseOrderForm!: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  // New: Observables to hold API data for dropdowns
  suppliers$!: Observable<Supplier[]>;
  items$!: Observable<Item[]>;

  constructor(
    private fb: FormBuilder,
    private purchaseOrderApiService: PurchaseOrderApiApiService,
    //New: Inject the Item and Supplier API services
    private itemApiService: ItemApiApiService,
    private supplierApiService: SupplierApiApiService,
    private toast: ToastService,
    private dialogRef: MatDialogRef<PurchaseOrderFormComponent>
  ) {}

  ngOnInit(): void {
    this.purchaseOrderForm = this.fb.group({
      vendor: ['', Validators.required],
      order_date: ['', Validators.required],
      status: ['Pending', Validators.required],
    

      quotations: this.fb.array([]),
      items: this.fb.array([]),
    });

    //Fetch data for dropdowns
    // Assuming the API services have a method `getAll` to fetch all records
    this.items$ = this.itemApiService.getAll7({ status: 'Active' }).pipe(
      // Map ItemResponse[] to Item[] and ensure id is a number
      // (Assuming Item has the same fields as ItemResponse except id is required)
      // If more fields differ, map them accordingly
      // If id is missing, filter out such items
      map((items: any[]) =>
        items
          .filter(item => typeof item.id === 'number')
          .map(item => ({
            ...item,
            id: item.id as number
          }))
      )
    );
    this.suppliers$ = this.supplierApiService.getAll3().pipe(
      map((suppliers: any[]) =>
        suppliers
          .filter(supplier => typeof supplier.id === 'number')
          .map(supplier => ({
            ...supplier,
            id: supplier.id as number
          }))
      )
    );
    

    // Initialize with one empty quotation and item
    this.addQuotation();
    this.addItem();
  }

  // Inside PurchaseOrderFormComponent class

onFileSelected(event: Event, index: number): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    
    // Get the specific quotation FormGroup and set the value for 'invoiceFile'
    const quotationFormGroup = this.quotations.at(index) as FormGroup;
    quotationFormGroup.patchValue({
      invoiceFile: file // The file object is a Blob, matching your model
    });
  }
}

  get quotations(): FormArray {
    return this.purchaseOrderForm.get('quotations') as FormArray;
  }

  get items(): FormArray {
    return this.purchaseOrderForm.get('items') as FormArray;
  }

  

  private createQuotationFormGroup(): FormGroup {
    return this.fb.group({
      supplierId: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      invoiceFile: [null], // will hold a Blob (file upload), so no Validators.required
      // purchaseOrderId not needed here (the backend will attach it)
    });
  }

  private createItemFormGroup(): FormGroup {
    return this.fb.group({
      itemId: [null, Validators.required],
      quantity: [null, [Validators.required, Validators.min(0.001)]],
      unitPrice: [null, [Validators.required, Validators.min(0)]],
      // purchaseOrderId is optional and should be omitted here
    });
  }

  addQuotation(): void {
    this.quotations.push(this.createQuotationFormGroup());
  }

  removeQuotation(index: number): void {
    this.quotations.removeAt(index);
  }

  addItem(): void {
    this.items.push(this.createItemFormGroup());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  onSubmit(): void {
    if (this.purchaseOrderForm.invalid) {
      this.purchaseOrderForm.markAllAsTouched();
      this.toast.error('Please fill out all required fields correctly.');
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const formValue = this.purchaseOrderForm.value;

    // Map formValue into your request DTOs
    const items: PurchaseItemRequest[] = formValue.items.map((item: any) => ({
      itemId: item.itemId,
      quantity: item.quantity,
      unitPrice: item.unitPrice
    }));

    const quotations: PurchaseQuotationRequest[] = formValue.quotations.map((q: any) => ({
      supplierId: q.supplierId,
      amount: q.amount,
      invoiceFile: q.invoiceFile // should be a Blob from file input
    }));

    const payload = {
      ...formValue,
      items,
      quotations
    };

    console.log('Final payload:', payload);

    this.purchaseOrderApiService.createPurchaseOrder({ body: payload })
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.toast.success('Purchase order created successfully!');
          this.dialogRef.close('created');
        },
        error: (error) => {
          this.errorMessage = 'Failed to create purchase order. Please try again later.';
          this.toast.error(error.message || this.errorMessage);
        }
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
