import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockDetailRoutingModule } from './stock-detail-routing.module';
import { StockDetailComponent } from './stock-detail.component';


@NgModule({
  declarations: [
    StockDetailComponent
  ],
  imports: [
    CommonModule,
    StockDetailRoutingModule
  ]
})
export class StockDetailModule { }
