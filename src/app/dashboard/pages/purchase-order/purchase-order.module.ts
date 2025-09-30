import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseOrderRoutingModule } from './purchase-order-routing.module';
import { PurchaseOrderComponent } from './purchase-order.component';
import { PurchaseOrderListComponent } from './components/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderDetailsComponent } from './components/purchase-order-details/purchase-order-details.component';
import { PurchaseOrderFormComponent } from './components/purchase-order-form/purchase-order-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    PurchaseOrderComponent,
    PurchaseOrderListComponent,
    PurchaseOrderDetailsComponent,
    PurchaseOrderFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PurchaseOrderRoutingModule,
    MatIconModule
  ]
})
export class PurchaseOrderModule { }
