import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SalesPromotionService, PromotionResponse, StockResponse } from '../../../../services/sales-promotion.service';

@Component({
  selector: 'app-sales-promotion-by-stock',
  templateUrl: './sales-promotion-by-stock.component.html',
  styleUrls: ['./sales-promotion-by-stock.component.css']
})
export class SalesPromotionByStockComponent implements OnInit {
  selectedStockId: number = 0;
  promotions: PromotionResponse[] = [];
  stocks: StockResponse[] = [];
  loading = false;
  loadingStocks = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private salesPromotionService: SalesPromotionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStocks();
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

  loadPromotionsByStock(): void {
    if (!this.selectedStockId || this.selectedStockId === 0) {
      this.errorMessage = 'Please select a stock';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    
    this.salesPromotionService.getPromotionsByStock(this.selectedStockId).subscribe({
      next: (res: any) => {
        this.promotions = Array.isArray(res) ? res : (res?.data || res);
        this.loading = false;
        
        if (this.promotions.length === 0) {
          this.successMessage = 'No promotions found for the selected stock';
        } else {
          this.successMessage = `Found ${this.promotions.length} promotion(s) for the selected stock`;
        }
      },
      error: (error: any) => {
        this.loading = false;
        this.errorMessage = 'Failed to load promotions. Please try again.';
        console.error('Error loading promotions by stock:', error);
      }
    });
  }

  viewPromotion(id: number): void {
    this.router.navigate(['/home/sales-promotion', id]);
  }

  editPromotion(id: number): void {
    this.router.navigate(['/home/sales-promotion', id, 'edit']);
  }

  goToAllPromotions(): void {
    this.router.navigate(['/home/sales-promotion']);
  }

  goToCreate(): void {
    this.router.navigate(['/home/sales-promotion/create']);
  }

  getDiscountTypeColor(discountType: string): string {
    switch (discountType?.toUpperCase()) {
      case 'AMOUNT': return 'bg-blue-100 text-blue-800';
      case 'PERCENTAGE': return 'bg-green-100 text-green-800';
      case 'FIXED_PRICE': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  isActivePromotion(startDate: string, endDate: string): boolean {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  }

  getStatusColor(startDate: string, endDate: string): string {
    if (this.isActivePromotion(startDate, endDate)) {
      return 'bg-green-100 text-green-800';
    }
    const now = new Date();
    const start = new Date(startDate);
    return now < start ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
  }

  getStatusText(startDate: string, endDate: string): string {
    if (this.isActivePromotion(startDate, endDate)) {
      return 'Active';
    }
    const now = new Date();
    const start = new Date(startDate);
    return now < start ? 'Upcoming' : 'Expired';
  }

  getSelectedStockName(): string {
    const stock = this.stocks.find(s => s.id === this.selectedStockId);
    return stock ? `${stock.name} - ${stock.location}` : '';
  }
}
