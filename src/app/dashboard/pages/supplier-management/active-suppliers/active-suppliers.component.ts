import { Component, OnInit } from '@angular/core';
import { SupplierService, Supplier } from '../../../../services/supplier.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface SearchForm {
  searchType: string;
  searchValue: string;
}

@Component({
  selector: 'app-active-suppliers',
  templateUrl: './active-suppliers.component.html',
  styleUrl: './active-suppliers.component.css'
})
export class ActiveSuppliersComponent implements OnInit {
  activeSuppliers: Supplier[] = [];
  loading = false;
  errorMessage = '';
  searchForm!: FormGroup;
  searchResult: Supplier | null = null;
  isSearching = false;
  togglingStatus: { [key: number]: boolean } = {};

  constructor(
    private supplierService: SupplierService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchType: ['email', [Validators.required]],
      searchValue: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadActiveSuppliers();
  }

  loadActiveSuppliers() {
    this.loading = true;
    this.errorMessage = '';

    this.supplierService.getActiveSuppliers().subscribe({
      next: (response: Supplier[]) => {
        console.log('Active suppliers response:', response);
        this.activeSuppliers = response || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading active suppliers:', error);
        this.errorMessage = 'Failed to load active suppliers. Please try again.';
        this.loading = false;
      }
    });
  }

  searchSupplier() {
    if (this.searchForm.valid) {
      this.isSearching = true;
      this.searchResult = null;
      this.errorMessage = '';

      const searchType = this.searchForm.get('searchType')?.value as string;
      const searchValue = (this.searchForm.get('searchValue')?.value as string).toLowerCase();

      // Search in the active suppliers list
      const foundSupplier = this.activeSuppliers.find(supplier => {
        if (searchType === 'email') {
          return supplier.email.toLowerCase() === searchValue;
        } else if (searchType === 'name') {
          return supplier.name.toLowerCase().includes(searchValue);
        } else if (searchType === 'phone') {
          return supplier.phone.replace(/\D/g, '') === searchValue.replace(/\D/g, '');
        }
        return false;
      });

      if (foundSupplier) {
        this.searchResult = foundSupplier;
      } else {
        this.errorMessage = 'No active supplier found with the provided information.';
      }

      this.isSearching = false;
    }
  }

  clearSearch() {
    this.searchForm.reset({
      searchType: 'email',
      searchValue: ''
    } as SearchForm);
    this.searchResult = null;
    this.errorMessage = '';
  }

  getStatusBadgeClass(active: boolean): string {
    return active 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  }

  getStatusText(active: boolean): string {
    return active ? 'Active' : 'Inactive';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  toggleSupplierStatus(supplier: Supplier) {
    if (this.togglingStatus[supplier.id]) {
      return; // Prevent multiple clicks
    }

    this.togglingStatus[supplier.id] = true;
    this.errorMessage = '';

    this.supplierService.toggleSupplierStatus(supplier.id).subscribe({
      next: (response: Supplier) => {
        console.log('Toggle response:', response);
        
        // Update the supplier in the list
        const index = this.activeSuppliers.findIndex(s => s.id === supplier.id);
        if (index !== -1) {
          this.activeSuppliers[index] = response;
        }
        
        // Update search result if it's the same supplier
        if (this.searchResult && this.searchResult.id === supplier.id) {
          this.searchResult = response;
        }
        
        this.togglingStatus[supplier.id] = false;
        
        // Show success message
        const status = response.active ? 'activated' : 'deactivated';
        this.showSuccessMessage(`Supplier "${response.name}" has been ${status} successfully!`);
      },
      error: (error) => {
        console.error('Error toggling supplier status:', error);
        this.errorMessage = 'Failed to update supplier status. Please try again.';
        this.togglingStatus[supplier.id] = false;
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
} 