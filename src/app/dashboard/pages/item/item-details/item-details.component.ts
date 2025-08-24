import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService, ItemResponse, ItemType } from '../../../../services/item.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrl: './item-details.component.css'
})
export class ItemDetailsComponent implements OnInit {
  item: ItemResponse | null = null;
  loading = false;
  errorMessage = '';
  itemId: number = 0;
  ItemType = ItemType; // Make enum available in template

  constructor(
    private itemService: ItemService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadItem();
  }

  loadItem() {
    this.route.params.subscribe(params => {
      this.itemId = +params['id'];
      if (this.itemId) {
        this.loading = true;
        this.errorMessage = '';

        this.itemService.getItemById(this.itemId).subscribe({
          next: (response) => {
            console.log('Item details loaded:', response);
            this.item = response;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading item details:', error);
            this.errorMessage = 'Failed to load item details. Please try again.';
            this.loading = false;
          }
        });
      }
    });
  }

  editItem() {
    this.router.navigate(['/home/item/edit', this.itemId]);
  }

  goBack() {
    this.router.navigate(['/home/item/all']);
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getItemTypeLabel(itemType: ItemType): string {
    switch (itemType) {
      case ItemType.RAW: return 'Raw';
      case ItemType.RESALABLE: return 'Resalable';
      case ItemType.FINISHED: return 'Finished';
      default: return itemType;
    }
  }

  getItemTypeColor(itemType: ItemType): string {
    switch (itemType) {
      case ItemType.RAW: return 'bg-orange-100 text-orange-800 border-orange-300';
      case ItemType.RESALABLE: return 'bg-blue-100 text-blue-800 border-blue-300';
      case ItemType.FINISHED: return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }

  getStatusColor(isActive: boolean): string {
    return isActive 
      ? 'bg-green-100 text-green-800 border-green-300' 
      : 'bg-red-100 text-red-800 border-red-300';
  }
} 