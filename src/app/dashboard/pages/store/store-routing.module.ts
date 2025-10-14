import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreComponent } from './store.component';
import { StoreListComponent } from './components/store-list/store-list.component';
import { StoreDetailsComponent } from './components/store-details/store-details.component';

const routes: Routes = [{ 
  path: '', component: StoreComponent,
  children: [
    { path: '', component: StoreListComponent},
    { path: 'details/:id', component: StoreDetailsComponent }
  ] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
