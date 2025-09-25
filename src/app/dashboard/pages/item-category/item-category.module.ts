import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ItemCategoryRoutingModule } from './item-category-routing.module';
import { AllItemCategoriesComponent } from './all-item-categories/all-item-categories.component';
import { CreateItemCategoryComponent } from './create-item-category/create-item-category.component';
import { EditItemCategoryComponent } from './edit-item-category/edit-item-category.component';
import { ItemCategoryDetailsComponent } from './item-category-details/item-category-details.component';

@NgModule({
  declarations: [
    AllItemCategoriesComponent,
    CreateItemCategoryComponent,
    EditItemCategoryComponent,
    ItemCategoryDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ItemCategoryRoutingModule
  ]
})
export class ItemCategoryModule { } 