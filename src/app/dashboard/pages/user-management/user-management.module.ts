import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management.component';
import { UsersComponent } from './users/users.component';


@NgModule({
  declarations: [
    UserManagementComponent,
    //UsersComponent
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule
  ]
})
export class UserManagementModule { }
