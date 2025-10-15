import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../../../../services/store.service';
import { ToastService } from '../../../../../services/toast.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PricingService } from '../../../../../services/pricing.service';
import { Pricing } from '../../../pricing/pricing.model';

@Component({
  selector: 'app-store-details',
  templateUrl: './store-details.component.html',
  styleUrl: './store-details.component.css'
})
export class StoreDetailsComponent {
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
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.pricingForm = this.fb.group({
          availableStock: ['', Validators.required],
          price: ['', [Validators.required, Validators.min(1)]],
        });
    this.loadStoreDetails();
    this.loadStock();
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
        this.loadStoreDetails();
      },
      error: (err) => {
        this.toast.error(err.error.message);
        this.isSubmitting = false;
      },
    });
  }







  

}
