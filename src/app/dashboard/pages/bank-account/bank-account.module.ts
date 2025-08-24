import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankAccountRoutingModule } from './bank-account-routing.module';
import { BankAccountComponent } from './bank-account.component';
import { BankAccountListComponent } from './components/bank-account-list/bank-account-list.component';
import { BankAccountFormComponent } from './components/bank-account-form/bank-account-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BankAccountComponent,
    BankAccountListComponent,
    BankAccountFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BankAccountRoutingModule
  ]
})
export class BankAccountModule { }
