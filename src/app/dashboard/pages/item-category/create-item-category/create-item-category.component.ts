import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemCategoryService } from '../../../../services/item-category.service';

@Component({
  selector: 'app-create-item-category',
  templateUrl: './create-item-category.component.html',
  styleUrl: './create-item-category.component.css'
})
export class CreateItemCategoryComponent implements OnInit {
  itemCategoryForm!: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private itemCategoryService: ItemCategoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.itemCategoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });
  }

  onSubmit() {
    if (this.itemCategoryForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const itemCategoryData = this.itemCategoryForm.value;

      this.itemCategoryService.createItemCategory(itemCategoryData).subscribe({
        next: (response) => {
          console.log('Item category created:', response);
          this.loading = false;
          this.showSuccessMessage('Item category created successfully!');
          this.router.navigate(['/home/item-category/all']);
        },
        error: (error) => {
          console.error('Error creating item category:', error);
          this.errorMessage = 'Failed to create item category. Please try again.';
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.router.navigate(['/home/item-category/all']);
  }

  private markFormGroupTouched() {
    Object.keys(this.itemCategoryForm.controls).forEach(key => {
      const control = this.itemCategoryForm.get(key);
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
} 