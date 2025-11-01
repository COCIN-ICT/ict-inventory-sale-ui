import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { ContentComponent } from './layout/content/content.component';
import { MainComponent } from './layout/main/main.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AllUsersModule } from './dashboard/pages/all-users/all-users.module';
import { EditSupplierComponent } from './dashboard/pages/supplier-management/edit-supplier/edit-supplier.component';
import { SupplierDetailsComponent } from './dashboard/pages/supplier-management/supplier-details/supplier-details.component';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './store/auth/auth.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './store/auth/auth.effects';
import { AuthInterceptor } from './auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatIconModule  } from '@angular/material/icon';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { SalesOrderListComponent } from './dashboard/pages/sales-order/sales-order-list/sales-order-list.component';
import { SalesOrderCreateComponent } from './dashboard/pages/sales-order/sales-order-create/sales-order-create.component';
import { SalesOrderEditComponent } from './dashboard/pages/sales-order/sales-order-edit/sales-order-edit.component';
import { SalesOrderService } from './services/sales-order.service';
import { SalesCreditListComponent } from './dashboard/pages/sales-credit/sales-credit-list/sales-credit-list.component';
import { SalesCreditCreateComponent } from './dashboard/pages/sales-credit/sales-credit-create/sales-credit-create.component';
import { SalesCreditDetailsComponent } from './dashboard/pages/sales-credit/sales-credit-details/sales-credit-details.component';
import { SalesCreditPendingComponent } from './dashboard/pages/sales-credit/sales-credit-pending/sales-credit-pending.component';
import { SalesCreditService } from './services/sales-credit.service';
import { SalesPromotionListComponent } from './dashboard/pages/sales-promotion/sales-promotion-list/sales-promotion-list.component';
import { SalesPromotionCreateComponent } from './dashboard/pages/sales-promotion/sales-promotion-create/sales-promotion-create.component';
import { SalesPromotionEditComponent } from './dashboard/pages/sales-promotion/sales-promotion-edit/sales-promotion-edit.component';
import { SalesPromotionDetailsComponent } from './dashboard/pages/sales-promotion/sales-promotion-details/sales-promotion-details.component';
import { SalesPromotionByStockComponent } from './dashboard/pages/sales-promotion/sales-promotion-by-stock/sales-promotion-by-stock.component';
import { SalesPromotionService } from './services/sales-promotion.service';
import { SalesItemsListComponent } from './dashboard/pages/sales-items/sales-items-list/sales-items-list.component';
import { SalesItemsCreateComponent } from './dashboard/pages/sales-items/sales-items-create/sales-items-create.component';
import { SalesItemService } from './services/sales-item.service';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidebarComponent,
    FooterComponent,
    HeaderComponent,
    ContentComponent,
    MainComponent,
    EditSupplierComponent,
    SupplierDetailsComponent,

    ConfirmDialogComponent,
    SalesOrderListComponent,
    SalesOrderCreateComponent,
    SalesOrderEditComponent,
    SalesCreditListComponent,
    SalesCreditCreateComponent,
    SalesCreditDetailsComponent,
    SalesCreditPendingComponent,
    SalesPromotionListComponent,
    SalesPromotionCreateComponent,
    SalesPromotionEditComponent,
    SalesPromotionDetailsComponent,
    SalesPromotionByStockComponent
    ,
    SalesItemsListComponent,
    SalesItemsCreateComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    
    
    
   // AllUsersModule,
    
    StoreModule.forRoot({
      auth: authReducer
    }, {}),
    EffectsModule.forRoot([AuthEffects]),

    // RouterModule.forChild(routes),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideClientHydration(),
    provideAnimationsAsync(),
    SalesOrderService,
    SalesCreditService,
    SalesPromotionService
    ,
    SalesItemService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
