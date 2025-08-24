import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './layout/main/main.component';
import { AllUsersComponent } from './dashboard/pages/all-users/all-users.component';
import { AuthGuard } from './auth/auth.guard';
import { EditSupplierComponent } from './dashboard/pages/supplier-management/edit-supplier/edit-supplier.component';
import { SupplierDetailsComponent } from './dashboard/pages/supplier-management/supplier-details/supplier-details.component';


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
      { path: 'supplier-management/supplier-details/:id', component: SupplierDetailsComponent },
      { path: 'supplier-management/edit-supplier/:id', component: EditSupplierComponent },

      // Unit of Measure Routes
      { path: 'unit-of-measure', loadChildren: () => import('./dashboard/pages/unit-of-measure/unit-of-measure.module').then(m => m.UnitOfMeasureModule) },
      // Purchase Quotation Routes
      { path: 'purchase-quotation', loadChildren: () => import('./dashboard/pages/purchase-quotation/purchase-quotation.module').then(m => m.PurchaseQuotationModule) },


      { path: 'store', loadChildren: () => import('./dashboard/pages/store/store.module').then(m => m.StoreModule) },

    

      //bank account
      { path: 'bank-account', loadChildren: () => import('./dashboard/pages/bank-account/bank-account.module').then(m => m.BankAccountModule) },

      //purchase item
      { path: 'purchase-item', loadChildren: () => import('./dashboard/pages/purchase-item/purchase-item.module').then(m => m.PurchaseItemModule) },

    ]
  },
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
