import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AllUsersComponent } from './all-users.component';



@NgModule({
  declarations: [
    AllUsersComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ]
})
export class AllUsersModule { }
