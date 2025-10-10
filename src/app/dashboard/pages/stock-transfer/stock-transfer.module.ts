import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockTransferRoutingModule } from './stock-transfer-routing.module';
import { StockTransferComponent } from './stock-transfer.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    StockTransferComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StockTransferRoutingModule
  ]
})
export class StockTransferModule { }
