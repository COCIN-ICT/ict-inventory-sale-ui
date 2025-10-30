import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesCreditService, CreditResponse } from '../../../../services/sales-credit.service';

@Component({
  selector: 'app-sales-credit-details',
  templateUrl: './sales-credit-details.component.html',
  styleUrls: ['./sales-credit-details.component.css']
})
export class SalesCreditDetailsComponent implements OnInit {
  creditId!: number;
  credit: CreditResponse | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private salesCreditService: SalesCreditService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.creditId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.creditId) {
      this.loadCreditDetails();
    } else {
      this.errorMessage = 'Invalid credit ID';
    }
  }

  loadCreditDetails(): void {
    this.loading = true;
    this.salesCreditService.getCreditById(this.creditId).subscribe({
      next: (res: any) => {
        this.credit = res;
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.errorMessage = 'Failed to load credit details';
        console.error('Error loading credit details:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/home/sales-credit']);
  }

  getStatusColor(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
