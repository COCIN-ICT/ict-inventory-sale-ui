import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PurchaseOrderService } from '../../../../../services/purchase-order.service';
import { ToastService } from '../../../../../services/toast.service';
import { ItemService, ItemResponse } from '../../../../../services/item.service';
import { SupplierService, Supplier } from '../../../../../services/supplier.service';
import { PurchaseItemService } from '../../../../../services/purchase-item.service';
import { PurchaseQuotationService } from '../../../../../services/purchase-quotation.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-purchase-order-create',
  templateUrl: './purchase-order-create.component.html',
  styleUrls: ['./purchase-order-create.component.css']
})
export class PurchaseOrderCreateComponent {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private orderService: PurchaseOrderService,
    private toast: ToastService,
    private itemService: ItemService,
    private supplierService: SupplierService,
    private purchaseItemService: PurchaseItemService,
    private purchaseQuotationService: PurchaseQuotationService
  ) {}

  form = this.fb.group({
    status: ['', Validators.required],
    orderDate: ['', Validators.required],
    subTotal: [0, [Validators.required, Validators.min(0)]],
    totalAmount: [0, [Validators.required, Validators.min(0)]]
  });

  loading = false;
  successMessage = '';
  errorMessage = '';
  showItemModal = false;
  showQuotationModal = false;
  itemsList: ItemResponse[] = [];
  suppliersList: Supplier[] = [];
  purchaseOrderId?: number;
  
  // Local storage for items and quotations added via modals
  addedItems: any[] = [];
  addedQuotations: any[] = [];

  ngOnInit(): void {
    this.itemService.getAllItems().subscribe(res => this.itemsList = res || []);
    this.supplierService.getAllSuppliers().subscribe(res => this.suppliersList = res || []);
    const idParam = this.route.snapshot.paramMap.get('id');
    this.purchaseOrderId = idParam ? Number(idParam) : undefined;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getFieldError(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'This field is required.';
    if (control.errors['min']) return 'Value must be greater than or equal to 0.';
    return 'Invalid field value.';
  }


  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Construct payload to match API - use locally stored items and quotations
    const payload = {
      status: this.form.value.status,
      orderDate: this.form.value.orderDate,
      subTotal: this.form.value.subTotal,
      totalAmount: this.form.value.totalAmount,
      quotations: this.addedQuotations.map(q => ({
        supplierId: q.supplierId,
        amount: q.amount
      })),
      items: this.addedItems.map(i => ({
        itemId: i.itemId,
        quantity: i.quantity,
        unitPrice: i.unitPrice
      }))
    };

    this.orderService.createOrder(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.successMessage = 'Purchase order created successfully';
        this.toast.success('Purchase order created');
        // Navigate to purchase order list page
        this.router.navigate(['/home/purchase-order']);
      },
      error: (err: any) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || err?.message || 'Failed to create purchase order';
        this.toast.error(this.errorMessage);
      }
    });
  }

  openItemModal(): void { this.showItemModal = true; }
  closeItemModal(): void { this.showItemModal = false; }
  openQuotationModal(): void { this.showQuotationModal = true; }
  closeQuotationModal(): void { this.showQuotationModal = false; }

  addPurchaseItem(itemId: number, quantity: number, unitPrice: number): void {
    if (!this.purchaseOrderId) {
      this.toast.error('Missing purchase order id');
      return;
    }
    const payload = { itemId, quantity, unitPrice, purchaseOrderId: this.purchaseOrderId };
    this.purchaseItemService.createPurchaseItem(payload).subscribe({
      next: (res: any) => {
        this.toast.success('Item added');
        this.closeItemModal();
        this.router.navigate(['../', this.purchaseOrderId]);
      },
      error: (err: any) => {
        this.toast.error(err?.error?.message || err?.message || 'Failed to add item');
      }
    });
  }

  addPurchaseItemWithId(purchaseOrderId: number, itemId: number, quantity: number, unitPrice: number): void {
    if (!purchaseOrderId) {
      this.toast.error('Purchase Order ID is required');
      return;
    }
    if (!itemId || !quantity || !unitPrice) {
      this.toast.error('Please fill all item fields');
      return;
    }
    
    // Store item locally instead of calling API immediately
    const item = {
      itemId,
      quantity,
      unitPrice,
      purchaseOrderId,
      itemName: this.itemsList.find(i => i.id === itemId)?.name || 'Unknown Item'
    };
    
    this.addedItems.push(item);
    this.toast.success('Item added to order');
    this.closeItemModal();
  }

  addPurchaseQuotationWithId(purchaseOrderId: number, supplierId: number, amount: number, invoiceFile?: File): void {
    if (!purchaseOrderId) {
      this.toast.error('Purchase Order ID is required');
      return;
    }
    if (!supplierId || !amount) {
      this.toast.error('Please fill all quotation fields');
      return;
    }
    
    // Store quotation locally instead of calling API immediately
    const quotation = {
      supplierId,
      amount,
      purchaseOrderId,
      invoiceFile,
      supplierName: this.suppliersList.find(s => s.id === supplierId)?.name || 'Unknown Supplier'
    };
    
    this.addedQuotations.push(quotation);
    this.toast.success('Quotation added to order');
    this.closeQuotationModal();
  }

  removeAddedItem(index: number): void {
    this.addedItems.splice(index, 1);
  }

  removeAddedQuotation(index: number): void {
    this.addedQuotations.splice(index, 1);
  }

  onCancel(): void {
    this.router.navigate(['/home/purchase-order']);
  }
}


