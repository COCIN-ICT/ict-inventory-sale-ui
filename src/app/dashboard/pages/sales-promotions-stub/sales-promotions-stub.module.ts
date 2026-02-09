import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SalesPromotionsStubComponent } from './sales-promotions-stub.component';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [
  { path: '', component: SalesPromotionsStubComponent }
];

@NgModule({
  declarations: [SalesPromotionsStubComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule
  ]
})
export class SalesPromotionsStubModule { }
