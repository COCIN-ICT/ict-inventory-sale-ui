import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../../../services/store.service';
import { Store } from '../../store.model';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrl: './store-list.component.css'
})
export class StoreListComponent implements OnInit {
  store: Store[] = [];

  constructor(private storeService: StoreService, private toast: ToastService) { }
  ngOnInit(): void {
    this.loadStores();
  }

  private loadStores(): void {
    this.storeService.getStore().subscribe({
      next: (store) => {
        this.store = store;
      },
      error: (err) => {
        console.error('Error loading stores:', err);
        this.toast.error('Failed to load stores');
      }
    });
  }


}
