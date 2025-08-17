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
      { path: 'create-user', loadChildren: () => import('./dashboard/pages/create-user/create-user.module').then(m => m.CreateUserModule) },
      { path: 'user-roles', loadChildren: () => import('./dashboard/pages/user-roles/user-roles.module').then(m => m.UserRolesModule) },
      { path: 'permissions', loadChildren: () => import('./dashboard/pages/permissions/permissions.module').then(m => m.PermissionsModule) },
      { path: 'deactivated-users', loadChildren: () => import('./dashboard/pages/deactivated-users/deactivated-users.module').then(m => m.DeactivatedUsersModule) },
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
    ]
  },
  { path: 'permissions', loadChildren: () => import('./dashboard/pages/permissions/permissions.module').then(m => m.PermissionsModule) },
 

  

  // { path: '/users', component: AllUsersComponent},
  { path: '**', redirectTo: 'login' } // wildcard for unknown routes

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
