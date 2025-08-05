import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './layout/main/main.component';
import { AllUsersComponent } from './dashboard/pages/all-users/all-users.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {path: 'login', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path:'home', component: MainComponent, canActivate: [AuthGuard],
    children: [
      { path: 'users', component: AllUsersComponent},
      { path: '', loadChildren: () => import('./dashboard/pages/home/home.module').then(m => m.HomeModule) }, 
      { path: 'create-user', loadChildren: () => import('./dashboard/pages/create-user/create-user.module').then(m => m.CreateUserModule) },
      { path: 'user-roles', loadChildren: () => import('./dashboard/pages/user-roles/user-roles.module').then(m => m.UserRolesModule) },
      { path: 'deactivated-users', loadChildren: () => import('./dashboard/pages/deactivated-users/deactivated-users.module').then(m => m.DeactivatedUsersModule) },
    ]
  },
 

  

  // { path: '/users', component: AllUsersComponent},
  { path: '**', redirectTo: 'login' } // wildcard for unknown routes

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
