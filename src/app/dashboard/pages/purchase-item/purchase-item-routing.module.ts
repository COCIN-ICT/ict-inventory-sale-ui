import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseItemComponent } from './purchase-item.component';

const routes: Routes = [{ path: '', component: PurchaseItemComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseItemRoutingModule { }
