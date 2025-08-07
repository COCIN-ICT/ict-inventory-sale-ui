import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllSuppliersComponent } from './all-suppliers.component';

const routes: Routes = [{ path: '', component: AllSuppliersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllSuppliersRoutingModule { } 