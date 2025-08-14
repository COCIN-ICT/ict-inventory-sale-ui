import { Component } from '@angular/core';
import { SupplierService } from '../../../../services/supplier.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-supplier',
  templateUrl: './create-supplier.component.html',
  styleUrl: './create-supplier.component.css'
})
export class CreateSupplierComponent {
  supplierForm: FormGroup;
  isSubmitted = false;
  errorMessage = '';
  successMessage = '';

/*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Creates an instance of CreateSupplierComponent.
   * @param supplierService provides operations for interacting with the suppliers API
   * @param router provides navigation and URL manipulation capabilities
   * @param fb provides form builder capabilities
   */
/*******  265b65a1-d66c-4d3d-918e-c4776236decf  *******/
  constructor(
    private supplierService: SupplierService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.supplierForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  createSupplier() {
    this.isSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.supplierForm.valid) {
      const supplierData = this.supplierForm.value;
      
      this.supplierService.createSupplier(supplierData).subscribe({
        next: (response: any) => {
          console.log('Supplier created successfully:', response);
          this.successMessage = 'Supplier created successfully!';
          this.supplierForm.reset();
          this.isSubmitted = false;
          
          // Redirect to suppliers list after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/home/supplier-management/supplier']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error creating supplier:', error);
          this.errorMessage = error.error?.message || 'Failed to create supplier. Please try again.';
          this.isSubmitted = false;
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.isSubmitted = false;
    }
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

  cancelCreate() {
    this.router.navigate(['/home/supplier-management/suppliers']);
  }
} 