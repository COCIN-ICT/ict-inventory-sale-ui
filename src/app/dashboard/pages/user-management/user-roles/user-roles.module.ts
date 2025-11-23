import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRolesRoutingModule } from './user-roles-routing.module';
import { UserRolesComponent } from './user-roles.component';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { SharedModule } from '../../../../shared/shared.module';



@NgModule({
  declarations: [
    UserRolesComponent,
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    UserRolesRoutingModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    SharedModule
  ]
})
export class UserRolesModule { }
