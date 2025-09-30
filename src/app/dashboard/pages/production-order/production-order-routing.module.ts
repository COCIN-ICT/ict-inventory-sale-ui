import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductionOrderComponent } from './production-order.component';
import { ProductionOrderDetailComponent} from './components/production-order-detail/production-order-detail.component'
import { ProudctionOrderListComponent } from './components/proudction-order-list/proudction-order-list.component';

const routes: Routes = [
  {
    path: '',
    component: ProductionOrderComponent,
    children: [
      { path: '', component: ProudctionOrderListComponent },
      { path: ':id', component: ProductionOrderDetailComponent } // simpler
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionOrderRoutingModule { }
