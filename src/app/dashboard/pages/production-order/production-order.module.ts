import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductionOrderRoutingModule } from './production-order-routing.module';
import { ProductionOrderComponent } from './production-order.component';


@NgModule({
  declarations: [
    ProductionOrderComponent
  ],
  imports: [
    CommonModule,
    ProductionOrderRoutingModule
  ]
})
export class ProductionOrderModule { }
