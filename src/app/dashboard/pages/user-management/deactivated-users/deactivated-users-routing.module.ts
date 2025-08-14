import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeactivatedUsersComponent } from './deactivated-users.component';

const routes: Routes = [{ path: '', component: DeactivatedUsersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeactivatedUsersRoutingModule { }
