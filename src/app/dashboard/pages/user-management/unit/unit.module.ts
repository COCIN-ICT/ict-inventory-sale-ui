import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitRoutingModule } from './unit-routing.module';
import { UnitComponent } from './unit.component';
import { FormsModule } from '@angular/forms';
import { UnitFormComponent } from './components/unit-form/unit-form.component';
import { UnitListComponent } from './components/unit-list/unit-list.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    UnitComponent,
    UnitFormComponent,
    UnitListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UnitRoutingModule,

    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,           // ← This fixes mat-icon
    MatProgressSpinnerModule, // ← This fixes mat-spinner
    
    ReactiveFormsModule
  ]
})
export class UnitModule { }
