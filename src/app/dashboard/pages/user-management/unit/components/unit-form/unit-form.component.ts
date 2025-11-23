import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnitService } from '../../../../../../services/unit.service';
import { ToastService } from '../../../../../../services/toast.service';
import { DepartmentsService } from '../../../../../../services/departments.service';
import { Department, Unit } from '../../unit.model';

@Component({
  selector: 'app-unit-form',
  templateUrl: './unit-form.component.html',
  styleUrl: './unit-form.component.css'
})
export class UnitFormComponent implements OnInit {

  form!: FormGroup;
  isEditMode = false;
  departments: Department[] = [];

  // dropdown options for unit head (will contain a single item when a department is selected)
  unitHeadOptions: { id: number, name: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentsService,
    private unitService: UnitService,
    private toast: ToastService,
    private dialogRef: MatDialogRef<UnitFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Unit | null
  ) { }

  ngOnInit(): void {
    this.isEditMode = !!this.data;

    // Build form
    this.form = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      description: [this.data?.description || '', Validators.required],
      address: [this.data?.address || '', Validators.required],
      departmentId: [this.data?.departmentId ?? null, Validators.required],

      /* IMPORTANT: unitHeadId should NOT be required for create flow.
         We'll set it when a department is chosen. */
      unitHeadId: [this.data?.unitHeadId ?? null]
    });

    // Load departments and then, if editing, populate the unit head for existing department
    this.loadDepartments();

    // Listen for department changes
    this.form.get('departmentId')?.valueChanges.subscribe((deptId: number | null) => {
      this.setDepartmentHead(deptId);
    });
  }

  private loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (deps) => {
        this.departments = deps || [];

        // If editing and department is already set in the data, populate the head
        if (this.isEditMode && this.form.get('departmentId')?.value) {
          const currentDeptId = this.form.get('departmentId')!.value;
          this.setDepartmentHead(currentDeptId);
        }
      },
      error: (err) => {
        console.error('Error loading departments:', err);
        this.toast.error('Failed to load departments');
      }
    });
  }

  /**
   * Populate unitHeadOptions with the department's head (single item),
   * and auto-select its id in the form.
   */
  setDepartmentHead(departmentId: any): void {
  // Coerce to number (handles string or number input)
  const deptIdNum = departmentId == null ? null : Number(departmentId);
  console.log('setDepartmentHead called with:', departmentId, '=>', deptIdNum);
  if (!deptIdNum) {
    this.unitHeadOptions = [];
    this.form.get('unitHeadId')?.setValue(null, { emitEvent: false });
    return;
  }

  const dept = this.departments.find(d => Number(d.id) === deptIdNum);
  console.log('found dept:', dept);

  if (!dept) {
    this.unitHeadOptions = [];
    this.form.get('unitHeadId')?.setValue(null, { emitEvent: false });
    return;
  }

  const headId = dept.departmentHeadId;
  const headName = `${dept.departmentHeadFirstName ?? ''} ${dept.departmentHeadLastName ?? ''}`.trim() || `User #${headId}`;

  this.unitHeadOptions = [{ id: Number(headId), name: headName }];
  this.form.get('unitHeadId')?.setValue(Number(headId), { emitEvent: false });
}


  createUnit(): void {
    // use getRawValue so we include any disabled controls (none disabled here, but safe)
    const payload: Unit = this.form.getRawValue();

    if (this.form.invalid) {
      this.toast.error('Please fill out all required fields');
      return;
    }

    this.unitService.createUnit(payload).subscribe({
      next: () => {
        this.toast.success('Unit created successfully!');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Create failed:', err);
        this.toast.error('Failed to create unit');
      }
    });
  }

  updateUnit(): void {
    const payload: Unit = this.form.getRawValue();

    if (this.form.invalid) {
      this.toast.error('Please fill out all required fields');
      return;
    }

    this.unitService.updateUnit(this.data!.id!, payload).subscribe({
      next: () => {
        this.toast.success('Unit updated successfully!');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Update failed:', err);
        this.toast.error('Error updating unit');
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
