import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SalesCreditService, CreateCreditRequest } from '../../../../services/sales-credit.service';
import { SalesOrderService } from '../../../../services/sales-order.service';
import { BankAccountService } from '../../../../services/bank-account.service';

@Component({
  selector: 'app-sales-credit-create',
  templateUrl: './sales-credit-create.component.html',
  styleUrls: ['./sales-credit-create.component.css']
})
export class SalesCreditCreateComponent implements OnInit {
  model: CreateCreditRequest = {
    salesOrderId: 0,
    amount: 0,
    expectedRepaymentDate: ''
  };

  salesOrders: any[] = [];
  bankAccounts: any[] = [];
  saving = false;
  showValidation = false;
  successMessage = '';
  errorMessage = '';
  loadingSalesOrders = false;
  loadingBankAccounts = false;

  constructor(
    private salesCreditService: SalesCreditService,
    private salesOrderService: SalesOrderService,
    private bankAccountService: BankAccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSalesOrders();
    this.loadBankAccounts();
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.model.expectedRepaymentDate = tomorrow.toISOString().slice(0, 16);
  }

  loadSalesOrders(): void {
    this.loadingSalesOrders = true;
    this.salesOrderService.getAll().subscribe({
      next: (res: any) => {
        this.salesOrders = Array.isArray(res) ? res : (res?.data || res);
        this.loadingSalesOrders = false;
      },
      error: (error: any) => {
        console.error('Error loading sales orders:', error);
        this.loadingSalesOrders = false;
        this.errorMessage = 'Failed to load sales orders. Please try again.';
      }
    });
  }

  loadBankAccounts(): void {
    this.loadingBankAccounts = true;
    this.bankAccountService.getBankAccounts().subscribe({
      next: (res: any) => {
        this.bankAccounts = Array.isArray(res) ? res : (res?.data || res);
        this.loadingBankAccounts = false;
      },
      error: (error: any) => {
        console.error('Error loading bank accounts:', error);
        this.loadingBankAccounts = false;
      }
    });
  }

  save(): void {
    this.showValidation = true;
    
  
    if (!this.model.salesOrderId || !this.model.amount || !this.model.expectedRepaymentDate) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    if (this.model.amount <= 0) {
      this.errorMessage = 'Amount must be greater than 0';
      return;
    }

    if (this.model.salesOrderId === 0) {
      this.errorMessage = 'Please select a valid sales order';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    
    this.salesCreditService.createCredit(this.model).subscribe({
      next: (res: any) => {
        this.successMessage = 'Sales credit created successfully!';
        this.saving = false;
        setTimeout(() => {
          this.router.navigate(['/home/sales-credit']);
        }, 1500);
      },
      error: (error: any) => {
        this.saving = false;
        this.errorMessage = 'Failed to create sales credit. Please try again.';
        console.error('Error creating sales credit:', error);
      }
    });
  }

  cancelCreate(): void {
    this.router.navigate(['/home/sales-credit']);
  }

  refreshSalesOrders(): void {
    this.loadSalesOrders();
  }
}
