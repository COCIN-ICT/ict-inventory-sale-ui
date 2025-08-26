import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemCategoryService, ItemCategoryResponse } from '../../../../services/item-category.service';

@Component({
  selector: 'app-item-category-details',
  templateUrl: './item-category-details.component.html',
  styleUrl: './item-category-details.component.css'
})
export class ItemCategoryDetailsComponent implements OnInit {
  itemCategory: ItemCategoryResponse | null = null;
  loading = false;
  errorMessage = '';
  itemCategoryId: number = 0;

  constructor(
    private itemCategoryService: ItemCategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadItemCategory();
  }

  loadItemCategory() {
    this.route.params.subscribe(params => {
      this.itemCategoryId = +params['id'];
      if (this.itemCategoryId) {
        this.loading = true;
        this.errorMessage = '';

        this.itemCategoryService.getItemCategoryById(this.itemCategoryId).subscribe({
          next: (response) => {
            console.log('Item category details loaded:', response);
            this.itemCategory = response;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading item category details:', error);
            this.errorMessage = 'Failed to load item category details. Please try again.';
            this.loading = false;
          }
        });
      }
    });
  }

  editItemCategory() {
    this.router.navigate(['/home/item-category/edit', this.itemCategoryId]);
  }

  goBack() {
    this.router.navigate(['/home/item-category/all']);
  }
} 