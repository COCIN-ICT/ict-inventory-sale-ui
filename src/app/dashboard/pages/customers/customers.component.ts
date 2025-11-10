import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customers.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
  customers: any[] = [];

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe({
      next: (customers: any) => {
        this.customers = customers;
        console.log('Customers loaded:', customers);
      },
      error: (error) => {
        console.error('Error loading customers:', error);
      }
    });
  
    
  }

}
