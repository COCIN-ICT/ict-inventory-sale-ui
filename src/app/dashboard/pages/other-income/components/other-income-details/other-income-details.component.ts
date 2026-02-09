import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OtherIncomeService } from '../../../../../services/other-income.service';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-other-income-details',
  templateUrl: './other-income-details.component.html',
  styleUrls: ['./other-income-details.component.css']
})
export class OtherIncomeDetailsComponent implements OnInit {
  income: any = null;
  isLoading = false;
  errorMessage = '';
  incomeId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private otherIncomeService: OtherIncomeService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.incomeId = Number(idParam);
      this.loadIncome();
    } else {
      this.errorMessage = 'Invalid income ID';
    }
  }

  loadIncome(): void {
    if (!this.incomeId) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.otherIncomeService.getById(this.incomeId).subscribe({
      next: (response) => {
        this.income = response?.data || response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading income:', error);
        this.errorMessage = 'Failed to load income details.';
        this.toast.error(this.errorMessage);
        this.isLoading = false;
      }
    });
  }

  approveIncome(): void {
    if (!this.incomeId) return;

    if (!confirm('Are you sure you want to approve this income?')) {
      return;
    }

    this.otherIncomeService.approve(this.incomeId).subscribe({
      next: () => {
        this.toast.success('Income approved successfully!');
        this.loadIncome();
      },
      error: (error) => {
        console.error('Error approving income:', error);
        this.toast.error(error?.error?.message || 'Failed to approve income.');
      }
    });
  }

  rejectIncome(): void {
    if (!this.incomeId) return;

    if (!confirm('Are you sure you want to reject this income?')) {
      return;
    }

    this.otherIncomeService.reject(this.incomeId).subscribe({
      next: () => {
        this.toast.success('Income rejected successfully!');
        this.loadIncome();
      },
      error: (error) => {
        console.error('Error rejecting income:', error);
        this.toast.error(error?.error?.message || 'Failed to reject income.');
      }
    });
  }

  deleteIncome(): void {
    if (!this.incomeId) return;

    if (!confirm('Are you sure you want to delete this income? This action cannot be undone.')) {
      return;
    }

    this.otherIncomeService.delete(this.incomeId).subscribe({
      next: () => {
        this.toast.success('Income deleted successfully!');
        this.router.navigate(['/home/other-income/list']);
      },
      error: (error) => {
        console.error('Error deleting income:', error);
        this.toast.error(error?.error?.message || 'Failed to delete income.');
      }
    });
  }

  goBackToList(): void {
    this.router.navigate(['/home/other-income/list']);
  }
}
