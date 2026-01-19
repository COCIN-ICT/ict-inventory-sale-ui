import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemsManagementRoutingModule } from './items-management-routing.module';
import { ItemsManagementComponent } from './items-management.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    ItemsManagementComponent
  ],
  imports: [
    CommonModule,
    ItemsManagementRoutingModule,
    MatIconModule
  ]
})
export class ItemsManagementModule { }
