import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierHistoryComponent } from './supplier-history.component';

const routes: Routes = [{ path: '', component: SupplierHistoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierHistoryRoutingModule { }

