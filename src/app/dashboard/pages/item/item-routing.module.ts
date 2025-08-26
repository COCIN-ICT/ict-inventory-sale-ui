import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllItemsComponent } from './all-items/all-items.component';
import { CreateItemComponent } from './create-item/create-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { ItemDetailsComponent } from './item-details/item-details.component';

const routes: Routes = [
  { path: '', redirectTo: 'all', pathMatch: 'full' },
  { path: 'all', component: AllItemsComponent },
  { path: 'create', component: CreateItemComponent },
  { path: 'edit/:id', component: EditItemComponent },
  { path: 'view/:id', component: ItemDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemRoutingModule { } 