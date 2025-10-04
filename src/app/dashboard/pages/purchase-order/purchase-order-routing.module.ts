import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseOrderComponent } from './purchase-order.component';
import { PurchaseOrderCreateComponent } from './components/purchase-order-create/purchase-order-create.component';
import { PurchaseOrderListComponent } from './components/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderDetailsComponent } from './components/purchase-order-details/purchase-order-details.component';
import { PurchaseOrderVettingComponent } from './components/purchase-order-vetting/purchase-order-vetting.component';

const routes: Routes = [
  {
    path: '',
    component: PurchaseOrderComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: PurchaseOrderListComponent },
      { path: 'create', component: PurchaseOrderCreateComponent },
      { path: 'details/:id', component: PurchaseOrderDetailsComponent },
      { path: 'vetting', component: PurchaseOrderVettingComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseOrderRoutingModule { }
