import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllItemCategoriesComponent } from './all-item-categories/all-item-categories.component';
import { CreateItemCategoryComponent } from './create-item-category/create-item-category.component';
import { EditItemCategoryComponent } from './edit-item-category/edit-item-category.component';
import { ItemCategoryDetailsComponent } from './item-category-details/item-category-details.component';

const routes: Routes = [
  { path: '', redirectTo: 'all', pathMatch: 'full' },
  { path: 'all', component: AllItemCategoriesComponent },
  { path: 'create', component: CreateItemCategoryComponent },
  { path: 'edit/:id', component: EditItemCategoryComponent },
  { path: 'view/:id', component: ItemCategoryDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemCategoryRoutingModule { } 