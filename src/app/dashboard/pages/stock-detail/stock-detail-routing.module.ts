import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockDetailComponent } from './stock-detail.component';

const routes: Routes = [
  { path: '', component: StockDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockDetailRoutingModule { }
