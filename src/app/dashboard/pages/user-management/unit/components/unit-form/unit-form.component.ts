import { Component, Inject, OnInit } from '@angular/core';
import { Department, Unit, UnitHead } from '../../unit.model';
import { UnitService } from '../../../../../../services/unit.service';
import { ToastService } from '../../../../../../services/toast.service';
import { DepartmentsService } from '../../../../../../services/departments.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-unit-form',
  templateUrl: './unit-form.component.html',
  styleUrl: './unit-form.component.css'
})
export class UnitFormComponent implements OnInit {
//  newUnit: Unit = { name: '', description: '', address: '', unitHeadId: undefined, departmentId: 0 };
  //isModalOpen = false;
 // departments: Department[] = [];
  unitHeads: UnitHead[] = []; // Adjust type based on API response

  units: Unit[] = [];
  form!: FormGroup;
  isEditMode = false;
  departments: Department[] = [];



  constructor(private unitService: UnitService,
              private fb: FormBuilder, 
              private toast: ToastService, 
              private departmentService: DepartmentsService,
              public dialogRef: MatDialogRef<UnitFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Unit | null 
            ){};

  ngOnInit(): void {
  
    //this.loadUnitHeads();

    this.isEditMode = !!this.data;//
    this.form = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      description: [this.data?.description || '', Validators.required],
      address: [this.data?.address || '', Validators.required],
      unitHeadId: [this.data?.unitHeadId || null],
      departmentId: [this.data?.departmentId || null, Validators.required]
    });
    this.loadDepartments();
  }

  private loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (deps) => this.departments = deps,
      error: (err) => console.error('Error loading departments:', err)
    });
  }

  private loadUnitHeads(): void {
    this.unitService.getUnitHeads().subscribe({
      next: (heads) => this.unitHeads = heads,
      error: (err) => this.toast.error('Failed to load unit heads')
   });
  }
  
  createUnit(): void {
    if (this.form.invalid){this.toast.error('Please fill out all required fields'); return;}

    const payload: Unit = this.form.value;
    this.unitService.createUnit(payload).subscribe({
      next:(created) => {
        this.units.unshift(created);
        this.toast.success('Unit created successfully!');
        this.close();
      },
      error: err => {
        console.error('Create failed:', err);
        this.toast.error('Failed to create unit');
      }
    });
      
  }

  updateUnit(): void{
    if (this.form.invalid) {this.toast.error('Please fill out all required fields'); return; }

    const payload: Unit = this.form.value;
    this.unitService.updateUnit(this.data?.id!, payload).subscribe({
      next: () => {
        this.toast.success('Unit updated successfully');
        this.dialogRef.close(true);
      },
      error: () => this.toast.error('Error updating unit')
    })
  }

  close(): void {
    this.dialogRef.close(false);
  }
}


  


  