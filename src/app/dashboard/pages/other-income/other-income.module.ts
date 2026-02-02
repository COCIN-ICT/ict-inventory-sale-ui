import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { OtherIncomeRoutingModule } from './other-income-routing.module';
import { OtherIncomeComponent } from './other-income.component';
import { OtherIncomeListComponent } from './components/other-income-list/other-income-list.component';
import { OtherIncomeCreateComponent } from './components/other-income-create/other-income-create.component';
import { OtherIncomeDetailsComponent } from './components/other-income-details/other-income-details.component';

@NgModule({
  declarations: [
    OtherIncomeComponent,
    OtherIncomeListComponent,
    OtherIncomeCreateComponent,
    OtherIncomeDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    OtherIncomeRoutingModule
  ]
})
export class OtherIncomeModule { }

