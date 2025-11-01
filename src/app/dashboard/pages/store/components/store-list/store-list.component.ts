import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StoreService } from '../../../../../services/store.service';
import { Store } from '../../store.model';
import { ToastService } from '../../../../../services/toast.service';
import { Unit } from '../../../user-management/unit/unit.model';
import { MatDialog } from '@angular/material/dialog';
import { UnitService } from '../../../../../services/unit.service';
import { StoreFormComponent } from '../store-form/store-form.component';
import { Department, DepartmentsService } from '../../../../../services/departments.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrl: './store-list.component.css'
})
export class StoreListComponent implements OnInit {
  stores: Store[] = [];
  units: Unit[] = [];
  departments: Department[] = [];
  selectedUnitId: number | null = null;
  searchTerm: string = '';
  originalStores: Store[] = [];

  constructor(private storeService: StoreService, 
              private toast: ToastService,
              public dialog: MatDialog,
              private unitService: UnitService,
              private cdr: ChangeDetectorRef,
              private departmentService: DepartmentsService,
              private router: Router) { }
  ngOnInit(): void {
    this.loadStores();
    this.loadUnits();
   //this.loadDepartments();
  }

  onUnitSelected(unitId: string): void{
    this.selectedUnitId = unitId ? parseInt(unitId, 10) : null;
    this.applyFilters();
  }


private loadStores(): void {
  this.storeService.getStore().subscribe({
    next: (stores) => {
      // Sort by id to maintain consistent order
      const sortedStores = [...stores].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
      this.originalStores = sortedStores.map((store, index) => ({
        ...store,
        displayOrder: store.displayOrder ?? index + 1
      }));
      this.applyFilters();
    },
    error: (err) => {
      console.error('Error loading stores:', err);
      this.toast.error('Failed to load stores');
    }
  });
}


  private loadUnits(): void{
    this.unitService.getUnits().subscribe({
      next: (units) => this.units = units,
      error: (err) => this.toast.error('Failed to load units')
    })
  }

  // private loadDepartments(): void{
  //   this.departmentService.getDepartments().subscribe({
  //     next: (departments) => this.departments = departments,
  //     error: (err) => this.toast.error('Failed to load departments')
  //   })
  // }

   applyFilters(): void {
  let filteredStores = [...this.originalStores];

  if (this.selectedUnitId) {
    filteredStores = filteredStores.filter(
      store => store.unitId === this.selectedUnitId || store.unit?.id === this.selectedUnitId
    );
  }

  if (this.searchTerm) {
    filteredStores = filteredStores.filter(store =>
      store.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  this.stores = [...filteredStores.sort((a, b) => 
    (a.displayOrder ?? Number.MAX_SAFE_INTEGER) - (b.displayOrder ?? Number.MAX_SAFE_INTEGER)
  )];
  this.cdr.detectChanges();
}

openCreateForm(): void {
  const dialogRef = this.dialog.open(StoreFormComponent, { data: null });

  dialogRef.afterClosed().subscribe((newStore: Store | null) => {
    if (newStore) {
      const exists = this.originalStores.some(s => s.id === newStore.id);
      if (!exists) {
        // Put new store at top
        newStore.displayOrder = 1;

        // Shift the display order of existing stores down
        this.originalStores.forEach(store => store.displayOrder!++);
        
        // Add the new store at the start
        this.originalStores.unshift(newStore);

        this.applyFilters();
      }
    }
  });
}


openEditForm(store: Store): void {
  const dialogRef = this.dialog.open(StoreFormComponent, {data: { ...store }});

  dialogRef.afterClosed().subscribe((updatedStore: Store | null) => {
    if (updatedStore) {
      const index = this.originalStores.findIndex(s => s.id === store.id);
      if (index !== -1) {
        // Replace existing store with updated one
        this.originalStores[index] = {
          ...updatedStore,
          displayOrder: this.originalStores[index].displayOrder
        };
        this.applyFilters();
      }
    }
  });
}



//   openStoreDetails(store: Store): void {
//   console.log('Store being sent:', store);
//   this.router.navigate(['/store-details'], { state: { stock: store } });
// }







}