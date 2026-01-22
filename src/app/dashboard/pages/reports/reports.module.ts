import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { SalesOrderReportComponent } from './components/sales-order-report/sales-order-report.component';
import { PurchaseOrderReportComponent } from './components/purchase-order-report/purchase-order-report.component';
import { ProductionOrderReportComponent } from './components/production-order-report/production-order-report.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    ReportsComponent,
    SalesOrderReportComponent,
    PurchaseOrderReportComponent,
    ProductionOrderReportComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule
  ]
})
export class ReportsModule { }
