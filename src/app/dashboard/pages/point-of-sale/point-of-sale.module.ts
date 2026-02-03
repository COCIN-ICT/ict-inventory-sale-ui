import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointOfSaleRoutingModule } from './point-of-sale-routing.module';
import { PointOfSaleComponent } from './point-of-sale.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    PointOfSaleComponent
  ],
  imports: [
    CommonModule,
    PointOfSaleRoutingModule,
    MatIconModule
  ]
})
export class PointOfSaleModule { }
