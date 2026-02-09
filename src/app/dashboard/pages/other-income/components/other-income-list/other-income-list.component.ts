import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OtherIncomeService } from '../../../../../services/other-income.service';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-other-income-list',
  templateUrl: './other-income-list.component.html',
  styleUrls: ['./other-income-list.component.css']
})
export class OtherIncomeListComponent implements OnInit {
  incomes: any[] = [];
  isLoading = false;
  errorMessage = '';
  showPendingOnly = false;

  constructor(
    private readonly otherIncomeService: OtherIncomeService,
    private readonly router: Router,
    private readonly toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadIncomes();
  }

  loadIncomes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const source$ = this.showPendingOnly
      ? this.otherIncomeService.getPending()
      : this.otherIncomeService.getAll();

    source$.subscribe({
      next: (response) => {
        this.incomes = Array.isArray(response) ? response : (response?.data || response?.content || []);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading other incomes:', error);
        this.errorMessage = 'Failed to load other incomes. Please try again.';
        this.toast.error(this.errorMessage);
        this.isLoading = false;
        this.incomes = [];
      }
    });
  }

  togglePendingOnly(): void {
    this.showPendingOnly = !this.showPendingOnly;
    this.loadIncomes();
  }

  navigateToCreate(): void {
    this.router.navigate(['/home/other-income/create']);
  }

  private getIncomeId(income: any): number | undefined {
    if (!income) {
      return undefined;
    }

    const directId = income.id ?? income.incomeId ?? income.otherIncomeId;

    if (typeof directId === 'number') {
      return directId;
    }

    for (const key of Object.keys(income)) {
      const value = income[key];
      if (typeof value === 'number' && key.toLowerCase().includes('id')) {
        return value;
      }
    }

    return undefined;
  }

  navigateToDetails(income: any): void {
    const id = this.getIncomeId(income);
    if (!id) {
      this.toast.error('Unable to determine income ID');
      return;
    }
    this.router.navigate(['/home/other-income/details', id]);
  }

  navigateToDetailsFromId(id: number): void {
    if (!id) {
      return;
    }
    this.router.navigate(['/home/other-income/details', id]);
  }
}
