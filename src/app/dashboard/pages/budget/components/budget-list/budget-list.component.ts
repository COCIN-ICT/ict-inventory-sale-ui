import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BudgetService } from '../../../../../services/budget.service';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-budget-list',
  templateUrl: './budget-list.component.html',
  styleUrls: ['./budget-list.component.css']
})
export class BudgetListComponent implements OnInit {
  budgets: any[] = [];
  isLoading = false;
  filterType: string = 'all'; // 'all', 'pending', 'byYear'
  selectedYear: number = new Date().getFullYear();
  selectedBudgetType: string = 'EXPENDITURE';
  years: number[] = [];

  constructor(
    private router: Router,
    private budgetService: BudgetService,
    private toast: ToastService
  ) {
    // Generate years array (current year ± 5 years)
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      this.years.push(i);
    }
  }

  ngOnInit(): void {
    this.loadBudgets();
  }

  loadBudgets(): void {
    this.isLoading = true;
    
    let request: any;
    
    switch (this.filterType) {
      case 'pending':
        request = this.budgetService.getPendingBudgets();
        break;
      case 'byYearUnit':
        request = this.budgetService.getBudgetsByYearAndUnit(this.selectedYear);
        break;
      case 'byYearType':
        request = this.budgetService.getBudgetsByYearAndType(this.selectedYear, this.selectedBudgetType);
        break;
      case 'byYearDepartment':
        request = this.budgetService.getBudgetsByYearAndDepartment(this.selectedYear);
        break;
      default:
        request = this.budgetService.getAllBudgets();
    }

    request.subscribe({
      next: (res: any) => {
        this.budgets = res?.data || res || [];
        if (Array.isArray(this.budgets)) {
          this.budgets = this.budgets;
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        this.toast.error(err?.error?.message || err?.message || 'Failed to load budgets');
        this.isLoading = false;
        this.budgets = [];
      }
    });
  }

  onFilterChange(): void {
    this.loadBudgets();
  }

  navigateToCreate(): void {
    this.router.navigate(['/home/budget/create']);
  }

  navigateToDetails(id: number): void {
    this.router.navigate([`/home/budget/details/${id}`]);
  }

  deleteBudget(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this budget?')) {
      this.budgetService.deleteBudget(id).subscribe({
        next: () => {
          this.toast.success('Budget deleted successfully');
          this.loadBudgets();
        },
        error: (err: any) => {
          this.toast.error(err?.error?.message || err?.message || 'Failed to delete budget');
        }
      });
    }
  }

  getStatusClass(status: string): string {
    const statusUpper = (status || '').toUpperCase();
    if (statusUpper === 'APPROVED' || statusUpper === 'ACTIVE') {
      return 'bg-green-100 text-green-700';
    } else if (statusUpper === 'PENDING') {
      return 'bg-yellow-100 text-yellow-700';
    } else if (statusUpper === 'REJECTED' || statusUpper === 'CANCELLED') {
      return 'bg-red-100 text-red-700';
    }
    return 'bg-gray-100 text-gray-700';
  }
}
