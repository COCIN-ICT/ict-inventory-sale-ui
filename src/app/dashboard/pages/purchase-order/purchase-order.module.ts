import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PurchaseOrderRoutingModule } from './purchase-order-routing.module';
import { PurchaseOrderComponent } from './purchase-order.component';
import { PurchaseOrderListComponent } from './components/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderDetailsComponent } from './components/purchase-order-details/purchase-order-details.component';
import { PurchaseOrderCreateComponent } from './components/purchase-order-create/purchase-order-create.component';
import { PurchaseOrderVettingComponent } from './components/purchase-order-vetting/purchase-order-vetting.component';


@NgModule({
  declarations: [
    PurchaseOrderComponent,
    PurchaseOrderListComponent,
    PurchaseOrderDetailsComponent,
    PurchaseOrderCreateComponent,
    PurchaseOrderVettingComponent
  ],
  imports: [
    CommonModule,
    PurchaseOrderRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class PurchaseOrderModule { }
