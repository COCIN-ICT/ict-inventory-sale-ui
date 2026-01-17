import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemsManagementComponent } from './items-management.component';

const routes: Routes = [
  {
    path: '',
    component: ItemsManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsManagementRoutingModule { }
