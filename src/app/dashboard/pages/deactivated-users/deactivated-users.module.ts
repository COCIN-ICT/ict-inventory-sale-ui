import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeactivatedUsersRoutingModule } from './deactivated-users-routing.module';
import { DeactivatedUsersComponent } from './deactivated-users.component';


@NgModule({
  declarations: [
    DeactivatedUsersComponent
  ],
  imports: [
    CommonModule,
    DeactivatedUsersRoutingModule
  ]
})
export class DeactivatedUsersModule { }
