import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesOrderComponent } from './sales-order.component';
import { SalesOrderListComponent } from './components/sales-order-list/sales-order-list.component';
import { SalesOrderCreateComponent } from './components/sales-order-create/sales-order-create.component';
import { SalesOrderDetailsComponent } from './components/sales-order-details/sales-order-details.component';

const routes: Routes = [
  {
    path: '',
    component: SalesOrderComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: SalesOrderListComponent },
      { path: 'create', component: SalesOrderCreateComponent },
      { path: 'details/:id', component: SalesOrderDetailsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesOrderRoutingModule { }
