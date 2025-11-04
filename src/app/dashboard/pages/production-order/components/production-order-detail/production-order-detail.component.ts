import { Component } from '@angular/core';
import { ToastService } from '../../../../../services/toast.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductionOrderService } from '../../../../../services/production-order.service';
import { ProductionInputItemService } from '../../../../../services/production-input-item.service';
import { ProductionOrderResponse as ProductionOrder } from '../../../../../api/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemService } from '../../../../../services/item.service';


@Component({
  selector: 'app-production-order-detail',
  templateUrl: './production-order-detail.component.html',
  styleUrls: ['./production-order-detail.component.css']
})
export class ProductionOrderDetailComponent {
  isLoading: boolean = true;
  errorMessage: string = '';
  orderId!: number;
  productionOrder: ProductionOrder | null = null;

  showAddModal = false;
  addInputItemForm!: FormGroup;

   items: any[] = [];

  constructor(
    private productionOrdersService: ProductionOrderService,
    private productionInputItemService: ProductionInputItemService,
    private itemService: ItemService,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProductionOrder();
    this.loadItems();

    this.addInputItemForm = this.fb.group({
      itemId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
    })
  }

  loadProductionOrder(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productionOrdersService.getProductionOrder(this.orderId).subscribe({
      next: (res: any) => {
        this.productionOrder = res.data || res.result || res || null;
        this.isLoading = false;
        console.log('Production Order', this.productionOrder);
      },
      error: (err) => {
        console.error('Error loading production order', err);
        this.errorMessage = 'Failed to load production order.';
        this.productionOrder = null;
        this.isLoading = false;
      }
    });
  }

  loadItems(): void {
    this.itemService.getAllItems().subscribe({
      next: (res: any) => {
        this.items = res.data || res.result || res || [];
        console.log('Available items:', this.items);
      },
      error: (err) => {
        console.error('Error loading items', err);
        this.toast.error('Failed to load items.');
      }
    });
  }

  openAddModal() {
    this.showAddModal = true;
    this.addInputItemForm.reset();
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  submitAddInputItem() {
    if (!this.productionOrder || this.addInputItemForm.invalid) return;

    const payload = {
      productionOrderId: this.orderId,
      itemId: this.addInputItemForm.value.itemId,
      quantity: this.addInputItemForm.value.quantity
    };
    
    this.productionInputItemService.addInputItem(payload).subscribe({
      next: ()=> {
        this.toast.success('Input item added successfully!');
        this.closeAddModal();
        this.loadProductionOrder();
      },
      error: (err) => {
        console.error('Error adding input item', err);
        this.toast.error('Failed to add input item.');
      }
    });
  }





  deleteInputItem(itemId: number) {
    this.productionInputItemService.deleteInputItem(itemId).subscribe({
      next: () => {
        this.toast.success('Input item deleted.');
        this.loadProductionOrder();
      },
      error: (err) => {
        console.error('Error deleting input item', err);
        this.toast.error('Failed to delete input item.');
      }
    });
  }

  // Vet
vetOrder() {
  if (!this.productionOrder) return;
  this.isLoading = true;

  this.productionOrdersService.vetProductionOrder(this.orderId).subscribe({
    next: () => {
      this.toast.success('Order vetted successfully!');
      this.loadProductionOrder();
    },
    error: (err) => {
      console.error('Error vetting order', err);
      this.toast.error('Failed to vet order.');
      this.isLoading = false;
    }
  });
}

// Approve
approveOrder() {
  if (!this.productionOrder) return;
  this.isLoading = true;

  this.productionOrdersService.approveProductionOrder(this.orderId).subscribe({
    next: () => {
      this.toast.success('Order approved successfully!');
      this.loadProductionOrder();
    },
    error: (err) => {
      console.error('Error approving order', err);
      this.toast.error('Failed to approve order.');
      this.isLoading = false;
    }
  });
}

// Dispense
dispenseOrder() {
  if (!this.productionOrder) return;
  this.isLoading = true;

  this.productionOrdersService.dispenseProductionOrder(this.orderId).subscribe({
    next: () => {
      this.toast.success('Order dispensed successfully!');
      this.loadProductionOrder();
    },
    error: (err) => {
      console.error('Error dispensing order', err);
      this.toast.error('Failed to dispense order.');
      this.isLoading = false;
    }
  });
}

// Finish
finishOrder() {
  if (!this.productionOrder) return;
  this.isLoading = true;

  this.productionOrdersService.finishProductionOrder(this.orderId).subscribe({
    next: () => {
      this.toast.success('Order finished successfully!');
      this.loadProductionOrder();
    },
    error: (err) => {
      console.error('Error finishing order', err);
      this.toast.error('Failed to finish order.');
      this.isLoading = false;
    }
  });
}

canAddItems(): boolean {
  return this.productionOrder?.status !== 'DISPENSED' && 
         this.productionOrder?.status !== 'COMPLETED';
}



  
}
