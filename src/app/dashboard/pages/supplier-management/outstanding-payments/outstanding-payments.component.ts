import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../../../services/supplier.service';

@Component({
  selector: 'app-outstanding-payments',
  templateUrl: './outstanding-payments.component.html',
  styleUrl: './outstanding-payments.component.css'
})
export class OutstandingPaymentsComponent implements OnInit {
  suppliers: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(private supplierService: SupplierService) { }

  ngOnInit(): void {
    this.loadOutstandingPayments();
  }

  loadOutstandingPayments() {
    this.loading = true;
    this.errorMessage = '';

    // Load all suppliers - outstanding payments can be filtered based on API
    this.supplierService.getAllSuppliers().subscribe({
      next: (res: any) => {
        console.log('Outstanding payments response:', res);
        this.suppliers = res.data || res.suppliers || res.result || res || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading outstanding payments:', error);
        this.errorMessage = 'Failed to load outstanding payments. Please try again.';
        this.loading = false;
      }
    });
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}

