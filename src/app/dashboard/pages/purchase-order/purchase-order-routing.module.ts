import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseOrderComponent } from './purchase-order.component';
import { PurchaseOrderDetailsComponent } from './components/purchase-order-details/purchase-order-details.component';
import { PurchaseOrderListComponent } from './components/purchase-order-list/purchase-order-list.component';

const routes: Routes = [
  {path: '', 
   component: PurchaseOrderComponent,
   children: [
     {path: '', component: PurchaseOrderListComponent},
     {path: 'details/:id', component: PurchaseOrderDetailsComponent}
   ]
 }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseOrderRoutingModule { }
