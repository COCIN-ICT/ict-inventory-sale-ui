import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OtherExpenseService } from '../../../../../services/other-expense.service';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-other-expense-details',
  templateUrl: './other-expense-details.component.html',
  styleUrls: ['./other-expense-details.component.css']
})
export class OtherExpenseDetailsComponent implements OnInit {
  expense: any = null;
  isLoading = false;
  errorMessage = '';
  expenseId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private otherExpenseService: OtherExpenseService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.expenseId = Number(idParam);
      this.loadExpense();
    } else {
      this.errorMessage = 'Invalid expense ID';
    }
  }

  loadExpense(): void {
    if (!this.expenseId) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.otherExpenseService.getById(this.expenseId).subscribe({
      next: (response) => {
        this.expense = response?.data || response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading expense:', error);
        this.errorMessage = 'Failed to load expense details.';
        this.toast.error(this.errorMessage);
        this.isLoading = false;
      }
    });
  }

  approveExpense(): void {
    if (!this.expenseId) return;

    if (!confirm('Are you sure you want to approve this expense?')) {
      return;
    }

    this.otherExpenseService.approve(this.expenseId).subscribe({
      next: () => {
        this.toast.success('Expense approved successfully!');
        this.loadExpense();
      },
      error: (error) => {
        console.error('Error approving expense:', error);
        this.toast.error(error?.error?.message || 'Failed to approve expense.');
      }
    });
  }

  rejectExpense(): void {
    if (!this.expenseId) return;

    if (!confirm('Are you sure you want to reject this expense?')) {
      return;
    }

    this.otherExpenseService.reject(this.expenseId).subscribe({
      next: () => {
        this.toast.success('Expense rejected successfully!');
        this.loadExpense();
      },
      error: (error) => {
        console.error('Error rejecting expense:', error);
        this.toast.error(error?.error?.message || 'Failed to reject expense.');
      }
    });
  }

  deleteExpense(): void {
    if (!this.expenseId) return;

    if (!confirm('Are you sure you want to delete this expense? This action cannot be undone.')) {
      return;
    }

    this.otherExpenseService.delete(this.expenseId).subscribe({
      next: () => {
        this.toast.success('Expense deleted successfully!');
        this.router.navigate(['/home/other-expense/list']);
      },
      error: (error) => {
        console.error('Error deleting expense:', error);
        this.toast.error(error?.error?.message || 'Failed to delete expense.');
      }
    });
  }

  goBackToList(): void {
    this.router.navigate(['/home/other-expense/list']);
  }
}
