import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtherExpenseComponent } from './other-expense.component';
import { OtherExpenseListComponent } from './components/other-expense-list/other-expense-list.component';
import { OtherExpenseCreateComponent } from './components/other-expense-create/other-expense-create.component';
import { OtherExpenseDetailsComponent } from './components/other-expense-details/other-expense-details.component';

const routes: Routes = [
  {
    path: '',
    component: OtherExpenseComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: OtherExpenseListComponent },
      { path: 'create', component: OtherExpenseCreateComponent },
      { path: 'details/:id', component: OtherExpenseDetailsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherExpenseRoutingModule { }
