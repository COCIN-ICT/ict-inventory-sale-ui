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

  stockId!: number;
  storeId!: number;

  stock: any = {};
  store: any;
  storeType: 'PRIMARY' | 'SECONDARY' | '' = '';

  batches: any[] = [];
  promotions: any[] = []

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
  ) {}

  ngOnInit(): void {
    this.stockId = Number(this.route.snapshot.paramMap.get('stockId'));
    this.storeId = Number(this.route.snapshot.paramMap.get('storeId'));
    this.loadStock();
    this.loadStore();

  }


  loadStock(): void {
    this.storeService.getStockByStoreId(this.storeId).subscribe({
      next: (res: any) => {
        const list = res.data || res;
        const foundStock = list.find((s: any) => s.id === this.stockId);

        if (!foundStock) {
          console.warn('Stock not found in store list');
          return;
        }
        this.stock = foundStock;
        this.batches = foundStock.batches || [];
        this.promotions = foundStock.promotions || [];
      },
      error: (err) => console.error('Error fetching stock details:', err)
    });
  }

  loadStore(): void {
    this.storeService.getStoreById(this.storeId).subscribe({
      next: (res) => {
        this.store = res;
        this.storeType = res.storeType || '';
      },
      error: (err) => console.error('Failed to load store details:', err)
    });
  }




   /* stocks: any = {};
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

    store: any;
    stock: any;
    storeId!: number;
    stockId!: number;
    storeType: string = '';


    searchTerm: string = ''; */
  
  
  
   
    // constructor(
    //   private route: ActivatedRoute,
    //   private http: HttpClient,
    //   private router: Router,
    //   private toast: ToastService,
    //   private storeService: StoreService,
    //   private fb: FormBuilder,
    //   private pricingService: PricingService,
    // ) {}
  
    // ngOnInit(): void {
    //     this.storeId = Number(this.route.snapshot.paramMap.get('storeId'));
    //     this.stockId = Number(this.route.snapshot.paramMap.get('stockId'));

    //     console.log('Store ID:', this.storeId);
    //     console.log('Stock ID:', this.stockId);
    //   this.pricingForm = this.fb.group({
            
    //         price: ['', [Validators.required, Validators.min(1)]],
    //       });
    //   this.loadStockDetails();
    //   this.loadStock();

    //   this.loadStoreDetails();
    // }

//     loadStoreDetails(): void {
//       this.storeService.getStoreById(this.storeId).subscribe({
//         next: (res) => {
//           this.store = res;
//           this.storeType = res.storeType || '';
//         },
//         error: (err) => {
//           console.error('Failed to load store details:', err);
//         }
//       });
//     }

//     openStockTransferModal() {
//        const itemId = this.stocks?.item?.id || this.stockId;
  
//   if (!itemId) {
//     this.toast.error('Item ID not found');
//     return;
//   }
//     this.toast.info('Opening Stock Transfer Modal...'); // Placeholder
//   }

//   openAddPricingModal() {
//     this.toast.info('Opening Add Pricing Modal...'); // Placeholder
//   }
  
//     zloadStockDetails() {
//   this.storeService.getStockByStoreId(this.storeId).subscribe({
//     next: (res) => {
//     //  this.stocks = res
//       console.log('Stock list:', res);
//       const list = (res as any).data || res;
//       const stock = list.find((s: any) => s.id === this.stockId);
//       if (stock) {
//         this.stocks = stock;
        
//         this.batches = stock.batches || [];
//         this.promotions = stock.promotions || [];
//         this.pricePerUnit = stock.pricePerUnit || 0;
//       } else {
//         console.log('Stock list2:', this.stocks);
//         console.warn('Stock not found in store list');
//       }
//     },
//     error: (err) => console.error('Error fetching stock details:', err)
//   });
// }

// loadStockDetails() {
//   this.storeService.getStockByStoreId(this.storeId).subscribe({
//     next: (res) => {
//       console.log('Raw stock response:', res);

//       // Handle both array or wrapped response
//       const list = (res as any).data || res;

//       if (!Array.isArray(list)) {
//         console.error('Expected array but got:', list);
//         return;
//       }

//       // Find stock by matching numeric IDs
//       const stock = list.find((s: any) => s.id === +this.stockId);

//       if (stock) {
//         this.stocks = stock;
//         this.batches = stock.batches || [];
//         this.promotions = stock.promotions || [];
//         this.pricePerUnit = stock.pricePerUnit || 0;

//         console.log('✅ Found stock details:', this.stocks);
//       } else {
//         console.warn('⚠️ Stock not found in store list');
//       }
//     },
//     error: (err) => console.error('❌ Error fetching stock details:', err)
//   });
// }

  
//     openModal(){
//       this.showAddPriceModal = true;
//     }
  
//      closeModal() {
//       this.showAddPriceModal = false;
//     }
  
//     onUpdatePrice(){}
  
    // loadStock(): void {
    //   this.pricingService.getStock().subscribe({
    //     next: (stockList) => (this.allStocks = stockList),
    //     error: (err) => console.log('Failed to load stock', err),
    //   });
    // }
  
  
    //  onSubmit(): void {
    //   if (this.pricingForm.invalid) return;
  
    //   this.isSubmitting = true;
    //   this.message = '';
  
    //   const payload: Pricing = {
    //     stockId: this.stockId,
    //     price: this.pricingForm.value.price,
    //   };
  
    //   this.pricingService.createPricing(payload).subscribe({
    //     next: () => {
    //       this.toast.success('Pricing created successfully');
    //       this.pricingForm.reset();
    //       this.isSubmitting = false;
    //       this.closeModal(); // 👈 close modal after success
    //       this.loadStockDetails();
    //     },
    //     error: (err) => {
    //       this.toast.error(err.error.message);
    //       this.isSubmitting = false;
    //     },
    //   });
    // }
  

}
