import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { OutstandingPaymentsComponent } from './outstanding-payments.component';
import { OutstandingPaymentsRoutingModule } from './outstanding-payments-routing.module';

@NgModule({
  declarations: [
    OutstandingPaymentsComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    OutstandingPaymentsRoutingModule
  ]
})
export class OutstandingPaymentsModule { }

