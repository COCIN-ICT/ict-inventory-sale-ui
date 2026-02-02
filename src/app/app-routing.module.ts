import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './layout/main/main.component';
import { AllUsersComponent } from './dashboard/pages/all-users/all-users.component';
import { AuthGuard } from './auth/auth.guard';
import { PermissionGuard } from './auth/permission.guard';
import { EditSupplierComponent } from './dashboard/pages/supplier-management/edit-supplier/edit-supplier.component';
import { SupplierDetailsComponent } from './dashboard/pages/supplier-management/supplier-details/supplier-details.component';
import { SalesOrderListComponent } from './dashboard/pages/sales-order/sales-order-list/sales-order-list.component';
import { SalesOrderCreateComponent } from './dashboard/pages/sales-order/sales-order-create/sales-order-create.component';
import { SalesOrderEditComponent } from './dashboard/pages/sales-order/sales-order-edit/sales-order-edit.component';
import { SalesCreditListComponent } from './dashboard/pages/sales-credit/sales-credit-list/sales-credit-list.component';
import { SalesCreditCreateComponent } from './dashboard/pages/sales-credit/sales-credit-create/sales-credit-create.component';
import { SalesCreditDetailsComponent } from './dashboard/pages/sales-credit/sales-credit-details/sales-credit-details.component';
import { SalesCreditPendingComponent } from './dashboard/pages/sales-credit/sales-credit-pending/sales-credit-pending.component';
import { SalesPromotionListComponent } from './dashboard/pages/sales-promotion/sales-promotion-list/sales-promotion-list.component';
import { SalesPromotionCreateComponent } from './dashboard/pages/sales-promotion/sales-promotion-create/sales-promotion-create.component';
import { SalesPromotionEditComponent } from './dashboard/pages/sales-promotion/sales-promotion-edit/sales-promotion-edit.component';
import { SalesPromotionDetailsComponent } from './dashboard/pages/sales-promotion/sales-promotion-details/sales-promotion-details.component';
import { SalesPromotionByStockComponent } from './dashboard/pages/sales-promotion/sales-promotion-by-stock/sales-promotion-by-stock.component';
import { SalesItemsListComponent } from './dashboard/pages/sales-items/sales-items-list/sales-items-list.component';
import { SalesItemsCreateComponent } from './dashboard/pages/sales-items/sales-items-create/sales-items-create.component';


