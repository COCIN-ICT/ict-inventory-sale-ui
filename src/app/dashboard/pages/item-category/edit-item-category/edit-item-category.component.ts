import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemCategoryService } from '../../../../services/item-category.service';

@Component({
  selector: 'app-edit-item-category',
  templateUrl: './edit-item-category.component.html',
  styleUrl: './edit-item-category.component.css'
})
export class EditItemCategoryComponent implements OnInit {
  itemCategoryForm!: FormGroup;
  loading = false;
  errorMessage = '';
  itemCategoryId: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private itemCategoryService: ItemCategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadItemCategory();
  }

  initForm() {
    this.itemCategoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });
  }

  loadItemCategory() {
    this.route.params.subscribe(params => {
      this.itemCategoryId = +params['id'];
      if (this.itemCategoryId) {
        this.loading = true;
        this.errorMessage = '';

        this.itemCategoryService.getItemCategoryById(this.itemCategoryId).subscribe({
          next: (response) => {
            console.log('Item category loaded:', response);
            this.itemCategoryForm.patchValue({
              name: response.name
            });
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading item category:', error);
            this.errorMessage = 'Failed to load item category. Please try again.';
            this.loading = false;
          }
        });
      }
    });
  }

  onSubmit() {
    if (this.itemCategoryForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const itemCategoryData = this.itemCategoryForm.value;

      this.itemCategoryService.updateItemCategory(this.itemCategoryId, itemCategoryData).subscribe({
        next: (response) => {
          console.log('Item category updated:', response);
          this.loading = false;
          this.showSuccessMessage('Item category updated successfully!');
          this.router.navigate(['/home/item-category/all']);
        },
        error: (error) => {
          console.error('Error updating item category:', error);
          this.errorMessage = 'Failed to update item category. Please try again.';
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