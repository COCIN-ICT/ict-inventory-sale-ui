import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

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

  constructor(private router: Router, private authService: AuthService) {}

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