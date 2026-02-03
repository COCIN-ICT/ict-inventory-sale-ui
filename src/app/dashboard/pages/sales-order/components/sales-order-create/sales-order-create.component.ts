import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesOrderService, SalesOrderRequest } from '../../../../../services/sales-order.service';
import { CustomerService } from '../../../../../services/customers.service';
import { ItemService } from '../../../../../services/item.service';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-sales-order-create',
  templateUrl: './sales-order-create.component.html',
  styleUrls: ['./sales-order-create.component.css']
})
export class SalesOrderCreateComponent implements OnInit {
  form: FormGroup;
  customerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  
  // Customer selection
  customers: any[] = [];
  selectedCustomerId: number | null = null;
  createNewCustomer = false;
  
  // Items
  items: any[] = [];
  selectedItems: Array<{ itemId: number; quantity: number; item?: any }> = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private salesOrderService: SalesOrderService,
    private customerService: CustomerService,
    private itemService: ItemService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      customerId: [null],
      customerRequest: [null]
    });

    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      email: ['']
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
    this.loadItems();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (res: any) => {
        this.customers = Array.isArray(res) ? res : (res?.data || res?.content || []);
      },
      error: (err: any) => {
        console.error('Error loading customers:', err);
      }
    });
  }

  loadItems(): void {
    this.itemService.getAllItems().subscribe({
      next: (res: any) => {
        this.items = Array.isArray(res) ? res : (res?.data || res?.content || []);
      },
      error: (err: any) => {
        console.error('Error loading items:', err);
      }
    });
  }

  toggleCustomerMode(): void {
    this.createNewCustomer = !this.createNewCustomer;
    if (this.createNewCustomer) {
      this.selectedCustomerId = null;
      this.form.patchValue({ customerId: null });
    } else {
      this.customerForm.reset();
      this.form.patchValue({ customerRequest: null });
    }
  }

  addItem(): void {
    this.selectedItems.push({ itemId: 0, quantity: 1 });
  }

  removeItem(index: number): void {
    this.selectedItems.splice(index, 1);
  }

  onItemChange(index: number, itemId: number): void {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      this.selectedItems[index].item = item;
      this.selectedItems[index].itemId = itemId;
    }
  }

  submit(): void {
    if (this.selectedItems.length === 0) {
      this.toast.error('Please add at least one item');
      return;
    }

    if (this.createNewCustomer) {
      if (this.customerForm.invalid) {
        this.toast.error('Please fill in all required customer fields');
        return;
      }
    } else {
      if (!this.selectedCustomerId) {
        this.toast.error('Please select a customer');
        return;
      }
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload: SalesOrderRequest = {
      items: this.selectedItems.map(item => ({
        itemId: item.itemId,
        quantity: item.quantity
      })),
      customerId: this.createNewCustomer ? undefined : this.selectedCustomerId!,
      customerRequest: this.createNewCustomer ? {
        name: this.customerForm.value.name,
        phone: this.customerForm.value.phone,
        address: this.customerForm.value.address,
        email: this.customerForm.value.email || undefined
      } : undefined
    };

    this.salesOrderService.create(payload).subscribe({
      next: (res: any) => {
        const id = res?.id || res?.data?.id || res?.result?.id;
        this.toast.success('Sales order created successfully');
        if (id) {
          this.router.navigate([`/home/pos/sales-orders/details/${id}`]);
        } else {
          this.toast.error('Order created but ID not found');
          this.router.navigate(['/home/pos/sales-orders/list']);
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = err?.error?.message || err?.message || 'Failed to create sales order';
        this.toast.error(this.errorMessage);
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/home/pos/sales-orders/list']);
  }
}
