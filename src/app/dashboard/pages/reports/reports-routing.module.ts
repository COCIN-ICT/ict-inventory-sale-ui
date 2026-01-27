import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { SalesOrderReportComponent } from './components/sales-order-report/sales-order-report.component';
import { PurchaseOrderReportComponent } from './components/purchase-order-report/purchase-order-report.component';
import { ProductionOrderReportComponent } from './components/production-order-report/production-order-report.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent
  },
  {
    path: 'sales-order',
    component: SalesOrderReportComponent
  },
  {
    path: 'purchase-order',
    component: PurchaseOrderReportComponent
  },
  {
    path: 'production-order',
    component: ProductionOrderReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
