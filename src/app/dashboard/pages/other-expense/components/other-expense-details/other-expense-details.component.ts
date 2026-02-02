import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OtherExpenseRequest, OtherExpenseService } from '../../../../../services/other-expense.service';

@Component({
  selector: 'app-other-expense-details',
  templateUrl: './other-expense-details.component.html',
  styleUrls: ['./other-expense-details.component.css']
})
export class OtherExpenseDetailsComponent implements OnInit {
  expense: any;
  isLoading = false;
  isUpdating = false;
  errorMessage = '';

  editableExpense: Partial<OtherExpenseRequest> = {};

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly otherExpenseService: OtherExpenseService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadExpense(id);
    } else {
      this.router.navigate(['/home/other-expense/list']);
    }
  }

  loadExpense(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.otherExpenseService.getById(id).subscribe({
      next: (expense) => {
        this.expense = expense;
        this.editableExpense = {
          budgetLineItemId: expense.budgetLineItemId ?? expense.budgetLineItem?.id,
          amount: expense.amount,
          category: expense.category,
          notes: expense.notes
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading other expense:', error);
        this.errorMessage = 'Failed to load other expense.';
        this.isLoading = false;
      }
    });
  }

  saveChanges(): void {
    if (!this.expense?.id) {
      return;
    }

    this.isUpdating = true;
    this.errorMessage = '';

    const payload: OtherExpenseRequest = {
      budgetLineItemId: Number(this.editableExpense.budgetLineItemId),
      amount: Number(this.editableExpense.amount),
      category: this.editableExpense.category || '',
      notes: this.editableExpense.notes
    };

    this.otherExpenseService.update(this.expense.id, payload).subscribe({
      next: (updated) => {
        this.expense = updated;
        this.isUpdating = false;
      },
      error: (error) => {
        console.error('Error updating other expense:', error);
        this.errorMessage = 'Failed to update other expense.';
        this.isUpdating = false;
      }
    });
  }

  approve(): void {
    if (!this.expense?.id) {
      return;
    }
    this.isUpdating = true;
    this.errorMessage = '';

    this.otherExpenseService.approve(this.expense.id).subscribe({
      next: (updated) => {
        this.expense = updated;
        this.isUpdating = false;
      },
      error: (error) => {
        console.error('Error approving other expense:', error);
        this.errorMessage = 'Failed to approve other expense.';
        this.isUpdating = false;
      }
    });
  }

  pay(): void {
    if (!this.expense?.id) {
      return;
    }

    this.isUpdating = true;
    this.errorMessage = '';

    // Keep payload flexible; backend can adjust as needed
    const payload = { otherExpenseId: this.expense.id, amount: this.expense.amount };

    this.otherExpenseService.pay(payload).subscribe({
      next: (updated) => {
        this.expense = updated;
        this.isUpdating = false;
      },
      error: (error) => {
        console.error('Error paying other expense:', error);
        this.errorMessage = 'Failed to pay other expense.';
        this.isUpdating = false;
      }
    });
  }

  delete(): void {
    if (!this.expense?.id) {
      return;
    }

    if (!confirm('Are you sure you want to delete this other expense?')) {
      return;
    }

    this.isUpdating = true;
    this.errorMessage = '';

    this.otherExpenseService.delete(this.expense.id).subscribe({
      next: () => {
        this.isUpdating = false;
        this.router.navigate(['/home/other-expense/list']);
      },
      error: (error) => {
        console.error('Error deleting other expense:', error);
        this.errorMessage = 'Failed to delete other expense.';
        this.isUpdating = false;
      }
    });
  }

  goBackToList(): void {
    this.router.navigate(['/home/other-expense/list']);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
}

