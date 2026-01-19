import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemCategoryService, ItemCategoryResponse } from '../../../../services/item-category.service';

@Component({
  selector: 'app-all-item-categories',
  templateUrl: './all-item-categories.component.html',
  styleUrl: './all-item-categories.component.css'
})
export class AllItemCategoriesComponent implements OnInit {
  itemCategories: ItemCategoryResponse[] = [];
  loading = false;
  errorMessage = '';
  deletingCategory: { [key: number]: boolean } = {};
  showDeleteModal = false;
  categoryToDelete: ItemCategoryResponse | null = null;

  constructor(
    private itemCategoryService: ItemCategoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadItemCategories();
  }

  loadItemCategories() {
    this.loading = true;
    this.errorMessage = '';

    this.itemCategoryService.getAllItemCategories().subscribe({
      next: (response: ItemCategoryResponse[]) => {
        console.log('Item categories response:', response);
        this.itemCategories = response || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading item categories:', error);
        this.errorMessage = 'Failed to load item categories. Please try again.';
        this.loading = false;
      }
    });
  }

  viewItemCategory(id: number) {
    this.router.navigate(['/home/item-category/view', id]);
  }

  editItemCategory(id: number) {
    this.router.navigate(['/home/item-category/edit', id]);
  }

  createNewItemCategory() {
    this.router.navigate(['/home/item-category/create']);
  }

  confirmDelete(category: ItemCategoryResponse) {
    this.categoryToDelete = category;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.categoryToDelete = null;
  }

  deleteItemCategory() {
    if (!this.categoryToDelete) return;
    
    const id = this.categoryToDelete.id;
    this.deletingCategory[id] = true;
    this.showDeleteModal = false;

    this.itemCategoryService.deleteItemCategory(id).subscribe({
      next: () => {
        console.log('Item category deleted successfully');
        this.deletingCategory[id] = false;
        this.showSuccessMessage('Item category deleted successfully!');
        this.loadItemCategories();
        this.categoryToDelete = null;
      },
      error: (error) => {
        console.error('Error deleting item category:', error);
        this.deletingCategory[id] = false;
        this.errorMessage = 'Failed to delete item category. Please try again.';
        this.categoryToDelete = null;
      }
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

  goBackToItemsManagement(): void {
    this.router.navigate(['/home/items-management']);
  }
} 