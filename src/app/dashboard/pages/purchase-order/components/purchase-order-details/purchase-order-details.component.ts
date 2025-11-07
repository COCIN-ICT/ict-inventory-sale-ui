import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PurchaseOrderService } from '../../../../../services/purchase-order.service';
import { PurchaseItemService } from '../../../../../services/purchase-item.service';
import { ItemService } from '../../../../../services/item.service';
import { ToastService } from '../../../../../services/toast.service';

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
  addPurchaseItemForm!: FormGroup;
  items: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseOrderService: PurchaseOrderService,
    private purchaseItemService: PurchaseItemService,
    private itemService: ItemService,
    private toast: ToastService,
    private fb: FormBuilder
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

    this.addPurchaseItemForm = this.fb.group({
      itemId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      unitPrice: ['', [Validators.required, Validators.min(0)]]
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
}
