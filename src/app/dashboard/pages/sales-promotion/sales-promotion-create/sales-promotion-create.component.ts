import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SalesPromotionService, CreatePromotionRequest, StockResponse } from '../../../../services/sales-promotion.service';

@Component({
  selector: 'app-sales-promotion-create',
  templateUrl: './sales-promotion-create.component.html',
  styleUrls: ['./sales-promotion-create.component.css']
})
export class SalesPromotionCreateComponent implements OnInit {
  model: CreatePromotionRequest = {
    stockId: 0,
    discountType: 'AMOUNT',
    discountValue: 0,
    minimumQuantity: 0,
    startDate: '',
    endDate: ''
  };

  stocks: StockResponse[] = [];
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStocks();
    
    // Set default dates
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    this.model.startDate = tomorrow.toISOString().slice(0, 16);
    this.model.endDate = nextWeek.toISOString().slice(0, 16);
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
        this.errorMessage = 'Failed to load stocks. Please try again.';
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

    if (startDate < new Date()) {
      this.errorMessage = 'Start date cannot be in the past';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    
    this.salesPromotionService.createPromotion(this.model).subscribe({
      next: (res: any) => {
        this.successMessage = 'Sales promotion created successfully!';
        this.saving = false;
        setTimeout(() => {
          this.router.navigate(['/home/sales-promotion']);
        }, 1500);
      },
      error: (error: any) => {
        this.saving = false;
        this.errorMessage = 'Failed to create sales promotion. Please try again.';
        console.error('Error creating sales promotion:', error);
      }
    });
  }

  cancelCreate(): void {
    this.router.navigate(['/home/sales-promotion']);
  }

  refreshStocks(): void {
    this.loadStocks();
  }
}
