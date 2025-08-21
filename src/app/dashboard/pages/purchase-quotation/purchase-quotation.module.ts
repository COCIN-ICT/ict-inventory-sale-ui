import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PurchaseQuotationRoutingModule } from './purchase-quotation-routing.module';
import { AllPurchaseQuotationsComponent } from './all-purchase-quotations/all-purchase-quotations.component';
import { CreatePurchaseQuotationComponent } from './create-purchase-quotation/create-purchase-quotation.component';
import { EditPurchaseQuotationComponent } from './edit-purchase-quotation/edit-purchase-quotation.component';
import { PurchaseQuotationDetailsComponent } from './purchase-quotation-details/purchase-quotation-details.component';

@NgModule({
  declarations: [
    AllPurchaseQuotationsComponent,
    CreatePurchaseQuotationComponent,
    EditPurchaseQuotationComponent,
    PurchaseQuotationDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PurchaseQuotationRoutingModule
  ]
})
export class PurchaseQuotationModule { } 