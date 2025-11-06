import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../../../services/supplier.service';

@Component({
  selector: 'app-supplier-history',
  templateUrl: './supplier-history.component.html',
  styleUrl: './supplier-history.component.css'
})
export class SupplierHistoryComponent implements OnInit {
  suppliers: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(private supplierService: SupplierService) { }

  ngOnInit(): void {
    this.loadSupplierHistory();
  }

  loadSupplierHistory() {
    this.loading = true;
    this.errorMessage = '';

    // Load all suppliers for history (can be filtered later based on API)
    this.supplierService.getAllSuppliers().subscribe({
      next: (res: any) => {
        console.log('Supplier history response:', res);
        this.suppliers = res.data || res.suppliers || res.result || res || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading supplier history:', error);
        this.errorMessage = 'Failed to load supplier history. Please try again.';
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
}

