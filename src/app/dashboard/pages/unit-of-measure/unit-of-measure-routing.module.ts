import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllUnitOfMeasuresComponent } from './all-unit-of-measures/all-unit-of-measures.component';
import { CreateUnitOfMeasureComponent } from './create-unit-of-measure/create-unit-of-measure.component';
import { EditUnitOfMeasureComponent } from './edit-unit-of-measure/edit-unit-of-measure.component';
import { UnitOfMeasureDetailsComponent } from './unit-of-measure-details/unit-of-measure-details.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'all',
    pathMatch: 'full'
  },
  {
    path: 'all',
    component: AllUnitOfMeasuresComponent
  },
  {
    path: 'create',
    component: CreateUnitOfMeasureComponent
  },
  {
    path: 'edit/:id',
    component: EditUnitOfMeasureComponent
  },
  {
    path: 'view/:id',
    component: UnitOfMeasureDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitOfMeasureRoutingModule { } 