import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SupplierDetailsRoutingModule } from './supplier-details-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    SupplierDetailsRoutingModule
  ],
  exports: []
})
export class SupplierDetailsModule { } 