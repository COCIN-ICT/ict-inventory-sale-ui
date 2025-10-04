import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductionOrderRoutingModule } from './production-order-routing.module';
import { ProductionOrderComponent } from './production-order.component';
import { ProudctionOrderListComponent } from './components/proudction-order-list/proudction-order-list.component';
import { ProudctionOrderFormComponent } from './components/proudction-order-form/proudction-order-form.component';
import { ProductionOrderDetailComponent } from './components/production-order-detail/production-order-detail.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProductionOrderComponent,
    ProudctionOrderListComponent,
    ProudctionOrderFormComponent,
    ProductionOrderDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProductionOrderRoutingModule,
    
  ]
})
export class ProductionOrderModule { }