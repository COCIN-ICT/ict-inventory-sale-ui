import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { MainLayoutComponent } from '../core/layout/main-layout/main-layout.component';
import { CreateUserComponent } from './pages/users/create-user/create-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';


@NgModule({
  declarations: [
    HomeComponent,
    MainLayoutComponent,
    CreateUserComponent,
    UserListComponent,
    DashboardLayoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
