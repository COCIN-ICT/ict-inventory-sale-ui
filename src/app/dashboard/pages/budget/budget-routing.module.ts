import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetComponent } from './budget.component';
import { BudgetListComponent } from './components/budget-list/budget-list.component';
import { BudgetCreateComponent } from './components/budget-create/budget-create.component';
import { BudgetDetailsComponent } from './components/budget-details/budget-details.component';

const routes: Routes = [
  {
    path: '',
    component: BudgetComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: BudgetListComponent },
      { path: 'create', component: BudgetCreateComponent },
      { path: 'details/:id', component: BudgetDetailsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetRoutingModule { }
