import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesPromotionService, PromotionResponse } from '../../../../services/sales-promotion.service';

@Component({
  selector: 'app-sales-promotion-details',
  templateUrl: './sales-promotion-details.component.html',
  styleUrls: ['./sales-promotion-details.component.css']
})
export class SalesPromotionDetailsComponent implements OnInit {
  promotionId: number = 0;
  promotion: PromotionResponse | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private salesPromotionService: SalesPromotionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.promotionId = +this.route.snapshot.paramMap.get('id')!;
    if (this.promotionId) {
      this.loadPromotionDetails();
    } else {
      this.errorMessage = 'Invalid promotion ID';
    }
  }

  loadPromotionDetails(): void {
    this.loading = true;
    this.salesPromotionService.getPromotionById(this.promotionId).subscribe({
      next: (res: any) => {
        this.promotion = res;
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.errorMessage = 'Failed to load promotion details';
        console.error('Error loading promotion details:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/home/sales-promotion']);
  }

  editPromotion(): void {
    this.router.navigate(['/home/sales-promotion', this.promotionId, 'edit']);
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

  getDiscountDisplayValue(discountType: string, discountValue: number): string {
    switch (discountType?.toUpperCase()) {
      case 'PERCENTAGE': return `${discountValue}%`;
      case 'AMOUNT': return `₦${discountValue.toFixed(2)}`;
      case 'FIXED_PRICE': return `₦${discountValue.toFixed(2)}`;
      default: return discountValue.toString();
    }
  }
}
