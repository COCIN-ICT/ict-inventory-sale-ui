import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateSupplierComponent } from './create-supplier.component';
import { CreateSupplierRoutingModule } from './create-supplier-routing.module';

@NgModule({
  declarations: [
    CreateSupplierComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CreateSupplierRoutingModule
  ]
})
export class CreateSupplierModule { } 