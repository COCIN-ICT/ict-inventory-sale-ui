import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { CreateUserComponent } from '../dashboard/pages/users/create-user/create-user.component';

const routes: Routes = [
  {path: '', component: MainLayoutComponent, 
    children: [
      {path: 'users/create', component: CreateUserComponent},
      {
      path: 'dashboard',
      loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule)
    }
      
]}
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class CoreRoutingModule { }
