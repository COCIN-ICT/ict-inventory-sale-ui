import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrettyPermissionPipe } from '../pipes/pretty-permission.pipe';

@NgModule({
  declarations: [PrettyPermissionPipe],
  imports: [CommonModule],
  exports: [PrettyPermissionPipe]   // 👈 Export so other modules can use it
})
export class SharedModule {}
