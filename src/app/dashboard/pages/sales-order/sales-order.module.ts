import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SalesOrderRoutingModule } from './sales-order-routing.module';
import { SalesOrderComponent } from './sales-order.component';
import { SalesOrderListComponent } from './components/sales-order-list/sales-order-list.component';
import { SalesOrderCreateComponent } from './components/sales-order-create/sales-order-create.component';
import { SalesOrderDetailsComponent } from './components/sales-order-details/sales-order-details.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    SalesOrderComponent,
    SalesOrderListComponent,
    SalesOrderCreateComponent,
    SalesOrderDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SalesOrderRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule
  ]
})
export class SalesOrderModule { }
