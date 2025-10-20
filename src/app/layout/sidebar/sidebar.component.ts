


import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  // Main section toggles
  isAdminExpanded = false;
  
  // Admin subsection toggles
  isUserManagementExpanded = false;
  isSupplierManagementExpanded = false;
  isStoreManagementExpanded = false;
  isPurchaseQuotationsExpanded = false;
  isBankAccountsExpanded = false;
  isPurchaseItemsExpanded = false;
  isProductionOrderExpanded = false;
  isStockTransferExpanded = false;
  isItemsManagementExpanded = false;
  isCustomerManagementExpanded = false;
  
  // Items Management nested toggles
  isUnitOfMeasureExpanded = false;
  isItemCategoriesExpanded = false;
  isItemsExpanded = false;

  // Toggle methods for main sections
  toggleAdmin(): void {
    this.isAdminExpanded = !this.isAdminExpanded;
  }

  // Toggle methods for admin subsections
  toggleUserManagement(): void {
    this.isUserManagementExpanded = !this.isUserManagementExpanded;
  }

  toggleSupplierManagement(): void {
    this.isSupplierManagementExpanded = !this.isSupplierManagementExpanded;
  }

  toggleStoreManagement(): void {
    this.isStoreManagementExpanded = !this.isStoreManagementExpanded;
  }

  togglePurchaseQuotations(): void {
    this.isPurchaseQuotationsExpanded = !this.isPurchaseQuotationsExpanded;
  }

  toggleBankAccounts(): void {
    this.isBankAccountsExpanded = !this.isBankAccountsExpanded;
  }

  togglePurchaseItems(): void {
    this.isPurchaseItemsExpanded = !this.isPurchaseItemsExpanded;
  }

  toggleProductionOrder(): void {
    this.isProductionOrderExpanded = !this.isProductionOrderExpanded;
  }

  toggleStockTransfer(): void {
    this.isStockTransferExpanded = !this.isStockTransferExpanded;
  }

  toggleItemsManagement(): void {
    this.isItemsManagementExpanded = !this.isItemsManagementExpanded;
  }

  toggleCustomerManagement(): void {
    this.isCustomerManagementExpanded = !this.isCustomerManagementExpanded;
  }

  // Toggle methods for Items Management nested sections
  toggleUnitOfMeasure(): void {
    this.isUnitOfMeasureExpanded = !this.isUnitOfMeasureExpanded;
  }

  toggleItemCategories(): void {
    this.isItemCategoriesExpanded = !this.isItemCategoriesExpanded;
  }

  toggleItems(): void {
    this.isItemsExpanded = !this.isItemsExpanded;
  }

  // Logout method
  logout(): void {
    // Add your logout logic here
    console.log('Logging out...');
    // Example: this.authService.logout();
    // this.router.navigate(['/login']);
  }
}