import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SalesPromotionService, PromotionResponse } from '../../../../services/sales-promotion.service';

@Component({
  selector: 'app-sales-promotion-list',
  templateUrl: './sales-promotion-list.component.html',
  styleUrls: ['./sales-promotion-list.component.css']
})
export class SalesPromotionListComponent implements OnInit {
  promotions: PromotionResponse[] = [];
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private salesPromotionService: SalesPromotionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPromotions();
  }

  loadPromotions(): void {
    this.loading = true;
    this.salesPromotionService.getAllPromotions().subscribe({
      next: (res: any) => {
        this.promotions = Array.isArray(res) ? res : (res?.data || res);
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        console.error('Error loading promotions:', error);
      }
    });
  }

  viewPromotion(id: number): void {
    this.router.navigate(['/home/sales-promotion', id]);
  }

  editPromotion(id: number): void {
    this.router.navigate(['/home/sales-promotion', id, 'edit']);
  }

  goToCreate(): void {
    this.router.navigate(['/home/sales-promotion/create']);
  }

  goToByStock(): void {
    this.router.navigate(['/home/sales-promotion/by-stock']);
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
}
