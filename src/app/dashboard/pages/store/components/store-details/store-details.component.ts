import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../../../../services/store.service';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-store-details',
  templateUrl: './store-details.component.html',
  styleUrl: './store-details.component.css'
})
export class StoreDetailsComponent {
  stocks: any = {};
  id!: number;
  batches: any[] = [];
  promotions: any[] = [];
  pricePerUnit: number = 0;


  // constructor(public router: Router) {
  //   const nav = this.router.getCurrentNavigation();
  //   this.stock = nav?.extras?.state?.['stock'];
  // }
   constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private toast: ToastService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadStoreDetails();
  }

  loadStoreDetails() {
    this.storeService.getStockByStoreId(this.id).subscribe({
      next: (res) => {
          // Assuming the API returns an array of stock items in that store
        if (res && Array.isArray(res) && res.length > 0) {
          this.stocks = res[0]; // take the first one for details
          this.batches = this.stocks.batches || [];
          this.promotions = this.stocks.promotions || [];
          this.pricePerUnit = this.stocks.pricePerUnit || 0;
        } else {
          console.warn('No stock found for this store');
        }
      },
      error: (err) => {
        console.error('Failed to load store details:', err);
      }
    });
  }

  

}
