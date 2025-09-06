import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseOrderRoutingModule } from './purchase-order-routing.module';
import { PurchaseOrderComponent } from './purchase-order.component';
import { PurchaseOrderListComponent } from './components/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderDetailsComponent } from './components/purchase-order-details/purchase-order-details.component';


@NgModule({
  declarations: [
    PurchaseOrderComponent,
    PurchaseOrderListComponent,
    PurchaseOrderDetailsComponent
  ],
  imports: [
    CommonModule,
    PurchaseOrderRoutingModule
  ]
})
export class PurchaseOrderModule { }
