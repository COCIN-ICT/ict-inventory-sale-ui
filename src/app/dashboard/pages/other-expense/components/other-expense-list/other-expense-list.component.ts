import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OtherExpenseService } from '../../../../../services/other-expense.service';

@Component({
  selector: 'app-other-expense-list',
  templateUrl: './other-expense-list.component.html',
  styleUrls: ['./other-expense-list.component.css']
})
export class OtherExpenseListComponent implements OnInit {
  expenses: any[] = [];
  isLoading = false;
  errorMessage = '';
  showPendingOnly = false;

  constructor(
    private readonly otherExpenseService: OtherExpenseService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const source$ = this.showPendingOnly
      ? this.otherExpenseService.getPending()
      : this.otherExpenseService.getAll();

    source$.subscribe({
      next: (response) => {
        this.expenses = Array.isArray(response) ? response : (response?.data || response?.content || []);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading other expenses:', error);
        this.errorMessage = 'Failed to load other expenses. Please try again.';
        this.isLoading = false;
        this.expenses = [];
      }
    });
  }

  togglePendingOnly(): void {
    this.showPendingOnly = !this.showPendingOnly;
    this.loadExpenses();
  }

  navigateToCreate(): void {
    this.router.navigate(['/home/other-expense/create']);
  }

  private getExpenseId(expense: any): number | undefined {
    if (!expense) {
      return undefined;
    }

    // Try common id property names first
    const directId =
      expense.id ??
      expense.expenseId ??
      expense.otherExpenseId;

    if (typeof directId === 'number') {
      return directId;
    }

    // Fallback: look for the first numeric property whose name contains 'id'
    for (const key of Object.keys(expense)) {
      const value = (expense as any)[key];
      if (typeof value === 'number' && key.toLowerCase().includes('id')) {
        return value;
      }
    }

    return undefined;
  }

  navigateToDetails(expense: any): void {
    const id = this.getExpenseId(expense);
    if (!id) {
      return;
    }
    this.router.navigate(['/home/other-expense/details', id]);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
}

