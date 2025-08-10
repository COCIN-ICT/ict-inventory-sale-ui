import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActiveSuppliersComponent } from './active-suppliers.component';

const routes: Routes = [{ path: '', component: ActiveSuppliersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActiveSuppliersRoutingModule { } 