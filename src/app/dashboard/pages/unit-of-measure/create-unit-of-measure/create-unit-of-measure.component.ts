import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UnitOfMeasureService, UnitOfMeasureRequest } from '../../../../services/unit-of-measure.service';

@Component({
  selector: 'app-create-unit-of-measure',
  templateUrl: './create-unit-of-measure.component.html',
  styleUrl: './create-unit-of-measure.component.css'
})
export class CreateUnitOfMeasureComponent implements OnInit {
  unitOfMeasureForm!: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private unitOfMeasureService: UnitOfMeasureService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.unitOfMeasureForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]]
    });
  }

  onSubmit() {
    if (this.unitOfMeasureForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const unitOfMeasureData: UnitOfMeasureRequest = {
        code: this.unitOfMeasureForm.get('code')?.value,
        description: this.unitOfMeasureForm.get('description')?.value
      };

      this.unitOfMeasureService.createUnitOfMeasure(unitOfMeasureData).subscribe({
        next: (response) => {
          console.log('Unit of measure created:', response);
          this.loading = false;
          this.showSuccessMessage('Unit of measure created successfully!');
          this.router.navigate(['/home/unit-of-measure/all']);
        },
        error: (error) => {
          console.error('Error creating unit of measure:', error);
          this.errorMessage = 'Failed to create unit of measure. Please try again.';
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.router.navigate(['/home/unit-of-measure/all']);
  }

  private markFormGroupTouched() {
    Object.keys(this.unitOfMeasureForm.controls).forEach(key => {
      const control = this.unitOfMeasureForm.get(key);
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
    const field = this.unitOfMeasureForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.unitOfMeasureForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must not exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  goBackToItemsManagement(): void {
    this.router.navigate(['/home/items-management']);
  }
} 