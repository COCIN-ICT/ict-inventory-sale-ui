import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemService, ItemRequest, ItemType } from '../../../../services/item.service';
import { UnitOfMeasureService, UnitOfMeasureResponse } from '../../../../services/unit-of-measure.service';
import { ItemCategoryService, ItemCategoryResponse } from '../../../../services/item-category.service';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrl: './create-item.component.css'
})
export class CreateItemComponent implements OnInit {
  itemForm!: FormGroup;
  loading = false;
  errorMessage = '';
  unitOfMeasures: UnitOfMeasureResponse[] = [];
  itemCategories: ItemCategoryResponse[] = [];
  ItemType = ItemType; // Make enum available in template
  itemTypes = Object.values(ItemType);

  constructor(
    private formBuilder: FormBuilder,
    private itemService: ItemService,
    private unitOfMeasureService: UnitOfMeasureService,
    private itemCategoryService: ItemCategoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadUnitOfMeasures();
    this.loadItemCategories();
  }

  initForm() {
    this.itemForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      itemType: ['', [Validators.required]],
      isExpirable: [false, [Validators.required]],
      unitOfMeasureId: ['', [Validators.required]],
      itemCategoryId: ['', [Validators.required]]
    });
  }

  loadUnitOfMeasures() {
    this.unitOfMeasureService.getAllUnitOfMeasures().subscribe({
      next: (response) => {
        this.unitOfMeasures = response || [];
      },
      error: (error) => {
        console.error('Error loading unit of measures:', error);
        this.errorMessage = 'Failed to load unit of measures. Please refresh the page.';
      }
    });
  }

  loadItemCategories() {
    this.itemCategoryService.getAllItemCategories().subscribe({
      next: (response) => {
        this.itemCategories = response || [];
      },
      error: (error) => {
        console.error('Error loading item categories:', error);
        this.errorMessage = 'Failed to load item categories. Please refresh the page.';
      }
    });
  }

  onSubmit() {
    if (this.itemForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const itemData: ItemRequest = this.itemForm.value;

      this.itemService.createItem(itemData).subscribe({
        next: (response) => {
          console.log('Item created:', response);
          this.loading = false;
          this.showSuccessMessage('Item created successfully!');
          this.router.navigate(['/home/item/all']);
        },
        error: (error) => {
          console.error('Error creating item:', error);
          this.errorMessage = 'Failed to create item. Please try again.';
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel() {
    this.router.navigate(['/home/item/all']);
  }

  private markFormGroupTouched() {
    Object.keys(this.itemForm.controls).forEach(key => {
      const control = this.itemForm.get(key);
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