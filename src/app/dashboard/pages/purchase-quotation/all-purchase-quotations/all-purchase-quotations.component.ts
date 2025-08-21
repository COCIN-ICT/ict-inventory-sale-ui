import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseQuotationService, PurchaseQuotationResponse } from '../../../../services/purchase-quotation.service';

@Component({
  selector: 'app-all-purchase-quotations',
  templateUrl: './all-purchase-quotations.component.html',
  styleUrl: './all-purchase-quotations.component.css'
})
export class AllPurchaseQuotationsComponent implements OnInit {
  purchaseQuotations: PurchaseQuotationResponse[] = [];
  loading = false;
  errorMessage = '';
  deletingQuotation: { [key: number]: boolean } = {};
  showDeleteModal = false;
  quotationToDelete: PurchaseQuotationResponse | null = null;

  constructor(
    private purchaseQuotationService: PurchaseQuotationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPurchaseQuotations();
  }

  loadPurchaseQuotations() {
    this.loading = true;
    this.errorMessage = '';

    this.purchaseQuotationService.getAllPurchaseQuotations().subscribe({
      next: (response: PurchaseQuotationResponse[]) => {
        console.log('Purchase quotations response:', response);
        this.purchaseQuotations = response || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading purchase quotations:', error);
        this.errorMessage = 'Failed to load purchase quotations. Please try again.';
        this.loading = false;
      }
    });
  }

  viewPurchaseQuotation(id: number) {
    this.router.navigate(['/home/purchase-quotation/view', id]);
  }

  editPurchaseQuotation(id: number) {
    this.router.navigate(['/home/purchase-quotation/edit', id]);
  }

  createNewPurchaseQuotation() {
    this.router.navigate(['/home/purchase-quotation/create']);
  }

  confirmDelete(quotation: PurchaseQuotationResponse) {
    this.quotationToDelete = quotation;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.quotationToDelete = null;
  }

  deletePurchaseQuotation() {
    if (!this.quotationToDelete) return;
    
    const id = this.quotationToDelete.id!;
    this.deletingQuotation[id] = true;
    this.showDeleteModal = false;

    this.purchaseQuotationService.deletePurchaseQuotation(id).subscribe({
      next: () => {
        console.log('Purchase quotation deleted successfully');
        this.deletingQuotation[id] = false;
        this.showSuccessMessage('Purchase quotation deleted successfully!');
        this.loadPurchaseQuotations();
        this.quotationToDelete = null;
      },
      error: (error) => {
        console.error('Error deleting purchase quotation:', error);
        this.deletingQuotation[id] = false;
        this.errorMessage = 'Failed to delete purchase quotation. Please try again.';
        this.quotationToDelete = null;
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

  formatAmount(amount?: number): string {
    if (amount === undefined || amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  private showSuccessMessage(message: string) {
    // Create a temporary success message
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (document.body.contains(successDiv)) {
        document.body.removeChild(successDiv);
      }
    }, 3000);
  }
} 