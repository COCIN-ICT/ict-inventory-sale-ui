import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { Router } from 'express';
import { RouterModule } from '@angular/router';
import { A11yModule } from "@angular/cdk/a11y";


@NgModule({
  declarations: [
    UsersComponent,
    UserFormComponent,
    UserListComponent,
    UserDetailsComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    A11yModule
]
})
export class UsersModule { }
