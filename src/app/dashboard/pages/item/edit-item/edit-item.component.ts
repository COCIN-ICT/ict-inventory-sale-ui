import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService, ItemRequest, ItemType } from '../../../../services/item.service';
import { UnitOfMeasureService, UnitOfMeasureResponse } from '../../../../services/unit-of-measure.service';
import { ItemCategoryService, ItemCategoryResponse } from '../../../../services/item-category.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrl: './edit-item.component.css'
})
export class EditItemComponent implements OnInit {
  itemForm!: FormGroup;
  loading = false;
  errorMessage = '';
  itemId: number = 0;
  unitOfMeasures: UnitOfMeasureResponse[] = [];
  itemCategories: ItemCategoryResponse[] = [];
  ItemType = ItemType; // Make enum available in template
  itemTypes = Object.values(ItemType);

  constructor(
    private formBuilder: FormBuilder,
    private itemService: ItemService,
    private unitOfMeasureService: UnitOfMeasureService,
    private itemCategoryService: ItemCategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadUnitOfMeasures();
    this.loadItemCategories();
    this.loadItem();
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

  loadItem() {
    this.route.params.subscribe(params => {
      this.itemId = +params['id'];
      if (this.itemId) {
        this.loading = true;
        this.errorMessage = '';

        this.itemService.getItemById(this.itemId).subscribe({
          next: (response) => {
            console.log('Item loaded:', response);
            this.itemForm.patchValue({
              name: response.name,
              itemType: response.itemType,
              isExpirable: response.isExpirable,
              unitOfMeasureId: response.unitOfMeasure?.id,
              itemCategoryId: response.itemCategory?.id
            });
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading item:', error);
            this.errorMessage = 'Failed to load item. Please try again.';
            this.loading = false;
          }
        });
      }
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

      this.itemService.updateItem(this.itemId, itemData).subscribe({
        next: (response) => {
          console.log('Item updated:', response);
          this.loading = false;
          this.showSuccessMessage('Item updated successfully!');
          this.router.navigate(['/home/item/all']);
        },
        error: (error) => {
          console.error('Error updating item:', error);
          this.errorMessage = 'Failed to update item. Please try again.';
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