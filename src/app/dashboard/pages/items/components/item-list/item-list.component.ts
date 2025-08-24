import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ItemFormComponent } from '../item-form/item-form.component';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css'
})
export class ItemListComponent {

  constructor(public dialog: MatDialog) { }

  openCreateForm() {
    const dialogRef = this.dialog.open(ItemFormComponent, {data: null});}

}
