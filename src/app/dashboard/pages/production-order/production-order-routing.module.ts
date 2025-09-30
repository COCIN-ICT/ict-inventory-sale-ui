import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductionOrderComponent } from './production-order.component';

const routes: Routes = [{ path: '', component: ProductionOrderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionOrderRoutingModule { }
