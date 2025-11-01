import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SalesOrderService } from '../../../../services/sales-order.service';

@Component({
  selector: 'app-sales-order-create',
  templateUrl: './sales-order-create.component.html',
})
export class SalesOrderCreateComponent {
  model: any = {
    items: [],
    customerRequest: {
      name: '',
      email: '',
      phone: '',
      address: ''
    }
  };
  saving = false;
  showValidation = false;
  successMessage = '';
  errorMessage = '';

  constructor(private svc: SalesOrderService, private router: Router) {}

  save() {
    this.showValidation = true;
    
    // Check if required fields are filled
    if (!this.model.customerRequest.name || !this.model.customerRequest.email || 
        !this.model.customerRequest.phone || !this.model.customerRequest.address) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    
    this.svc.create(this.model).subscribe({
      next: () => {
        this.successMessage = 'Sales order created successfully!';
        setTimeout(() => {
          this.router.navigate(['/home/sales-order']);
        }, 1500);
      },
      error: (error) => {
        this.saving = false;
        this.errorMessage = 'Failed to create sales order. Please try again.';
        console.error('Error creating sales order:', error);
      }
    });
  }

  cancelCreate() {
    this.router.navigate(['/home/sales-order']);
  }
}