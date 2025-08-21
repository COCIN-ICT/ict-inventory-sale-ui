import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PurchaseQuotationService, PurchaseQuotationRequest, PurchaseQuotationResponse } from '../../../../services/purchase-quotation.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-create-purchase-quotation',
  templateUrl: './create-purchase-quotation.component.html',
  styleUrl: './create-purchase-quotation.component.css'
})
export class CreatePurchaseQuotationComponent implements OnInit {
  purchaseQuotationForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  selectedFileName: string = '';

  constructor(
    private fb: FormBuilder,
    private purchaseQuotationService: PurchaseQuotationService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.purchaseQuotationForm = this.fb.group({
      supplierId: ['', [Validators.required, Validators.min(1)]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      invoice: [null]
    });
  }

  onSubmit() {
    if (this.purchaseQuotationForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      // Get form values
      const supplierId = this.purchaseQuotationForm.get('supplierId')?.value;
      const amount = this.purchaseQuotationForm.get('amount')?.value;
      const invoiceFile = this.purchaseQuotationForm.get('invoice')?.value;

      console.log('Form values:', { supplierId, amount, invoiceFile });
      console.log('Form valid:', this.purchaseQuotationForm.valid);
      console.log('Form errors:', this.purchaseQuotationForm.errors);

      console.log('About to make HTTP request...');
      this.purchaseQuotationService.createPurchaseQuotationWithFile(supplierId, amount, invoiceFile).subscribe({
        next: (response) => {
          console.log('✅ Purchase quotation created successfully:', response);
          this.loading = false;
          this.showSuccessMessage('Purchase quotation created successfully!');
          this.router.navigate(['/home/purchase-quotation/all']);
        },
        error: (error) => {
          console.error('❌ Error creating purchase quotation:', error);
          console.error('Error type:', typeof error);
          console.error('Error status:', error?.status);
          console.error('Error message:', error?.message);
          console.error('Error body:', error?.error);
          console.error('Error name:', error?.name);
          console.error('Error stack:', error?.stack);
          console.error('Full error object:', error);
          
          let errorMessage = 'Failed to create purchase quotation.';
          if (error?.status) {
            errorMessage += ` Status: ${error.status}`;
          }
          if (error?.message) {
            errorMessage += ` Message: ${error.message}`;
          }
          if (error?.error) {
            errorMessage += ` Details: ${JSON.stringify(error.error)}`;
          }
          if (error?.name) {
            errorMessage += ` Type: ${error.name}`;
          }
          
          this.errorMessage = errorMessage;
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      this.purchaseQuotationForm.patchValue({
        invoice: file
      });
      console.log('File selected:', file);
    }
  }

  onSubmitWithoutFile() {
    if (this.purchaseQuotationForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      // Test without file first
      const supplierId = this.purchaseQuotationForm.get('supplierId')?.value;
      const amount = this.purchaseQuotationForm.get('amount')?.value;

      console.log('Testing without file:', { supplierId, amount });

      this.purchaseQuotationService.createPurchaseQuotationWithFile(supplierId, amount).subscribe({
        next: (response) => {
          console.log('Purchase quotation created without file:', response);
          this.loading = false;
          this.showSuccessMessage('Purchase quotation created successfully without file!');
          this.router.navigate(['/home/purchase-quotation/all']);
        },
        error: (error) => {
          console.error('Error creating purchase quotation without file:', error);
          console.error('Error status:', error?.status);
          console.error('Error message:', error?.message);
          console.error('Error body:', error?.error);
          
          let errorMessage = 'Without file failed.';
          if (error?.status) {
            errorMessage += ` Status: ${error.status}`;
          }
          if (error?.message) {
            errorMessage += ` Message: ${error.message}`;
          }
          if (error?.error) {
            errorMessage += ` Details: ${JSON.stringify(error.error)}`;
          }
          
          this.errorMessage = errorMessage;
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  testServerConnection() {
    console.log('🔍 Testing server connection...');
    this.http.get(`${environment.apiUrl}/quotation`).subscribe({
      next: (response) => {
        console.log('✅ Server is reachable, GET /quotation works:', response);
        this.showSuccessMessage('Server connection test successful!');
      },
      error: (error) => {
        console.error('❌ Server connection test failed:', error);
        this.errorMessage = `Server connection failed: ${error?.status || 'Unknown'} - ${error?.message || 'No message'}`;
      }
    });
  }

  onSubmitAlternative() {
    if (this.purchaseQuotationForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      // Alternative format - try with snake_case field names
      const supplierId = this.purchaseQuotationForm.get('supplierId')?.value;
      const amount = this.purchaseQuotationForm.get('amount')?.value;
      const invoiceFile = this.purchaseQuotationForm.get('invoice')?.value;

      console.log('Testing alternative format with snake_case:', { supplierId, amount, invoiceFile });

      if (invoiceFile) {
        // With file - use FormData with snake_case
        const formData = new FormData();
        formData.append('supplier_id', supplierId.toString());
        formData.append('amount', amount.toString());
        formData.append('invoice', invoiceFile);
        
        console.log('Alternative: Using FormData with snake_case');
        this.http.post<PurchaseQuotationResponse>(`${environment.apiUrl}/quotation`, formData).subscribe({
          next: (response) => {
            console.log('Purchase quotation created with alternative format:', response);
            this.loading = false;
            this.showSuccessMessage('Purchase quotation created successfully with alternative format!');
            this.router.navigate(['/home/purchase-quotation/all']);
          },
          error: (error) => {
            console.error('Error with alternative format:', error);
            console.error('Error status:', error?.status);
            console.error('Error message:', error?.message);
            console.error('Error body:', error?.error);
            
            let errorMessage = 'Alternative format failed.';
            if (error?.status) {
              errorMessage += ` Status: ${error.status}`;
            }
            if (error?.message) {
              errorMessage += ` Message: ${error.message}`;
            }
            if (error?.error) {
              errorMessage += ` Details: ${JSON.stringify(error.error)}`;
            }
            
            this.errorMessage = errorMessage;
            this.loading = false;
          }
        });
      } else {
        // Without file - use JSON with snake_case
        const requestData = {
          supplier_id: supplierId,
          amount: amount
        };
        
        console.log('Alternative: Using JSON with snake_case');
        this.http.post<PurchaseQuotationResponse>(`${environment.apiUrl}/quotation`, requestData).subscribe({
          next: (response) => {
            console.log('Purchase quotation created with alternative format:', response);
            this.loading = false;
            this.showSuccessMessage('Purchase quotation created successfully with alternative format!');
            this.router.navigate(['/home/purchase-quotation/all']);
          },
          error: (error) => {
            console.error('Error creating purchase quotation with alternative format:', error);
            console.error('Error status:', error?.status);
            console.error('Error message:', error?.message);
            console.error('Error body:', error?.error);
            
            let errorMessage = 'Alternative format failed.';
            if (error?.status) {
              errorMessage += ` Status: ${error.status}`;
            }
            if (error?.message) {
              errorMessage += ` Message: ${error.message}`;
            }
            if (error?.error) {
              errorMessage += ` Details: ${JSON.stringify(error.error)}`;
            }
            
            this.errorMessage = errorMessage;
            this.loading = false;
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
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