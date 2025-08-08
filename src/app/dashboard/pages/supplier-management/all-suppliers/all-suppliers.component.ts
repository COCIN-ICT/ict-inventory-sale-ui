import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../../../services/supplier.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-suppliers',
  templateUrl: './all-suppliers.component.html',
  styleUrl: './all-suppliers.component.css'
})
export class AllSuppliersComponent implements OnInit {
  suppliers: any[] = [];
  togglingStatus: { [key: number]: boolean } = {};

  constructor(private supplierService: SupplierService, private router: Router){}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.supplierService.getAllSuppliers()
    .subscribe({
      next: (res: any) => {
        console.log('API Response:', res);
        // Try different response structures
        this.suppliers = res.data || res.suppliers || res.result || res || [];
        console.log('Final suppliers:', this.suppliers);
      },
      error: (error) => {
        console.error('Error:', error);
        this.suppliers = []; // Set empty array on error
      }
    })
  }

  viewSupplier(supplierId: number) {
    this.router.navigate(['/home/supplier-management/supplier-details', supplierId]);
  }

  editSupplier(supplierId: number) {
    this.router.navigate(['/home/supplier-management/edit-supplier', supplierId]);
  }

  toggleSupplierStatus(supplier: any) {
    if (this.togglingStatus[supplier.id]) {
      return; // Prevent multiple clicks
    }

    this.togglingStatus[supplier.id] = true;

    this.supplierService.toggleSupplierStatus(supplier.id).subscribe({
      next: (response: any) => {
        console.log('Toggle response:', response);
        
        // Update the supplier in the list
        const index = this.suppliers.findIndex(s => s.id === supplier.id);
        if (index !== -1) {
          this.suppliers[index] = response;
        }
        
        this.togglingStatus[supplier.id] = false;
        
        // Show success message
        const status = response.active ? 'activated' : 'deactivated';
        this.showSuccessMessage(`Supplier "${response.name}" has been ${status} successfully!`);
      },
      error: (error) => {
        console.error('Error toggling supplier status:', error);
        this.togglingStatus[supplier.id] = false;
        this.showErrorMessage('Failed to update supplier status. Please try again.');
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

  private showErrorMessage(message: string) {
    // Create a temporary error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-md shadow-lg z-50';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (document.body.contains(errorDiv)) {
        document.body.removeChild(errorDiv);
      }
    }, 3000);
  }
} 