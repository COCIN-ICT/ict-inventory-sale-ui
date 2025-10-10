import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';
import { ItemService } from '../../../services/item.service';
import { StoreService } from '../../../services/store.service';
import { StockTransferService } from '../../../services/stock-transfer.service';
import { AuthService } from '../../../auth/auth.service';


import { Store } from '../store/store.model';
import { Item } from '../items/item.model';

@Component({
  selector: 'app-stock-transfer',
  templateUrl: './stock-transfer.component.html',
  styleUrl: './stock-transfer.component.css'
})
export class StockTransferComponent {
  transferForm!: FormGroup;
  userUnitId!: number;
  currentUser: any;

  primaryStores: any[] = [];
  secondaryStores: any[] = [];
  destinationStores: any[] = [];
  items: any[] = [];

  loading = false;


  constructor(
    private fb: FormBuilder,
    private stockTransferService: StockTransferService,
    private storeService: StoreService,
    private itemService: ItemService,
    private toast: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadUserUnit();
    this.loadStores();
    this.loadItems();
  }

  initializeForm(): void {
    this.transferForm = this.fb.group({
      itemId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      reason: ['', Validators.required],
      destinationStoreId: ['', Validators.required]
    });
  }
  // loadUserUnit(): void {
  //   const userData = localStorage.getItem('user');
  //   if (userData) {
  //     const user = JSON.parse(userData);
  //     this.currentUser = user;
  //     this.userUnitId = user.unit?.id;
  //   }

  //   if (!this.userUnitId) {
  //     this.toast.error('Unable to determine your unit. Please log in again.');
  //   }  }
    loadUserUnit(): void {
    const user = this.authService.getUser();

    if (user) {
      this.currentUser = user;
      this.userUnitId = user.unit?.id;
    }

    if (!this.userUnitId) {
      this.toast.error('Unable to determine your unit. Please log in again.');
    } else {
      console.log('User:', this.currentUser);
      console.log('User Unit:', this.currentUser.unit);
    }
  }


  loadStores(): void {
    this.stockTransferService.getStores().subscribe({
      next: (stores: Store[]) => {
        this.primaryStores = stores.filter((s: Store) => s.storeType === 'PRIMARY');
        this.secondaryStores = stores.filter((s: Store) => s.storeType === 'SECONDARY');
      },
      error: () => this.toast.error('Failed to load stores.')
    });
  }

  loadItems(): void {
    this.stockTransferService.getItems().subscribe({
      next: (items: Item[]) => (this.items = items),
      error: () => this.toast.error('Failed to load items.')
    });
  }

   // Automatically determine valid destination stores
  onSourceTypeSelected(sourceType: 'PRIMARY' | 'SECONDARY'): void {
    if (sourceType === 'PRIMARY') {
      // User can transfer from primary to either secondary (same unit) or another primary (different unit)
      const sameUnitSecondaries = this.secondaryStores.filter(
        (store) => store.unit.id === this.userUnitId
      );

      const otherUnitPrimaries = this.primaryStores.filter(
        (store) => store.unit.id !== this.userUnitId
      );

      this.destinationStores = [...sameUnitSecondaries, ...otherUnitPrimaries];
    } else {
      this.destinationStores = []; // No transfer from secondary → any
      this.toast.error('You cannot transfer from a secondary store.');
    }
  }

  submitTransfer(): void {
    if (this.transferForm.invalid) {
      this.toast.error('Please fill all required fields correctly.');
      return;
    }

    const payload = this.transferForm.value; // only quantity, reason, destinationStoreId, itemId
    this.loading = true;
    console.log('Form Data:', this.transferForm.value);
    console.log('User:', this.currentUser);
    console.log('User Unit:', this.currentUser?.unit);



    this.stockTransferService.createStockTransfer(payload).subscribe({
      next: () => {
        this.toast.success('Stock transfer successful!');
        this.transferForm.reset();
      },
      error: (err: any) => {
        this.toast.error('Failed to complete stock transfer.');
        console.error(err);
      },
      complete: () => (this.loading = false)
    });
  }



}
