import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {

  navItems = [
    { label: 'Dashboard', icon: 'bi bi-house-door', active: true },
    { label: 'Purchase', icon: 'bi bi-cart3', active: false },
    { label: 'Production', icon: 'bi bi-cpu', active: false },
    { label: 'Point of sales', icon: 'bi bi-hash', active: false },
    { label: 'Report', icon: 'bi bi-journal-text', active: false },
    { label: 'Dashboard', icon: 'bi bi-house-door', active: false },
    { label: 'Admin', icon: 'bi bi-shield-lock', active: false, hasSubmenu: true },
  ];


  // Admin group toggles
  isAdminExpanded = false;
  isUserManagementExpanded = false;
  isSupplierManagementExpanded = false;
  isStoreManagementExpanded = false;
  isPurchaseOrdersExpanded = false;
  isSalesOrdersExpanded = false; // <--- added
  isSalesItemsExpanded = false; // <--- new
  isSalesCreditExpanded = false; // <--- added
  isSalesPromotionExpanded = false; // <--- added
  isBankAccountsExpanded = false;

  // Other group toggles
  isPointOfSaleExpanded = false;
  isProductionOrderExpanded = false;
  isStockTransferExpanded = false;


  // Customer management
  isCustomerManagementExpanded = false;

  constructor(private router: Router, public authService: AuthService) {}

  // Top-level
  toggleAdmin(): void { this.isAdminExpanded = !this.isAdminExpanded; }

  // Admin children
  toggleUserManagement(): void { this.isUserManagementExpanded = !this.isUserManagementExpanded; }
  toggleSupplierManagement(): void { this.isSupplierManagementExpanded = !this.isSupplierManagementExpanded; }
  toggleStoreManagement(): void { this.isStoreManagementExpanded = !this.isStoreManagementExpanded; }
  togglePurchaseOrders(): void { this.isPurchaseOrdersExpanded = !this.isPurchaseOrdersExpanded; }
  toggleSalesOrders(): void { this.isSalesOrdersExpanded = !this.isSalesOrdersExpanded; }
  toggleSalesItems(): void { this.isSalesItemsExpanded = !this.isSalesItemsExpanded; }
  toggleSalesCredit(): void { this.isSalesCreditExpanded = !this.isSalesCreditExpanded; }
  toggleSalesPromotion(): void { this.isSalesPromotionExpanded = !this.isSalesPromotionExpanded; }
  toggleBankAccounts(): void { this.isBankAccountsExpanded = !this.isBankAccountsExpanded; }

  // Others
  togglePointOfSale(): void { this.isPointOfSaleExpanded = !this.isPointOfSaleExpanded; }
  toggleProductionOrder(): void { this.isProductionOrderExpanded = !this.isProductionOrderExpanded; }
  toggleStockTransfer(): void { this.isStockTransferExpanded = !this.isStockTransferExpanded; }


  // Customer
  toggleCustomerManagement(): void { this.isCustomerManagementExpanded = !this.isCustomerManagementExpanded; }

  // Logout - simple navigation; adapt to your auth flow if needed
  logout(): void {
    // If you have a logout action/service, call it here instead
    this.router.navigate(['/login']);
  }

  // sidebar.component.ts
onLogout() {
  this.authService.logout();
}

}