import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentsService } from '../../../../../../services/departments.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DepartmentList, NewDepartment, User } from '../../departments.model';

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
              private dialogRef: MatDialogRef<DepartmentFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DepartmentList) {}
    ngOnInit(): void {
    this.isEditMode = !!this.data;

    // Load users first, then initialize the form
    this.departmentsService.getAllUsers().subscribe({
      next: (users: any) => {
        this.departmentHeads = users.data || users.users || users.result || users || [];

        // Initialize the form AFTER the users have been loaded
        this.form = this.fb.group({
          name: [this.data?.name || '', Validators.required],
          // Use a proper null check for departmentHeadId
          departmentHeadId: [this.data?.departmentHeadId || null]
        });
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }
  

  

  save(): void {
    if (this.form.invalid) return;

    const payload: NewDepartment = this.form.value;

    if(this.isEditMode && this.data?.id){
      //update
      this.departmentsService.updateDepartment(this.data.id, payload).subscribe({
        next: () => this.dialogRef.close(true),
        error: () => alert('Error updating department')
       });
      } else {
        this.departmentsService.createDepartment(payload).subscribe({
          next: () => this.dialogRef.close(true),
          error: () => alert('Error creating department')
        });
      }
    }
    close(): void {
      this.dialogRef.close(false);
  }



}
