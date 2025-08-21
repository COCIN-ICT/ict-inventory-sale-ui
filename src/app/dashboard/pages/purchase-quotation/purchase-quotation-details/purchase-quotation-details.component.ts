import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PurchaseQuotationService, PurchaseQuotationResponse } from '../../../../services/purchase-quotation.service';

@Component({
  selector: 'app-purchase-quotation-details',
  templateUrl: './purchase-quotation-details.component.html',
  styleUrl: './purchase-quotation-details.component.css'
})
export class PurchaseQuotationDetailsComponent implements OnInit {
  purchaseQuotation?: PurchaseQuotationResponse;
  loading = false;
  errorMessage = '';

  constructor(
    private purchaseQuotationService: PurchaseQuotationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadPurchaseQuotation();
  }

  loadPurchaseQuotation() {
    this.route.params.subscribe(params => {
      const purchaseQuotationId = +params['id'];
      if (purchaseQuotationId) {
        this.loading = true;
        this.errorMessage = '';

        this.purchaseQuotationService.getPurchaseQuotationById(purchaseQuotationId).subscribe({
          next: (response: PurchaseQuotationResponse) => {
            console.log('Purchase quotation details loaded:', response);
            this.purchaseQuotation = response;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading purchase quotation details:', error);
            this.errorMessage = 'Failed to load purchase quotation details. Please try again.';
            this.loading = false;
          }
        });
      }
    });
  }

  editPurchaseQuotation() {
    if (this.purchaseQuotation?.id) {
      this.router.navigate(['/home/purchase-quotation/edit', this.purchaseQuotation.id]);
    }
  }

  goBack() {
    this.router.navigate(['/home/purchase-quotation/all']);
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
} 