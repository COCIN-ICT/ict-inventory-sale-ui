import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from '../core/layout/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { CreateUserComponent } from './pages/users/create-user/create-user.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
       { path: 'home', component: HomeComponent },
      { path: 'create-user', component: CreateUserComponent },
      { path: 'users', component: UserListComponent},
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
