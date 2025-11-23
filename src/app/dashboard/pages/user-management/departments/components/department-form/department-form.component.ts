import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentsService } from '../../../../../../services/departments.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DepartmentList, NewDepartment, User } from '../../departments.model';
import { ToastService } from '../../../../../../services/toast.service';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrl: './department-form.component.css'
})
export class DepartmentFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  departmentHeads: User[] = [];

  constructor(private fb: FormBuilder,
              private departmentsService: DepartmentsService,
              private toast: ToastService,
              private dialogRef: MatDialogRef<DepartmentFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DepartmentList) {}
    ngOnInit(): void {
    this.isEditMode = !!this.data;
    this.initializeForm();
    this.loadDepartmentHeads();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      departmentHeadId: [this.data?.departmentHeadId || null, Validators.required]
     
    });
  }

  private loadDepartmentHeads(): void {
    this.departmentsService.getAllUsers().subscribe({
      next: (response: User[]) => {
        // Handle various API response formats
        this.departmentHeads = response;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        // You might want to handle this error more gracefully, like showing a toast message
      }
    });
  }
  

  

  save(): void {
    if (this.form.invalid) return;

    const payload: NewDepartment = this.form.value;

    if (this.isEditMode && this.data?.id) {
  this.departmentsService.updateDepartment(this.data.id, payload).subscribe({
    next: (updated) => this.dialogRef.close({ action: 'update', data: updated }),
    error: () => this.toast.error('Error updating department')
  });
} else {
  this.departmentsService.createDepartment(payload).subscribe({
    next: (created) => this.dialogRef.close({ action: 'create', data: created }),
    error: () => this.toast.error('Error creating department')
  });
}

    }
    close(): void {
      this.dialogRef.close(false);
  }



}
