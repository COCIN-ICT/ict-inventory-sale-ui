import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Item, ItemCategoryResponse, UnitOfMeasureResponse } from '../../item.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from '../../../../../services/toast.service';
import { UnitOfMeasureService } from '../../../../../services/unit-of-measure.service';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrl: './item-form.component.css'
})
export class ItemFormComponent {
  itemForm!: FormGroup;
  UnitOfMeasure: UnitOfMeasureResponse[] = [];
  ItemCategory: ItemCategoryResponse[] = [];
  isEdit: boolean = false;

  constructor(
    
    private toast: ToastService,
    private dialogRef: MatDialogRef<ItemFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Item | null
  ) { }



}
