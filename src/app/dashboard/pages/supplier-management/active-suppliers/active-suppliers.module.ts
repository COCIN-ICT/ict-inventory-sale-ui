import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActiveSuppliersComponent } from './active-suppliers.component';
import { ActiveSuppliersRoutingModule } from './active-suppliers-routing.module';

@NgModule({
  declarations: [
    ActiveSuppliersComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ActiveSuppliersRoutingModule
  ]
})
export class ActiveSuppliersModule { } 