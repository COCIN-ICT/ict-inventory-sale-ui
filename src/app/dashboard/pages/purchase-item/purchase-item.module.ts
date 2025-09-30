import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseItemRoutingModule } from './purchase-item-routing.module';
import { PurchaseItemComponent } from './purchase-item.component';
import { PurchaseItemFormComponent } from './components/purchase-item-form/purchase-item-form.component';
import { PurchaseItemListComponent } from './components/purchase-item-list/purchase-item-list.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PurchaseItemComponent,
    PurchaseItemFormComponent,
    PurchaseItemListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PurchaseItemRoutingModule
  ]
})
export class PurchaseItemModule { }
