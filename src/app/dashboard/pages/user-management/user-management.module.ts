import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management.component';
import { UsersComponent } from './users/users.component';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  declarations: [
    UserManagementComponent,
    
    //UsersComponent
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    SharedModule
  ]
})
export class UserManagementModule { }
