import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { OtherExpenseRoutingModule } from './other-expense-routing.module';
import { OtherExpenseComponent } from './other-expense.component';
import { OtherExpenseListComponent } from './components/other-expense-list/other-expense-list.component';
import { OtherExpenseCreateComponent } from './components/other-expense-create/other-expense-create.component';
import { OtherExpenseDetailsComponent } from './components/other-expense-details/other-expense-details.component';

@NgModule({
  declarations: [
    OtherExpenseComponent,
    OtherExpenseListComponent,
    OtherExpenseCreateComponent,
    OtherExpenseDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    OtherExpenseRoutingModule
  ]
})
export class OtherExpenseModule { }

