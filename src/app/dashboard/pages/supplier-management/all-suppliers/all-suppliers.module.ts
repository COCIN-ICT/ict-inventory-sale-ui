import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AllSuppliersComponent } from './all-suppliers.component';
import { AllSuppliersRoutingModule } from './all-suppliers-routing.module';

@NgModule({
  declarations: [
    AllSuppliersComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AllSuppliersRoutingModule
  ]
})
export class AllSuppliersModule { } 