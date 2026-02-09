import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SalesCreditStubComponent } from './sales-credit-stub.component';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [
  { path: '', component: SalesCreditStubComponent }
];

@NgModule({
  declarations: [SalesCreditStubComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule
  ]
})
export class SalesCreditStubModule { }
