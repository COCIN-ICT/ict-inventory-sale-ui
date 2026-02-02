import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PurchaseOrderService } from '../../../../../services/purchase-order.service';
import { PurchaseItemService } from '../../../../../services/purchase-item.service';
import { PurchaseQuotationService } from '../../../../../services/purchase-quotation.service';
import { ItemService } from '../../../../../services/item.service';
import { SupplierService } from '../../../../../services/supplier.service';
import { ToastService } from '../../../../../services/toast.service';
import { AuthService } from '../../../../../auth/auth.service';

@Component({
  selector: 'app-purchase-order-details',
  templateUrl: './purchase-order-details.component.html',
  styleUrls: ['./purchase-order-details.component.css']
})
export class PurchaseOrderDetailsComponent implements OnInit {
  order: any = null;
  isLoading = true;
  errorMessage: string = '';
  orderId!: number;

  showAddModal = false;
  showCreateQuotationModal = false;
  addPurchaseItemForm!: FormGroup;
  createQuotationForm!: FormGroup;
  items: any[] = [];
  suppliers: any[] = [];
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseOrderService: PurchaseOrderService,
    private purchaseItemService: PurchaseItemService,
    private purchaseQuotationService: PurchaseQuotationService,
    private itemService: ItemService,
    private supplierService: SupplierService,
    private toast: ToastService,
    private fb: FormBuilder,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.orderId) {
      this.isLoading = false;
      this.errorMessage = 'Invalid purchase order id';
      this.toast.error('Invalid purchase order id');
      this.router.navigate(['/home/purchase-order']);
      return;
    }
    
    this.loadOrderDetails(this.orderId);
    this.loadItems();
    this.loadSuppliers();

    this.addPurchaseItemForm = this.fb.group({
      itemId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      unitPrice: ['', [Validators.required, Validators.min(0)]]
    });

    this.createQuotationForm = this.fb.group({
      supplierId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  loadOrderDetails(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.purchaseOrderService.getOrderById(id).subscribe({
      next: (res: any) => {
        this.order = res?.data || res || null;
        this.isLoading = false;
        console.log('Purchase Order', this.order);
      },
      error: (err: any) => {
        console.error('Error loading purchase order', err);
        this.errorMessage = 'Failed to load purchase order.';
        this.order = null;
        this.isLoading = false;
        this.toast.error(err?.error?.message || err?.message || 'Failed to load purchase order');
      }
    });
  }

  loadItems(): void {
    this.itemService.getAllItems().subscribe({
      next: (res: any) => {
        this.items = res.data || res.result || res || [];
        console.log('Available items:', this.items);
      },
      error: (err: any) => {
        console.error('Error loading items', err);
        this.toast.error('Failed to load items.');
      }
    });
  }

  openAddModal(): void {
    this.showAddModal = true;
    this.addPurchaseItemForm.reset();
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  submitAddPurchaseItem(): void {
    if (!this.order || this.addPurchaseItemForm.invalid) return;

    const payload = {
      purchaseOrderId: this.orderId,
      itemId: Number(this.addPurchaseItemForm.value.itemId),
      quantity: Number(this.addPurchaseItemForm.value.quantity),
      unitPrice: Number(this.addPurchaseItemForm.value.unitPrice)
    };
    
    this.purchaseItemService.createPurchaseItemWithRequest(payload).subscribe({
      next: () => {
        this.toast.success('Purchase item added successfully!');
        this.closeAddModal();
        this.loadOrderDetails(this.orderId);
      },
      error: (err: any) => {
        console.error('Error adding purchase item', err);
        this.toast.error(err?.error?.message || err?.message || 'Failed to add purchase item.');
      }
    });
  }

  deletePurchaseItem(itemId: number): void {
    if (!confirm('Are you sure you want to delete this purchase item?')) {
      return;
    }

    this.purchaseItemService.deletePurchaseItem(itemId).subscribe({
      next: () => {
        this.toast.success('Purchase item deleted successfully.');
        this.loadOrderDetails(this.orderId);
      },
      error: (err: any) => {
        console.error('Error deleting purchase item', err);
        this.toast.error(err?.error?.message || err?.message || 'Failed to delete purchase item.');
      }
    });
  }

  canAddItems(): boolean {
    return this.order?.status !== 'CLEARED' && 
           this.order?.status !== 'COMPLETED' &&
           this.order?.status !== 'CANCELLED' &&
           this.order?.status !== 'REJECTED';
  }

  loadSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe({
      next: (res: any) => {
        this.suppliers = res.data || res.result || res || [];
        console.log('Available suppliers:', this.suppliers);
      },
      error: (err: any) => {
        console.error('Error loading suppliers', err);
        this.toast.error('Failed to load suppliers.');
      }
    });
  }

  // Vet Order
  vetOrder(): void {
    if (!this.order) return;
    if (!confirm('Are you sure you want to vet this purchase order?')) {
      return;
    }
    this.isLoading = true;

    this.purchaseOrderService.vetOrder(this.orderId).subscribe({
      next: () => {
        this.toast.success('Order vetted successfully!');
        this.loadOrderDetails(this.orderId);
      },
      error: (err: any) => {
        console.error('Error vetting order', err);
        this.toast.error(err?.error?.message || err?.message || 'Failed to vet order.');
        this.isLoading = false;
      }
    });
  }

  // Receive Order
  receiveOrder(): void {
    if (!this.order) return;
    if (!confirm('Are you sure you want to receive this purchase order?')) {
      return;
    }
    this.isLoading = true;

    const payload = {
      purchaseOrderId: this.orderId
    };

    this.purchaseOrderService.receiveOrder(payload).subscribe({
      next: () => {
        this.toast.success('Order received successfully!');
        this.loadOrderDetails(this.orderId);
      },
      error: (err: any) => {
        console.error('Error receiving order', err);
        this.toast.error(err?.error?.message || err?.message || 'Failed to receive order.');
        this.isLoading = false;
      }
    });
  }

  // Clear Order
  clearOrder(): void {
    if (!this.order) return;
    if (!confirm('Are you sure you want to clear this purchase order?')) {
      return;
    }
    this.isLoading = true;

    this.purchaseOrderService.clearOrder(this.orderId).subscribe({
      next: () => {
        this.toast.success('Order cleared successfully!');
        this.loadOrderDetails(this.orderId);
      },
      error: (err: any) => {
        console.error('Error clearing order', err);
        this.toast.error(err?.error?.message || err?.message || 'Failed to clear order.');
        this.isLoading = false;
      }
    });
  }

  // Approve Order
  approveOrder(): void {
    if (!this.order) return;
    if (!confirm('Are you sure you want to approve this purchase order?')) {
      return;
    }
    this.isLoading = true;

    const payload = {
      purchaseOrderId: this.orderId
    };

    this.purchaseOrderService.approveOrder(payload).subscribe({
      next: () => {
        this.toast.success('Order approved successfully!');
        this.loadOrderDetails(this.orderId);
      },
      error: (err: any) => {
        console.error('Error approving order', err);
        this.toast.error(err?.error?.message || err?.message || 'Failed to approve order.');
        this.isLoading = false;
      }
    });
  }

  // Purchase Quotation Methods
  openCreateQuotationModal(): void {
    this.showCreateQuotationModal = true;
    this.createQuotationForm.reset();
    this.selectedFile = null;
  }

  closeCreateQuotationModal(): void {
    this.showCreateQuotationModal = false;
    this.selectedFile = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  submitCreateQuotation(): void {
    if (!this.order || this.createQuotationForm.invalid) return;

    const payload = {
      supplierId: Number(this.createQuotationForm.value.supplierId),
      amount: Number(this.createQuotationForm.value.amount),
      purchaseOrderId: this.orderId,
      invoiceFile: this.selectedFile || undefined
    };

    this.isLoading = true;
    this.purchaseQuotationService.createPurchaseQuotationForOrder(payload).subscribe({
      next: () => {
        this.toast.success('Purchase quotation created successfully!');
        this.closeCreateQuotationModal();
        this.loadOrderDetails(this.orderId);
      },
      error: (err: any) => {
        console.error('Error creating purchase quotation', err);
        this.toast.error(err?.error?.message || err?.message || 'Failed to create purchase quotation.');
        this.isLoading = false;
      }
    });
  }

  viewQuotation(quotationId: number): void {
    this.router.navigate(['/home/purchase-quotation', quotationId]);
  }

  goBackToList(): void {
    this.router.navigate(['/home/purchase-order/list']);
  }
}
