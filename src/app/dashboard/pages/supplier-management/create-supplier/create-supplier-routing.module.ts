import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSupplierComponent } from './create-supplier.component';

const routes: Routes = [{ path: '', component: CreateSupplierComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateSupplierRoutingModule { } 