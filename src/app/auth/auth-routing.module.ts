import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { EmailSentComponent } from './email-sent/email-sent.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetSuccessComponent } from './reset-success/reset-success.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'email-sent', component: EmailSentComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'reset-success', component: ResetSuccessComponent },
  { path: 'create-user', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
