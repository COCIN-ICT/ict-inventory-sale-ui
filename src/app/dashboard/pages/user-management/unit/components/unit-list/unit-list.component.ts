import { Component, OnInit } from '@angular/core';
import { Unit } from '../../unit.model';
import { UnitService } from '../../../../../../services/unit.service';
import { ToastService } from '../../../../../../services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { UnitFormComponent } from '../unit-form/unit-form.component';
import { Department, DepartmentsService } from '../../../../../../services/departments.service';

@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
  styleUrl: './unit-list.component.css'
})
export class UnitListComponent implements OnInit {
  units: Unit[] = [];
  departments: Department[] = [];
  selectedDepartmentId: number | null = null;
  searchTerm: string = '';
  originalUnits: Unit[] = [];

  constructor(private unitService: UnitService, 
              private toast: ToastService,
              public dialog: MatDialog,
              private departmentService: DepartmentsService) { }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadUnits();
    
  }

  onDepartmentSelected(departmentId: string): void {
    this.selectedDepartmentId = departmentId ? parseInt(departmentId, 10) : null;
    this.applyFilters();
  }

  private loadUnits(): void {
    this.unitService.getUnits().subscribe({
      next: (units) => {
        this.originalUnits = units;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error loading units:', err);
        this.toast.error('Failed to load units');
      }
    });
  }

  private loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (deps) => {this.departments = deps;
        this.loadUnits();
        
      },
      error: (err) => console.error('Error loading departments:', err)
    });
  }

  searchList(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let filteredUnits = [...this.originalUnits];

    if (this.selectedDepartmentId) {
      filteredUnits = filteredUnits.filter(unit => 
        unit.departmentId === this.selectedDepartmentId || unit.department?.id === this.selectedDepartmentId);
    }

    if (this.searchTerm) {
      filteredUnits = filteredUnits.filter(unit => 
        unit.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }

    this.units = filteredUnits;
  }
  
  openCreateForm(): void {
    const dialogRef = this.dialog.open(UnitFormComponent, {
      data: null
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUnits();
      }
    });
  }

  openEditForm(unit: Unit): void {
    const dialogRef = this.dialog.open(UnitFormComponent, {
      data: { ...unit }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUnits();
      }
    });
  }

  toggleInProgress= new Set<number>();
  toggleUnitStatus(unit: Unit): void {
    const newStatus = unit.active ? 'deactivate' : 'active';
    
    
    this.toggleInProgress.add(unit.id!);


    this.unitService.changeUnitStatus(unit.id!, newStatus).subscribe({
      next: (updatedUnit) => {
        const index = this.units.findIndex(u => u.id === updatedUnit.id);
        if (index !== -1) {
          this.units[index] = { ...this.units[index], active: updatedUnit.active };
          this.toast.success(`Unit '${updatedUnit.name}' status updated.`);
        }
      },
      error: (err) => {
        console.error('Error changing status:', err);
        this.toast.error('Failed to change unit status.');
      }
    });
  }
}