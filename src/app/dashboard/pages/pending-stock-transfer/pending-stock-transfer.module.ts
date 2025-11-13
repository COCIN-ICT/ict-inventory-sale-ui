import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PendingStockTransferRoutingModule } from './pending-stock-transfer-routing.module';
import { PendingStockTransferComponent } from './pending-stock-transfer.component';


@NgModule({
  declarations: [
    PendingStockTransferComponent
  ],
  imports: [
    CommonModule,
    PendingStockTransferRoutingModule
  ]
})
export class PendingStockTransferModule { }
