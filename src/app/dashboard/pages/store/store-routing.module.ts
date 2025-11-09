import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreComponent } from './store.component';
import { StoreListComponent } from './components/store-list/store-list.component';
import { StoreDetailsComponent } from './components/store-details/store-details.component';
import { StockDetailsComponent } from './components/stock-details/stock-details.component';
import { AuthGuard } from '../../../auth/auth.guard';

const routes: Routes = [{ 
  path: '', component: StoreComponent,
  canActivate: [AuthGuard],
  children: [
    { path: '', component: StoreListComponent},
    { path: 'details/:id', component: StoreDetailsComponent },
    { path: 'details/:storeId/stock/:stockId', component: StockDetailsComponent }
  ] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
