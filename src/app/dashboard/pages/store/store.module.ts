import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreRoutingModule } from './store-routing.module';
import { StoreComponent } from './store.component';
import { StoreFormComponent } from './components/store-form/store-form.component';
import { StoreListComponent } from './components/store-list/store-list.component';


@NgModule({
  declarations: [
    StoreComponent,
    StoreFormComponent,
    StoreListComponent
  ],
  imports: [
    CommonModule,
    StoreRoutingModule
  ]
})
export class StoreModule { }
