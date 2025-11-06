import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ItemService, ItemResponse, ItemType } from '../../../../services/item.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-all-items',
  templateUrl: './all-items.component.html',
  styleUrl: './all-items.component.css'
})
export class AllItemsComponent implements OnInit, OnDestroy {
  items: ItemResponse[] = [];
  loading = false;
  errorMessage = '';
  deletingItem: { [key: number]: boolean } = {};
  changingStatus: { [key: number]: boolean } = {};
  showDeleteModal = false;
  itemToDelete: ItemResponse | null = null;
  statusFilter: 'all' | 'active' | 'inactive' | 'low-stock' = 'all';
  ItemType = ItemType; // Make enum available in template
  viewMode: 'all' | 'active' | 'low-stock' = 'all';
  private destroy$ = new Subject<void>();

  constructor(
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Determine view mode from route
    this.updateViewModeFromRoute();
    this.loadItems();
    
    // Subscribe to route changes to update view mode when navigating
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateViewModeFromRoute();
        this.loadItems();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateViewModeFromRoute(): void {
    const url = this.router.url;
    if (url.includes('/active')) {
      this.viewMode = 'active';
      this.statusFilter = 'active';
    } else if (url.includes('/low-stock')) {
      this.viewMode = 'low-stock';
      this.statusFilter = 'all'; // Will filter in loadItems
    } else {
      this.viewMode = 'all';
      this.statusFilter = 'all';
    }
  }

  loadItems() {
    this.loading = true;
    this.errorMessage = '';

    let observable;
    if (this.viewMode === 'active') {
      observable = this.itemService.getItemsByStatus(true);
    } else if (this.viewMode === 'low-stock') {
      // For low-stock, get all items and filter client-side
      // Note: This assumes items have a stock/quantity property. Adjust based on your API response.
      observable = this.itemService.getAllItems();
    } else {
      observable = this.itemService.getAllItems();
    }

    observable.subscribe({
      next: (response: ItemResponse[]) => {
        console.log('Items response:', response);
        let filteredItems = response || [];
        
        // Filter for low-stock items if needed
        if (this.viewMode === 'low-stock') {
          // Filter items - adjust logic based on your data structure
          // Assuming items might have stock-related properties, or we show all active items for now
          filteredItems = filteredItems.filter(item => item.isActive);
        }
        
        this.items = filteredItems;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading items:', error);
        this.errorMessage = 'Failed to load items. Please try again.';
        this.loading = false;
      }
    });
  }

  onStatusFilterChange() {
    this.loadItems();
  }

  viewItem(id: number) {
    this.router.navigate(['/home/item/view', id]);
  }

  editItem(id: number) {
    this.router.navigate(['/home/item/edit', id]);
  }

  createNewItem() {
    this.router.navigate(['/home/item/create']);
  }

  confirmDelete(item: ItemResponse) {
    this.itemToDelete = item;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.itemToDelete = null;
  }

  deleteItem() {
    if (!this.itemToDelete) return;
    
    const id = this.itemToDelete.id;
    this.deletingItem[id] = true;
    this.showDeleteModal = false;

    this.itemService.deleteItem(id).subscribe({
      next: () => {
        console.log('Item deleted successfully');
        this.deletingItem[id] = false;
        this.showSuccessMessage('Item deleted successfully!');
        this.loadItems();
        this.itemToDelete = null;
      },
      error: (error) => {
        console.error('Error deleting item:', error);
        this.deletingItem[id] = false;
        this.errorMessage = 'Failed to delete item. Please try again.';
        this.itemToDelete = null;
      }
    });
  }

  changeItemStatus(item: ItemResponse) {
    const id = item.id;
    this.changingStatus[id] = true;

    this.itemService.changeItemStatus(id).subscribe({
      next: (response) => {
        console.log('Item status changed successfully:', response);
        this.changingStatus[id] = false;
        this.showSuccessMessage(`Item status changed to ${response.isActive ? 'Active' : 'Inactive'}!`);
        this.loadItems();
      },
      error: (error) => {
        console.error('Error changing item status:', error);
        this.changingStatus[id] = false;
        this.errorMessage = 'Failed to change item status. Please try again.';
      }
    });
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