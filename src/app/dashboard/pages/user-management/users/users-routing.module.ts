import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserListComponent } from './components/user-list/user-list.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent, // The parent route for user-management/users
    children: [
      { path: '', component: UserListComponent }, // e.g., /home/user-management/users
      { path: 'details/:id', component: UserDetailsComponent } // e.g., /home/user-management/users/details/123
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
