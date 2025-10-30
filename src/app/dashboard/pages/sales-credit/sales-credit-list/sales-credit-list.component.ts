import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SalesCreditService, CreditResponse, ApproveCreditRequest } from '../../../../services/sales-credit.service';
import { BankAccountService } from '../../../../services/bank-account.service';

@Component({
  selector: 'app-sales-credit-list',
  templateUrl: './sales-credit-list.component.html',
  styleUrls: ['./sales-credit-list.component.css']
})
export class SalesCreditListComponent implements OnInit {
  credits: CreditResponse[] = [];
  bankAccounts: any[] = [];
  loading = false;
  
  // Modal states
  showApproveModal = false;
  showApproveByIdModal = false;
  
  // Approve modal data
  approveData: ApproveCreditRequest = {
    creditId: 0,
    amount: 0,
    paymentMethod: 'CASH',
    accountId: 0
  };
  
  // Approve by ID modal data
  creditIdToApprove = 0;
  
  // Messages
  successMessage = '';
  errorMessage = '';

  constructor(
    private salesCreditService: SalesCreditService,
    private bankAccountService: BankAccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCredits();
    this.loadBankAccounts();
  }

  loadCredits(): void {
    this.loading = true;
    this.salesCreditService.getAllCredits().subscribe({
      next: (res: any) => {
        this.credits = Array.isArray(res) ? res : (res?.data || res);
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        console.error('Error loading credits:', error);
      }
    });
  }

  loadBankAccounts(): void {
    this.bankAccountService.getBankAccounts().subscribe({
      next: (res: any) => {
        this.bankAccounts = Array.isArray(res) ? res : (res?.data || res);
      },
      error: (error: any) => {
        console.error('Error loading bank accounts:', error);
      }
    });
  }

  openApproveModal(credit: CreditResponse): void {
    this.approveData = {
      creditId: credit.id,
      amount: credit.amount,
      paymentMethod: 'CASH',
      accountId: 0
    };
    this.showApproveModal = true;
    this.errorMessage = '';
  }

  openApproveByIdModal(creditId: number): void {
    this.creditIdToApprove = creditId;
    this.showApproveByIdModal = true;
    this.errorMessage = '';
  }

  closeModals(): void {
    this.showApproveModal = false;
    this.showApproveByIdModal = false;
    this.errorMessage = '';
  }

  approveCreditWithPayment(): void {
    if (!this.approveData.amount || !this.approveData.accountId) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.salesCreditService.approveCreditWithPayment(this.approveData).subscribe({
      next: () => {
        this.successMessage = 'Credit approved with payment successfully!';
        this.closeModals();
        this.loadCredits();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to approve credit. Please try again.';
        console.error('Error approving credit:', error);
      }
    });
  }

  approveCreditById(): void {
    this.salesCreditService.approveCreditById(this.creditIdToApprove).subscribe({
      next: () => {
        this.successMessage = 'Credit approved successfully!';
        this.closeModals();
        this.loadCredits();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to approve credit. Please try again.';
        console.error('Error approving credit:', error);
      }
    });
  }

  viewCredit(id: number): void {
    this.router.navigate(['/home/sales-credit', id]);
  }

  goToPending(): void {
    this.router.navigate(['/home/sales-credit/pending']);
  }

  getStatusColor(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