const routes: Routes = [
  {path: 'login', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path:'home', component: MainComponent, canActivate: [AuthGuard],
    children: [
      { path: 'users', component: AllUsersComponent},

      { path: '', loadChildren: () => import('./dashboard/pages/home/home.module').then(m => m.HomeModule) }, 
      { path: 'user-management/users', loadChildren: () => import('./dashboard/pages/user-management/users/users.module').then(m => m.UsersModule) },
      { path: 'user-management/create-user', loadChildren: () => import('./dashboard/pages/user-management/create-user/create-user.module').then(m => m.CreateUserModule) },
      { path: 'user-management/user-roles', loadChildren: () => import('./dashboard/pages/user-management/user-roles/user-roles.module').then(m => m.UserRolesModule) },
      { path: 'user-management/permissions', loadChildren: () => import('./dashboard/pages/user-management/permissions/permissions.module').then(m => m.PermissionsModule) },
      { path: 'user-management/departments', loadChildren: () => import('./dashboard/pages/user-management/departments/departments.module').then(m => m.DepartmentsModule) },
      { path: 'user-management/deactivated-users', loadChildren: () => import('./dashboard/pages/user-management/deactivated-users/deactivated-users.module').then(m => m.DeactivatedUsersModule) },
      { path: 'user-management/units', loadChildren: () => import('./dashboard/pages/user-management/unit/unit.module').then(m => m.UnitModule) },
      // Supplier Management Routes
      { path: 'supplier-management/suppliers', loadChildren: () => import('./dashboard/pages/supplier-management/all-suppliers/all-suppliers.module').then(m => m.AllSuppliersModule) },
      { path: 'supplier-management/create-supplier', loadChildren: () => import('./dashboard/pages/supplier-management/create-supplier/create-supplier.module').then(m => m.CreateSupplierModule) },
      { path: 'supplier-management/active-suppliers', loadChildren: () => import('./dashboard/pages/supplier-management/active-suppliers/active-suppliers.module').then(m => m.ActiveSuppliersModule) },
      { path: 'supplier-management/supplier-history', loadChildren: () => import('./dashboard/pages/supplier-management/supplier-history/supplier-history.module').then(m => m.SupplierHistoryModule) },
      { path: 'supplier-management/outstanding-payments', loadChildren: () => import('./dashboard/pages/supplier-management/outstanding-payments/outstanding-payments.module').then(m => m.OutstandingPaymentsModule) },
      { path: 'supplier-management/supplier-details/:id', component: SupplierDetailsComponent },
      { path: 'supplier-management/edit-supplier/:id', component: EditSupplierComponent },

      // Unit of Measure Routes
      { path: 'unit-of-measure', loadChildren: () => import('./dashboard/pages/unit-of-measure/unit-of-measure.module').then(m => m.UnitOfMeasureModule) },
      // Purchase Quotation Routes
      { path: 'purchase-quotation', loadChildren: () => import('./dashboard/pages/purchase-quotation/purchase-quotation.module').then(m => m.PurchaseQuotationModule) },
      // Item Category Routes
      { path: 'item-category', loadChildren: () => import('./dashboard/pages/item-category/item-category.module').then(m => m.ItemCategoryModule) },
      // Item Routes
      { path: 'item', loadChildren: () => import('./dashboard/pages/item/item.module').then(m => m.ItemModule) },

      // Items Management Route
      { path: 'items-management', loadChildren: () => import('./dashboard/pages/items-management/items-management.module').then(m => m.ItemsManagementModule) },

      { path: 'store', loadChildren: () => import('./dashboard/pages/store/store.module').then(m => m.StoreModule) },

    

      //bank account
      { path: 'bank-account', loadChildren: () => import('./dashboard/pages/bank-account/bank-account.module').then(m => m.BankAccountModule) },

      //purchase item
      { path: 'purchase-item', loadChildren: () => import('./dashboard/pages/purchase-item/purchase-item.module').then(m => m.PurchaseItemModule) },

      { path: 'production-order', loadChildren: () => import('./dashboard/pages/production-order/production-order.module').then(m => m.ProductionOrderModule) },

      { path: 'stock-transfer', loadChildren: () => import('./dashboard/pages/stock-transfer/stock-transfer.module').then(m => m.StockTransferModule) },

    
      { path: 'pricing', loadChildren: () => import('./dashboard/pages/pricing/pricing.module').then(m => m.PricingModule) },

      { path: 'stock-detail', loadChildren: () => import('./dashboard/pages/stock-detail/stock-detail.module').then(m => m.StockDetailModule) },
      //purchase order
      { path: 'purchase-order', loadChildren: () => import('./dashboard/pages/purchase-order/purchase-order.module').then(m => m.PurchaseOrderModule) },

      //budget
      { path: 'budget', loadChildren: () => import('./dashboard/pages/budget/budget.module').then(m => m.BudgetModule),
        canActivate: [PermissionGuard],
        data: { permission: 'BUDGET_READ'}
       },

      // other expense
      { path: 'other-expense', loadChildren: () => import('./dashboard/pages/other-expense/other-expense.module').then(m => m.OtherExpenseModule) },

      // other income
      { path: 'other-income', loadChildren: () => import('./dashboard/pages/other-income/other-income.module').then(m => m.OtherIncomeModule) },

      //reports
      { path: 'reports', loadChildren: () => import('./dashboard/pages/reports/reports.module').then(m => m.ReportsModule) },

      { path: 'sales-order', component: SalesOrderListComponent },
      { path: 'sales-order/create', component: SalesOrderCreateComponent },
      { path: 'sales-order/:id/edit', component: SalesOrderEditComponent },
      { path: 'sales-order/:id', component: SalesOrderEditComponent }, // or view component if added

      // Sales Credit Routes
      { path: 'sales-credit', component: SalesCreditListComponent },
      { path: 'sales-credit/create', component: SalesCreditCreateComponent },
      { path: 'sales-credit/:id', component: SalesCreditDetailsComponent },
      { path: 'sales-credit/pending', component: SalesCreditPendingComponent },

      // Sales Promotion Routes
      { path: 'sales-promotion', component: SalesPromotionListComponent },
      { path: 'sales-promotion/create', component: SalesPromotionCreateComponent },
      { path: 'sales-promotion/:id', component: SalesPromotionDetailsComponent },
      { path: 'sales-promotion/:id/edit', component: SalesPromotionEditComponent },
      { path: 'sales-promotion/by-stock', component: SalesPromotionByStockComponent },

      // Sales Items Routes
      { path: 'sales-items', component: SalesItemsListComponent },
      { path: 'sales-items/create', component: SalesItemsCreateComponent },


       { path: 'customers', loadChildren: () => import('./dashboard/pages/customers/customers.module').then(m => m.CustomersModule) },
       //pending stock transfer
       { path: 'pending-stock-transfer', loadChildren: () => import('./dashboard/pages/pending-stock-transfer/pending-stock-transfer.module').then(m => m.PendingStockTransferModule) },

    ]
  },
 
  

  //{ path: 'production-order', loadChildren: () => import('./dashboard/pages/production-order/production-order.module').then(m => m.ProductionOrderModule) },
 // { path: 'user-management', loadChildren: () => import('./dashboard/pages/user-management/user-management.module').then(m => m.UserManagementModule) 
      //purchase order

    
  // { path: 'user-management', loadChildren: () => import('./dashboard/pages/user-management/user-management.module').then(m => m.UserManagementModule) }

  // { path: 'user-management', loadChildren: () => import('./dashboard/pages/user-management/user-management.module').then(m => m.UserManagementModule) },


  

  // { path: 'permissions', loadChildren: () => import('./dashboard/pages/permissions/permissions.module').then(m => m.PermissionsModule) },
  // { path: 'departments', loadChildren: () => import('./dashboard/pages/departments/departments.module').then(m => m.DepartmentsModule) },
 

  

  // { path: '/users', component: AllUsersComponent},
  { path: '**', redirectTo: 'login' } // wildcard for unknown routes

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
