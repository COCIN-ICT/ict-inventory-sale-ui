import { Component, OnInit } from '@angular/core';
import { DepartmentList } from '../../departments.model';
import { DepartmentsService } from '../../../../../../services/departments.service';
import { MatDialog } from '@angular/material/dialog';
import { DepartmentFormComponent } from '../department-form/department-form.component';


@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.css'
})
export class DepartmentListComponent implements OnInit {
  departments: DepartmentList[] =[];
  loading = false;
successMessage: any;

  constructor(private departmentsService: DepartmentsService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments() {
    this.loading = true;
    this.departmentsService.getDepartments().subscribe({
      next: (res: any) => {
        this.departments = res.data || res.departments || res.result || res || [];
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.departments = []; // Set empty array on error 
      } 
    });
  }
  openForm(department?: DepartmentList) {
    const dialogRef = this.dialog.open(DepartmentFormComponent, {
      width: '400px',
      data: department ? { ...department } : null
    });

    dialogRef.afterClosed().subscribe(result => {
  if (!result) return;

  if (result.action === 'update') {
    this.loadDepartments();
  }

  if (result.action === 'create') {
    this.loadDepartments();
  }
});

  }

  deleteDepartment(departmentId: number): void {
    if (confirm('Are you sure you want to delete this department?')) {
      this.departmentsService.deleteDepartment(departmentId).subscribe({
        next: () => {this.loadDepartments();}, // Reload departments after deletion
        error: (error) => { console.error('Error deleting department:', error);}
      });
    }
  }

}
