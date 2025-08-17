import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllPurchaseQuotationsComponent } from './all-purchase-quotations/all-purchase-quotations.component';
import { CreatePurchaseQuotationComponent } from './create-purchase-quotation/create-purchase-quotation.component';
import { EditPurchaseQuotationComponent } from './edit-purchase-quotation/edit-purchase-quotation.component';
import { PurchaseQuotationDetailsComponent } from './purchase-quotation-details/purchase-quotation-details.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'all',
    pathMatch: 'full'
  },
  {
    path: 'all',
    component: AllPurchaseQuotationsComponent
  },
  {
    path: 'create',
    component: CreatePurchaseQuotationComponent
  },
  {
    path: 'edit/:id',
    component: EditPurchaseQuotationComponent
  },
  {
    path: 'view/:id',
    component: PurchaseQuotationDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseQuotationRoutingModule { } 