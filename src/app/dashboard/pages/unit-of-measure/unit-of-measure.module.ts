import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UnitOfMeasureRoutingModule } from './unit-of-measure-routing.module';
import { AllUnitOfMeasuresComponent } from './all-unit-of-measures/all-unit-of-measures.component';
import { CreateUnitOfMeasureComponent } from './create-unit-of-measure/create-unit-of-measure.component';
import { EditUnitOfMeasureComponent } from './edit-unit-of-measure/edit-unit-of-measure.component';
import { UnitOfMeasureDetailsComponent } from './unit-of-measure-details/unit-of-measure-details.component';

@NgModule({
  declarations: [
    AllUnitOfMeasuresComponent,
    CreateUnitOfMeasureComponent,
    EditUnitOfMeasureComponent,
    UnitOfMeasureDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UnitOfMeasureRoutingModule
  ]
})
export class UnitOfMeasureModule { } 