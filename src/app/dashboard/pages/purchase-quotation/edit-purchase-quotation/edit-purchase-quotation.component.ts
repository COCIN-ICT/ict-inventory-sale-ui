import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PurchaseQuotationService, PurchaseQuotationRequest, PurchaseQuotationResponse } from '../../../../services/purchase-quotation.service';

@Component({
  selector: 'app-edit-purchase-quotation',
  templateUrl: './edit-purchase-quotation.component.html',
  styleUrl: './edit-purchase-quotation.component.css'
})
export class EditPurchaseQuotationComponent implements OnInit {
  purchaseQuotationForm!: FormGroup;
  loading = false;
  errorMessage = '';
  purchaseQuotationId?: number;

  constructor(
    private fb: FormBuilder,
    private purchaseQuotationService: PurchaseQuotationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadPurchaseQuotation();
  }

  initForm() {
    this.purchaseQuotationForm = this.fb.group({
      supplierId: ['', [Validators.required, Validators.min(1)]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      invoice: ['', [Validators.maxLength(500)]]
    });
  }

  loadPurchaseQuotation() {
    this.route.params.subscribe(params => {
      this.purchaseQuotationId = +params['id'];
      if (this.purchaseQuotationId) {
        this.loading = true;
        this.errorMessage = '';

        this.purchaseQuotationService.getPurchaseQuotationById(this.purchaseQuotationId).subscribe({
          next: (response: PurchaseQuotationResponse) => {
            console.log('Purchase quotation loaded:', response);
            this.purchaseQuotationForm.patchValue({
              supplierId: response.id || '', // Note: This should be supplierId from response
              amount: response.amount || '',
              invoice: response.invoiceUrl || ''
            });
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading purchase quotation:', error);
            this.errorMessage = 'Failed to load purchase quotation. Please try again.';
            this.loading = false;
          }
        });
      }
    });
  }

  onSubmit() {
    if (this.purchaseQuotationForm.valid && this.purchaseQuotationId) {
      this.loading = true;
      this.errorMessage = '';

      const purchaseQuotationData: PurchaseQuotationRequest = {
        supplierId: this.purchaseQuotationForm.get('supplierId')?.value,
        amount: this.purchaseQuotationForm.get('amount')?.value,
        invoice: this.purchaseQuotationForm.get('invoice')?.value || undefined
      };

      this.purchaseQuotationService.updatePurchaseQuotation(this.purchaseQuotationId, purchaseQuotationData).subscribe({
        next: (response) => {
          console.log('Purchase quotation updated:', response);
          this.loading = false;
          this.showSuccessMessage('Purchase quotation updated successfully!');
          this.router.navigate(['/home/purchase-quotation/all']);
        },
        error: (error) => {
          console.error('Error updating purchase quotation:', error);
          this.errorMessage = 'Failed to update purchase quotation. Please try again.';
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.router.navigate(['/home/purchase-quotation/all']);
  }

  private markFormGroupTouched() {
    Object.keys(this.purchaseQuotationForm.controls).forEach(key => {
      const control = this.purchaseQuotationForm.get(key);
      control?.markAsTouched();
    });
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

  // Form validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.purchaseQuotationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.purchaseQuotationForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['min']) {
        if (fieldName === 'supplierId') {
          return 'Supplier ID must be greater than 0';
        }
        if (fieldName === 'amount') {
          return 'Amount must be greater than 0';
        }
      }
      if (field.errors['maxlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must not exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
    }
    return '';
  }
} 