import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreRoutingModule } from './store-routing.module';
import { StoreComponent } from './store.component';
import { StoreFormComponent } from './components/store-form/store-form.component';
import { StoreListComponent } from './components/store-list/store-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreDetailsComponent } from './components/store-details/store-details.component';
import { StockDetailsComponent } from './components/stock-details/stock-details.component';
import { StockTransferModule } from '../stock-transfer/stock-transfer.module';


@NgModule({
  declarations: [
    StoreComponent,
    StoreFormComponent,
    StoreListComponent,
    StoreDetailsComponent,
    StockDetailsComponent,
   
  ],
  imports: [
    CommonModule,
    FormsModule,
   ReactiveFormsModule,
    StoreRoutingModule,
    StockTransferModule
  ]
})
export class StoreModule { }
