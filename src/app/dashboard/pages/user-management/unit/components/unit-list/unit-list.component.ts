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
  departments: Department[] = []; // Declare departments array
  selectedDepartmentId: number | null = null;
  searchTerm: string = '';
  originalUnits: Unit[] = [];

  constructor(private unitService: UnitService, 
              private toast: ToastService,
              public dialog: MatDialog,
              private departmentService: DepartmentsService
             ) { }

  ngOnInit(): void {
    this.loadUnits();
    this.loadDepartments();
  }


    private loadUnits(): void {
      this.unitService.getUnits().subscribe({
        next: (units) => {
          this.originalUnits = units.map((unit, index) => ({
            ...unit, displayOrder: index + 1 // Fixed typo: displayId to displayOrder
          })).sort((a, b) => a.displayOrder! - b.displayOrder!);
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
        next: (deps) => this.departments = deps,
        error: (err) => console.error('Error loading departments:', err)
      })
    }

    searchList(): void {
      this.applyFilters();
    }

    private applyFilters(): void {
      let filteredUnits = [...this.originalUnits];

      // Filter by department (client-side)
      // if (this.selectedDepartmentId) {
      //   filteredUnits = filteredUnits.filter(unit => 
      //    unit.departmentId === this.selectedDepartmentId || 
      //   unit.department?.id === this.selectedDepartmentId );
      //   }

      // Filter by department (server-side)
      if (this.selectedDepartmentId) {
  this.unitService.getUnitsByDepartment(this.selectedDepartmentId).subscribe(units => {
    this.units = units.sort((a, b) => a.displayOrder! - b.displayOrder!);
  });
} else {
  this.loadUnits();
}



      // Filter by Search
      if(this.searchTerm) {
        filteredUnits = filteredUnits.filter(unit => unit.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
      }
      // Sort by displayOrder
      this.units = filteredUnits.sort((a, b) => a.displayOrder! - b.displayOrder!);
    }

    onDepartmentSelected(departmentId: string): void {
      this.selectedDepartmentId = departmentId ? parseInt(departmentId, 10) : null;
      console.log('Selected Department ID:', this.selectedDepartmentId); // Debug selected ID
      this.applyFilters(); // Apply filter locally without reloading
    }

  openCreateForm(): void {
    const dialogRef = this.dialog.open(UnitFormComponent, {
      //i removed width and style here
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUnits(); // Reload all units after create, then apply filters
      }
    });
  }

  openEditForm(unit: Unit): void {
    const originalOrder = unit.displayOrder;
    const dialogRef = this.dialog.open(UnitFormComponent, {
      //i removed width and style here
      data: { ...unit }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.unitService.getUnitById(unit.id!).subscribe({
          next: (updatedUnit) => {
            const index = this.originalUnits.findIndex(u => u.id === updatedUnit.id);
            if (index !== -1) {
              this.originalUnits[index] = { ...updatedUnit, displayOrder: originalOrder } as Unit;
              this.applyFilters();
            }
          },
          error: err => {
            console.error('Error fetching updated unit:', err);
            this.loadUnits();
          }
        });
      }
    });
  }

  editUnit(unit: Unit): void {
    this.openEditForm(unit);
  }

  toggleUnitStatus(unit: Unit): void {
  this.unitService.changeUnitStatus(unit.id!).subscribe({
    next: (updatedUnit) => {
      const index = this.units.findIndex(u => u.id === updatedUnit.id);
      if (index !== -1) {
        this.units[index] = { ...updatedUnit, displayOrder: this.units[index].displayOrder };
      }
    },
    error: (err) => {
      console.error('Error changing status:', err);
    }
  });
}



}

  //searchList(): void{
   // if (!this.searchTerm.trim()) {this.loadUnits(); return;}

   // this.unitService.searchUnitsByType(this.searchTerm).subscribe({
     // next: (res) => {
   //     this.units = res?? [];
  //  },
    //  error: (err) => {
      //  console.error('Error searching units:', err);
        //this.toast.error('Failed to search units');
      //}
    //})
  //}


