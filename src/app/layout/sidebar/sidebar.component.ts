import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  // Admin group toggles
  isAdminExpanded = false;
  isUserManagementExpanded = false;
  isSupplierManagementExpanded = false;
  isStoreManagementExpanded = false;
  isPurchaseQuotationsExpanded = false;
  isSalesOrdersExpanded = false; // <--- added
  isSalesItemsExpanded = false; // <--- new
  isSalesCreditExpanded = false; // <--- added
  isSalesPromotionExpanded = false; // <--- added
  isBankAccountsExpanded = false;

  // Other group toggles
  isPurchaseItemsExpanded = false;
  isProductionOrderExpanded = false;
  isStockTransferExpanded = false;

  // Items management nested toggles
  isItemsManagementExpanded = false;
  isUnitOfMeasureExpanded = false;
  isItemCategoriesExpanded = false;
  isItemsExpanded = false;

  // Customer management
  isCustomerManagementExpanded = false;

  constructor(private router: Router) {}

  // Top-level
  toggleAdmin(): void { this.isAdminExpanded = !this.isAdminExpanded; }

  // Admin children
  toggleUserManagement(): void { this.isUserManagementExpanded = !this.isUserManagementExpanded; }
  toggleSupplierManagement(): void { this.isSupplierManagementExpanded = !this.isSupplierManagementExpanded; }
  toggleStoreManagement(): void { this.isStoreManagementExpanded = !this.isStoreManagementExpanded; }
  togglePurchaseQuotations(): void { this.isPurchaseQuotationsExpanded = !this.isPurchaseQuotationsExpanded; }
  toggleSalesOrders(): void { this.isSalesOrdersExpanded = !this.isSalesOrdersExpanded; }
  toggleSalesItems(): void { this.isSalesItemsExpanded = !this.isSalesItemsExpanded; }
  toggleSalesCredit(): void { this.isSalesCreditExpanded = !this.isSalesCreditExpanded; }
  toggleSalesPromotion(): void { this.isSalesPromotionExpanded = !this.isSalesPromotionExpanded; }
  toggleBankAccounts(): void { this.isBankAccountsExpanded = !this.isBankAccountsExpanded; }

  // Others
  togglePurchaseItems(): void { this.isPurchaseItemsExpanded = !this.isPurchaseItemsExpanded; }
  toggleProductionOrder(): void { this.isProductionOrderExpanded = !this.isProductionOrderExpanded; }
  toggleStockTransfer(): void { this.isStockTransferExpanded = !this.isStockTransferExpanded; }

  // Items management nested toggles
  toggleItemsManagement(): void { this.isItemsManagementExpanded = !this.isItemsManagementExpanded; }
  toggleUnitOfMeasure(): void { this.isUnitOfMeasureExpanded = !this.isUnitOfMeasureExpanded; }
  toggleItemCategories(): void { this.isItemCategoriesExpanded = !this.isItemCategoriesExpanded; }
  toggleItems(): void { this.isItemsExpanded = !this.isItemsExpanded; }

  // Customer
  toggleCustomerManagement(): void { this.isCustomerManagementExpanded = !this.isCustomerManagementExpanded; }

  // Logout - simple navigation; adapt to your auth flow if needed
  logout(): void {
    // If you have a logout action/service, call it here instead
    this.router.navigate(['/login']);
  }
}