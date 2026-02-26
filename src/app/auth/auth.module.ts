import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthRoutingModule } from './auth-routing.module';

// Layout
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';

// Pages
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { EmailSentComponent } from './email-sent/email-sent.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetSuccessComponent } from './reset-success/reset-success.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AuthLayoutComponent,
    LoginComponent,
    ForgotPasswordComponent,
    EmailSentComponent,
    ResetPasswordComponent,
    ResetSuccessComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
