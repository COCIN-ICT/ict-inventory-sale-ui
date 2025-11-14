import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingStockTransferComponent } from './pending-stock-transfer.component';

const routes: Routes = [{ path: '', component: PendingStockTransferComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PendingStockTransferRoutingModule { }
