import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from '../../../../../services/toast.service';
import { HttpClient } from '@angular/common/http';
import { StoreService } from '../../../../../services/store.service';
import { Pricing } from '../../../pricing/pricing.model';
import { PricingService } from '../../../../../services/pricing.service';


@Component({
  selector: 'app-stock-details',
  templateUrl: './stock-details.component.html',
  styleUrl: './stock-details.component.css'
})
export class StockDetailsComponent {
   stocks: any = {};
    allStocks: any[] = [];
    id!: number;
    batches: any[] = [];
    promotions: any[] = [];
    pricePerUnit: number = 0;
  
    pricingForm!: FormGroup;
    isSubmitting = false;
    message = '';
    availableStock: any;
  
    showAddPriceModal = false;

    storeId!: number;
    stockId!: number;

    searchTerm: string = ''; 
  
  
  
    // constructor(public router: Router) {
    //   const nav = this.router.getCurrentNavigation();
    //   this.stock = nav?.extras?.state?.['stock'];
    // }
    constructor(
      private route: ActivatedRoute,
      private http: HttpClient,
      private router: Router,
      private toast: ToastService,
      private storeService: StoreService,
      private fb: FormBuilder,
      private pricingService: PricingService,
    ) {}
  
    ngOnInit(): void {
        this.storeId = Number(this.route.snapshot.paramMap.get('storeId'));
        this.stockId = Number(this.route.snapshot.paramMap.get('id'));

        console.log('Store ID:', this.storeId);
        console.log('Stock ID:', this.stockId);
      this.pricingForm = this.fb.group({
            availableStock: ['', Validators.required],
            price: ['', [Validators.required, Validators.min(1)]],
          });
      this.loadStockDetails();
      this.loadStock();
    }
  
    loadStockDetails() {
  this.storeService.getStockByStoreId(this.storeId).subscribe({
    next: (res) => {
      console.log('Stock list:', res);
      const stock = res.find((s: any) => s.id === this.stockId);
      if (stock) {
        this.stocks = stock;
        this.batches = stock.batches || [];
        this.promotions = stock.promotions || [];
        this.pricePerUnit = stock.pricePerUnit || 0;
      } else {
        console.warn('Stock not found in store list');
      }
    },
    error: (err) => console.error('Error fetching stock details:', err)
  });
}

  
    openModal(){
      this.showAddPriceModal = true;
    }
  
     closeModal() {
      this.showAddPriceModal = false;
    }
  
    onUpdatePrice(){}
  
    loadStock(): void {
      this.pricingService.getStock().subscribe({
        next: (stockList) => (this.allStocks = stockList),
        error: (err) => console.log('Failed to load stock', err),
      });
    }
  
  
     onSubmit(): void {
      if (this.pricingForm.invalid) return;
  
      this.isSubmitting = true;
      this.message = '';
  
      const payload: Pricing = {
        stockId: this.pricingForm.value.availableStock,
        price: this.pricingForm.value.price,
      };
  
      this.pricingService.createPricing(payload).subscribe({
        next: () => {
          this.toast.success('Pricing created successfully');
          this.pricingForm.reset();
          this.isSubmitting = false;
          this.closeModal(); // 👈 close modal after success
          this.loadStockDetails();
        },
        error: (err) => {
          this.toast.error(err.error.message);
          this.isSubmitting = false;
        },
      });
    }
  

}
