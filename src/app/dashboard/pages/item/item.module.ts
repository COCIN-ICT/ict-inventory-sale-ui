import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ItemRoutingModule } from './item-routing.module';
import { AllItemsComponent } from './all-items/all-items.component';
import { CreateItemComponent } from './create-item/create-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { ItemDetailsComponent } from './item-details/item-details.component';

@NgModule({
  declarations: [
    AllItemsComponent,
    CreateItemComponent,
    EditItemComponent,
    ItemDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ItemRoutingModule
  ]
})
export class ItemModule { } 