import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from '../../../../services/supplier.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-edit-supplier',
  templateUrl: './edit-supplier.component.html',
  styleUrl: './edit-supplier.component.css'
})
export class EditSupplierComponent implements OnInit {
  supplierForm: FormGroup;
  supplierId: number = 0;
  loading = true;
  isSubmitted = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.supplierForm = this.createForm();
  }

  ngOnInit(): void {
    console.log('=== EditSupplierComponent initialized ===');
    console.log('Component loading at:', new Date().toISOString());
    
    this.route.params.subscribe(params => {
      console.log('=== Route Parameters ===');
      console.log('All params:', params);
      console.log('ID param:', params['id']);
      console.log('ID type:', typeof params['id']);
      
      this.supplierId = +params['id'];
      console.log('Parsed Supplier ID:', this.supplierId);
      console.log('Supplier ID type:', typeof this.supplierId);
      
      if (this.supplierId > 0) {
        console.log('✅ Valid supplier ID, loading supplier data...');
        this.loadSupplierForEdit();
      } else {
        console.error('❌ Invalid supplier ID:', this.supplierId);
        this.errorMessage = 'Invalid supplier ID provided';
        this.loading = false;
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  loadSupplierForEdit() {
    console.log('=== Loading Supplier for Edit ===');
    console.log('Supplier ID to fetch:', this.supplierId);
    console.log('API endpoint:', `${environment.apiUrl}/supplier/${this.supplierId}`);
    console.log('Loading state set to true');
    
    this.loading = true;
    this.errorMessage = '';

    console.log('🔄 Making API call to getSupplierById...');
    this.supplierService.getSupplierById(this.supplierId).subscribe({
      next: (response: any) => {
        console.log('✅ API Response Success:');
        console.log('Response data:', response);
        console.log('Response type:', typeof response);
        console.log('Response keys:', Object.keys(response));
        
        if (response && response.name) {
          console.log('✅ Valid supplier data received');
          console.log('Setting form values...');
          this.supplierForm.patchValue({
            name: response.name,
            address: response.address,
            phone: response.phone,
            email: response.email
          });
          console.log('✅ Form values set successfully');
          console.log('Form values:', this.supplierForm.value);
        } else {
          console.error('❌ Invalid response format:', response);
          this.errorMessage = 'Invalid supplier data received';
        }
        
        this.loading = false;
        console.log('Loading state set to false');
      },
      error: (error) => {
        console.error('❌ API Error:');
        console.error('Error object:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error response:', error.error);
        
        this.errorMessage = 'Failed to load supplier data. Please try again.';
        this.loading = false;
        console.log('Loading state set to false due to error');
      }
    });
  }

  updateSupplier() {
    console.log('=== Update Supplier Called ===');
    console.log('Form valid:', this.supplierForm.valid);
    console.log('Form errors:', this.supplierForm.errors);
    console.log('Form value:', this.supplierForm.value);
    
    this.isSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.supplierForm.valid) {
      const supplierData = this.supplierForm.value;
      console.log('✅ Form is valid, preparing to update');
      console.log('Supplier data to update:', supplierData);
      console.log('API endpoint:', `${environment.apiUrl}/supplier/${this.supplierId}`);
      
      console.log('🔄 Making PUT API call to updateSupplier...');
      this.supplierService.updateSupplier(this.supplierId, supplierData).subscribe({
        next: (response: any) => {
          console.log('✅ Update API Response Success:');
          console.log('Response data:', response);
          console.log('Response type:', typeof response);
          
          this.successMessage = 'Supplier updated successfully!';
          this.isSubmitted = false;
          console.log('✅ Success message set, redirecting in 2 seconds...');
          
          // Redirect to supplier details after 2 seconds
          setTimeout(() => {
            console.log('🔄 Redirecting to supplier details...');
            this.router.navigate(['/home/supplier-management/supplier-details', this.supplierId]);
          }, 2000);
        },
        error: (error) => {
          console.error('❌ Update API Error:');
          console.error('Error object:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          console.error('Error response:', error.error);
          
          this.errorMessage = error.error?.message || 'Failed to update supplier. Please try again.';
          this.isSubmitted = false;
        }
      });
    } else {
      console.error('❌ Form is invalid');
      console.error('Form errors:', this.supplierForm.errors);
      console.error('Individual field errors:');
      Object.keys(this.supplierForm.controls).forEach(key => {
        const control = this.supplierForm.get(key);
        if (control?.errors) {
          console.error(`${key} errors:`, control.errors);
        }
      });
      
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.isSubmitted = false;
    }
  }

  cancelEdit() {
    this.router.navigate(['/home/supplier-management/supplier-details', this.supplierId]);
  }

  getErrorMessage(controlName: string): string {
    const control = this.supplierForm.get(controlName);
    if (control?.errors && this.isSubmitted) {
      if (control.errors['required']) {
        return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required.`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address.';
      }
      if (control.errors['minlength']) {
        return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters.`;
      }
      if (control.errors['pattern']) {
        return 'Please enter a valid phone number.';
      }
    }
    return '';
  }
} 