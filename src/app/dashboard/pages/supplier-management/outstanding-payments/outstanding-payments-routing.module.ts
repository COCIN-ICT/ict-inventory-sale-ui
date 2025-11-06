import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutstandingPaymentsComponent } from './outstanding-payments.component';

const routes: Routes = [{ path: '', component: OutstandingPaymentsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutstandingPaymentsRoutingModule { }

