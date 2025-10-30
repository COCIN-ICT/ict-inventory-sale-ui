import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesPromotionService, UpdatePromotionRequest, PromotionResponse, StockResponse } from '../../../../services/sales-promotion.service';

@Component({
  selector: 'app-sales-promotion-edit',
  templateUrl: './sales-promotion-edit.component.html',
  styleUrls: ['./sales-promotion-edit.component.css']
})
export class SalesPromotionEditComponent implements OnInit {
  promotionId: number = 0;
  promotion: PromotionResponse | null = null;
  model: UpdatePromotionRequest = {
    stockId: 0,
    discountType: 'AMOUNT',
    discountValue: 0,
    minimumQuantity: 0,
    startDate: '',
    endDate: ''
  };

  stocks: StockResponse[] = [];
  loading = false;
  saving = false;
  showValidation = false;
  successMessage = '';
  errorMessage = '';
  loadingStocks = false;

  discountTypes = [
    { value: 'AMOUNT', label: 'Amount' },
    { value: 'PERCENTAGE', label: 'Percentage' },
    { value: 'FIXED_PRICE', label: 'Fixed Price' }
  ];

  constructor(
    private salesPromotionService: SalesPromotionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.promotionId = +this.route.snapshot.paramMap.get('id')!;
    if (this.promotionId) {
      this.loadPromotion();
      this.loadStocks();
    } else {
      this.errorMessage = 'Invalid promotion ID';
    }
  }

  loadPromotion(): void {
    this.loading = true;
    this.salesPromotionService.getPromotionById(this.promotionId).subscribe({
      next: (res: any) => {
        this.promotion = res;
        this.model = {
          stockId: res.stockId,
          discountType: res.discountType,
          discountValue: res.discountValue,
          minimumQuantity: res.minimumQuantity,
          startDate: res.startDate.slice(0, 16), // Convert to datetime-local format
          endDate: res.endDate.slice(0, 16)
        };
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.errorMessage = 'Failed to load promotion details';
        console.error('Error loading promotion details:', error);
      }
    });
  }

  loadStocks(): void {
    this.loadingStocks = true;
    this.salesPromotionService.getAllStocks().subscribe({
      next: (res: any) => {
        this.stocks = Array.isArray(res) ? res : (res?.data || res);
        this.loadingStocks = false;
      },
      error: (error: any) => {
        console.error('Error loading stocks:', error);
        this.loadingStocks = false;
      }
    });
  }

  save(): void {
    this.showValidation = true;
    
    // Check if required fields are filled
    if (!this.model.stockId || !this.model.discountValue || !this.model.minimumQuantity || !this.model.startDate || !this.model.endDate) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    if (this.model.discountValue <= 0) {
      this.errorMessage = 'Discount value must be greater than 0';
      return;
    }

    if (this.model.minimumQuantity <= 0) {
      this.errorMessage = 'Minimum quantity must be greater than 0';
      return;
    }

    if (this.model.stockId === 0) {
      this.errorMessage = 'Please select a valid stock';
      return;
    }

    // Validate dates
    const startDate = new Date(this.model.startDate);
    const endDate = new Date(this.model.endDate);
    
    if (startDate >= endDate) {
      this.errorMessage = 'End date must be after start date';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    
    this.salesPromotionService.updatePromotion(this.promotionId, this.model).subscribe({
      next: (res: any) => {
        this.successMessage = 'Sales promotion updated successfully!';
        this.saving = false;
        setTimeout(() => {
          this.router.navigate(['/home/sales-promotion']);
        }, 1500);
      },
      error: (error: any) => {
        this.saving = false;
        this.errorMessage = 'Failed to update sales promotion. Please try again.';
        console.error('Error updating sales promotion:', error);
      }
    });
  }

  cancelEdit(): void {
    this.router.navigate(['/home/sales-promotion']);
  }

  refreshStocks(): void {
    this.loadStocks();
  }
}
