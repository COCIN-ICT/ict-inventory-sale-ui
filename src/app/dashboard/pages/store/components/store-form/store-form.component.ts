import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '../../store.model';
import { StoreService } from '../../../../../services/store.service';
import { ToastService } from '../../../../../services/toast.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Unit } from '../../../user-management/unit/unit.model';
import { UnitService } from '../../../../../services/unit.service';

@Component({
  selector: 'app-store-form',
  templateUrl: './store-form.component.html',
  styleUrl: './store-form.component.css'
})
export class StoreFormComponent implements OnInit {
  storeTypes: string[] = ['PRIMARY', 'SECONDARY'];
  units: Unit[] = [];
  form!: FormGroup;
  isEditMode = false;
  storeId!: number; // to keep track of the store ID for updates

  constructor(
    private storeService: StoreService,
    private toast: ToastService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StoreFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Store | null,
    private unitService: UnitService
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data;
    if (this.isEditMode && this.data?.id) {
      this.storeId = this.data.id ?? 0;
    }

    this.form = this.fb.group({
      id: [this.data?.id ?? null],
      name: [this.data?.name ?? '', Validators.required],
      location: [this.data?.location ?? '', Validators.required],
      storeType: [this.data?.storeType ?? 'PRIMARY', Validators.required],
      unitId: [this.data?.unit?.id ?? this.data?.unitId ?? 0, [Validators.required, Validators.min(1)]],
      displayOrder: [this.data?.displayOrder ?? null]
    });

    this.loadUnits();

    // Patch form if editing
    if (this.isEditMode && this.data) {
      this.form.patchValue({
        name: this.data.name,
        location: this.data.location,
        storeType: this.data.storeType,
        unitId: this.data.unit?.id ?? this.data.unitId,
        displayOrder: this.data.displayOrder
      });
    }
  }

  private loadUnits(): void {
    this.unitService.getUnits().subscribe({
      next: (units) => (this.units = units),
      error: () => this.toast.error('Failed to load units')
    });
  }

  createStore(): void {
  if (this.form.invalid) {
    this.toast.error('Please fill out all required fields');
    return;
  }

  // Always send a clean payload without an id (backend generates one)
  const payload: Store = {
    ...this.form.value,
    id: undefined, // ensure no accidental id is sent
    displayOrder: 1 // new store starts at 1 (or your backend default)
  };

  console.log('📦 Create payload:', payload);

  this.storeService.createStore(payload).subscribe({
    next: (created) => {
      console.log('✅ Created store:', created);
      this.toast.success('Store created successfully!');
      this.dialogRef.close(created);
    },
    error: (err) => {
      console.error('❌ Create failed:', err);
      this.toast.error('Failed to create store');
    }
  });
}


  updateStore(): void {
  if (this.form.invalid) {
    this.toast.error('Please fill out all required fields');
    return;
  }

  if (!this.storeId) {
    this.toast.error('Cannot update: missing store ID');
    return;
  }

  // Always ensure id is included in payload
  const payload: Store = {
    ...this.form.value,
    id: this.storeId,
    displayOrder: this.form.get('displayOrder')?.value ?? this.data?.displayOrder
  };

  console.log('🆔 Updating store with ID:', this.storeId);
  console.log('📦 Update payload:', payload);

  this.storeService.updateStore(this.storeId, payload).subscribe({
    next: (updated) => {
      console.log('✅ Updated response:', updated);
      this.toast.success('Store updated successfully');
      this.dialogRef.close({
        ...updated,
        displayOrder: payload.displayOrder
      });
    },
    error: (err) => {
      console.error('❌ Update failed:', err);
      this.toast.error('Error updating store');
    }
  });
}



  close(data?: Store): void {
    this.dialogRef.close(data || null);
  }
}
