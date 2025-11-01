import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';
import { ItemService } from '../../../services/item.service';
import { StoreService } from '../../../services/store.service';
import { StockTransferService } from '../../../services/stock-transfer.service';
import { AuthService } from '../../../auth/auth.service';
import { DepartmentsService } from '../../../services/departments.service';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stock-transfer',
  templateUrl: './stock-transfer.component.html',
  styleUrls: ['./stock-transfer.component.css']
})
export class StockTransferComponent {
  /*
  transferForm!: FormGroup;
  userUnitId!: number;
  currentUser: any;
  showModal = false; 

  primaryStores: any[] = [];
  secondaryStores: any[] = [];
  destinationStores: any[] = [];
  departments: any[] = [];
  units: any[] = [];
  filteredUnits: any[] = [];
  items: any[] = [];

  loading = false;
  isExternalTransfer = false;
  userPrimaryStore: any;
  */

  transferForm!: FormGroup;
  isModalOpen = false;

  userUnitId!: number;
  userPrimaryStore: any;

  primaryStores: any[] = [];
  secondaryStores: any[] = [];
  destinationStores: any[] = [];

  isExternalTransfer = false;
  loading = false;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private stockTransferService: StockTransferService,
    private storeService: StoreService,
    private itemService: ItemService,
    private toast: ToastService,
    private authService: AuthService,
    private departmentService: DepartmentsService
  ) {}

  /*
  ngOnInit(): void {
    this.initializeForm();
    this.loadUserUnit();
    this.loadStores();
    this.loadDepartments();
  }
    */

    ngOnInit(): void {
    this.initializeForm();
    this.loadUser();
    this.loadStores();
  }

  initializeForm(): void {
    this.transferForm = this.fb.group({
      transferType: ['internal', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      reason: ['', Validators.required],
      destinationStoreId: ['', Validators.required],
    });
  }

  loadUser(): void {
    const user = this.authService.getUser();
    if (user) this.userUnitId = user.unit?.id;
  }

  loadStores(): void {
    this.storeService.getStore().subscribe({
      next: (stores: any[]) => {
        this.primaryStores = stores.filter(s => s.storeType === 'PRIMARY');
        this.secondaryStores = stores.filter(s => s.storeType === 'SECONDARY');

        this.userPrimaryStore = this.primaryStores.find(
          s => s.unit.id === this.userUnitId
        );

        // Internal logic by default
        this.applyInternalTransferLogic();
      },
      error: () => this.toast.error('Failed to load stores.')
    });
  }

  openTransferModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onTransferTypeChange(): void {
    const type = this.transferForm.get('transferType')?.value;
    this.isExternalTransfer = type === 'external';

    if (this.isExternalTransfer) {
      // Show all primary stores (external transfer)
      this.destinationStores = this.primaryStores.filter(
        s => s.unit.id !== this.userUnitId
      );
    } else {
      // Internal transfer (secondary stores of same unit)
      this.applyInternalTransferLogic();
    }
  }

  applyInternalTransferLogic(): void {
    this.destinationStores = this.secondaryStores.filter(
      s => s.unit.id === this.userUnitId
    );
  }

  submitTransfer(): void {
    if (this.transferForm.invalid) {
      this.toast.error('Please fill all required fields.');
      return;
    }

    const payload = {
      ...this.transferForm.value,
      itemId: this.getItemIdFromURL()
    };

    this.loading = true;
    this.stockTransferService.transferStock(payload).subscribe({
      next: () => {
        this.toast.success('Stock transfer successful!');
        this.closeModal();
        this.transferForm.reset({ transferType: 'internal', quantity: 1 });
        this.isExternalTransfer = false;
        this.applyInternalTransferLogic();
      },
      error: () => this.toast.error('Failed to complete transfer.'),
      complete: () => (this.loading = false)
    });
  }

  getItemIdFromURL(): number {
    const url = window.location.pathname; // e.g. /home/store/details/10/stock/1
    const parts = url.split('/');
    const itemId = Number(parts[parts.length - 1]);
    return itemId;
  }


  /*
  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  initializeForm(): void {
    this.transferForm = this.fb.group({
      transferType: ['internal', Validators.required],
      sourceStoreId: [''],
      departmentId: [''],
      unitId: [''],
      itemId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      reason: ['', Validators.required],
      destinationStoreId: ['', Validators.required]
    });
  }

  loadUserUnit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.currentUser = user;
      this.userUnitId = user.unit?.id;
    }
  }

  loadStores(): void {
    this.stockTransferService.getStores().subscribe({
      next: (stores: any[]) => {
        this.primaryStores = stores.filter(s => s.storeType === 'PRIMARY');
        this.secondaryStores = stores.filter(s => s.storeType === 'SECONDARY');

        this.userPrimaryStore = this.primaryStores.find(
          s => s.unit.id === this.userUnitId
        );

        this.applyInternalTransferLogic();
      },
      error: () => this.toast.error('Failed to load stores.')
    });
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (depts: any[]) => (this.departments = depts),
      error: () => this.toast.error('Failed to load departments.')
    });
  }

  onTransferTypeChange(): void {
    const type = this.transferForm.get('transferType')?.value;
    this.isExternalTransfer = type === 'external';

    this.items = [];
    this.destinationStores = [];

    if (this.isExternalTransfer) {
      this.transferForm.get('sourceStoreId')?.enable();
    } else {
      this.transferForm.get('sourceStoreId')?.disable();
      this.applyInternalTransferLogic();
    }
  }

  applyInternalTransferLogic(): void {
    if (this.userPrimaryStore) {
      this.transferForm.patchValue({
        sourceStoreId: this.userPrimaryStore.id
      });

      this.loadItemsByStore(this.userPrimaryStore.id);

      this.destinationStores = this.secondaryStores.filter(
        s => s.unit.id === this.userUnitId
      );
    }
  }

  onSourceStoreSelected(sourceStoreId: number): void {
    if (!sourceStoreId) return;
    this.loadItemsByStore(sourceStoreId);
  }

  loadItemsByStore(storeId: number): void {
    this.storeService.getStockByStoreId(storeId).pipe(
      map(res => {
        if (!res) return [];
        if ((res as any).data) return (res as any).data;
        if ((res as any).result) return (res as any).result;
        return res;
      })
    ).subscribe({
      next: (items) => {
        this.items = items || [];
      },
      error: () => this.toast.error('Failed to load items for store.')
    });
  }

  onDepartmentSelected(deptId: number): void {
    this.filteredUnits = this.units.filter(u => u.departmentId === +deptId);
  }

  onUnitSelected(unitId: number): void {
    this.destinationStores = this.primaryStores.filter(
      s => s.unit.id === +unitId
    );
  }

  submitTransfer(): void {
    if (this.transferForm.invalid) {
      this.toast.error('Please fill all required fields correctly.');
      return;
    }

    const payload = this.transferForm.value;
    this.loading = true;

    this.stockTransferService.createStockTransfer(payload).subscribe({
      next: () => {
        this.toast.success('Stock transfer successful!');
        this.transferForm.reset({ transferType: 'internal' });
        this.isExternalTransfer = false;
        this.applyInternalTransferLogic();
        this.closeModal(); // ✅ Close after success
      },
      error: () => this.toast.error('Failed to complete stock transfer.'),
      complete: () => (this.loading = false)
    });
  }
  */
}
