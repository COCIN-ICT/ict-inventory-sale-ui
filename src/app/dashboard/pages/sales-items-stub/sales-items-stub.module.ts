import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SalesItemsStubComponent } from './sales-items-stub.component';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [
  { path: '', component: SalesItemsStubComponent }
];

@NgModule({
  declarations: [SalesItemsStubComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule
  ]
})
export class SalesItemsStubModule { }
