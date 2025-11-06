import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SupplierHistoryComponent } from './supplier-history.component';
import { SupplierHistoryRoutingModule } from './supplier-history-routing.module';

@NgModule({
  declarations: [
    SupplierHistoryComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    SupplierHistoryRoutingModule
  ]
})
export class SupplierHistoryModule { }

