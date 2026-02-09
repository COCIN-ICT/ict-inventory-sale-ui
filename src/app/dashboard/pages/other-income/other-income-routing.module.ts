import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtherIncomeComponent } from './other-income.component';
import { OtherIncomeListComponent } from './components/other-income-list/other-income-list.component';
import { OtherIncomeCreateComponent } from './components/other-income-create/other-income-create.component';
import { OtherIncomeDetailsComponent } from './components/other-income-details/other-income-details.component';

const routes: Routes = [
  {
    path: '',
    component: OtherIncomeComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: OtherIncomeListComponent },
      { path: 'create', component: OtherIncomeCreateComponent },
      { path: 'details/:id', component: OtherIncomeDetailsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherIncomeRoutingModule { }
