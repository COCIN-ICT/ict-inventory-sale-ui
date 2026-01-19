import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BudgetService } from '../../../../../services/budget.service';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-budget-details',
  templateUrl: './budget-details.component.html',
  styleUrls: ['./budget-details.component.css']
})
export class BudgetDetailsComponent implements OnInit {
  budget: any = null;
  isLoading = true;
  isEditing = false;
  isApproving = false;
  budgetId!: number;
  editForm: FormGroup;
  currentYear = new Date().getFullYear();
  years: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private budgetService: BudgetService,
    private toast: ToastService,
    private fb: FormBuilder
  ) {
    // Generate years array
    for (let i = this.currentYear - 5; i <= this.currentYear + 10; i++) {
      this.years.push(i);
    }

    this.editForm = this.fb.group({
      year: ['', [Validators.required, Validators.min(this.currentYear - 5)]],
      allocatedAmount: [0, [Validators.required, Validators.min(0.01)]],
      budgetType: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.budgetId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.budgetId) {
      this.isLoading = false;
      this.toast.error('Invalid budget id');
      this.router.navigate(['/home/budget']);
      return;
    }
    
    this.loadBudgetDetails(this.budgetId);
  }

  loadBudgetDetails(id: number): void {
    this.isLoading = true;
    
    this.budgetService.getBudgetById(id).subscribe({
      next: (res: any) => {
        this.budget = res?.data || res || null;
        if (this.budget) {
          this.editForm.patchValue({
            year: this.budget.year,
            allocatedAmount: this.budget.allocatedAmount,
            budgetType: this.budget.budgetType
          });
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        this.toast.error(err?.error?.message || err?.message || 'Failed to load budget details');
        this.isLoading = false;
        this.router.navigate(['/home/budget']);
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing && this.budget) {
      this.editForm.patchValue({
        year: this.budget.year,
        allocatedAmount: this.budget.allocatedAmount,
        budgetType: this.budget.budgetType
      });
    }
  }

  onUpdate(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const payload = {
      year: this.editForm.value.year,
      allocatedAmount: this.editForm.value.allocatedAmount,
      budgetType: this.editForm.value.budgetType
    };

    this.budgetService.updateBudget(this.budgetId, payload).subscribe({
      next: (res: any) => {
        this.toast.success('Budget updated successfully');
        this.isLoading = false;
        this.isEditing = false;
        this.loadBudgetDetails(this.budgetId);
      },
      error: (err: any) => {
        this.toast.error(err?.error?.message || err?.message || 'Failed to update budget');
        this.isLoading = false;
      }
    });
  }

  onApprove(): void {
    if (!confirm('Are you sure you want to approve this budget?')) {
      return;
    }

    this.isApproving = true;
    this.budgetService.approveBudget(this.budgetId).subscribe({
      next: () => {
        this.toast.success('Budget approved successfully');
        this.isApproving = false;
        this.loadBudgetDetails(this.budgetId);
      },
      error: (err: any) => {
        this.toast.error(err?.error?.message || err?.message || 'Failed to approve budget');
        this.isApproving = false;
      }
    });
  }

  onDelete(): void {
    if (!confirm('Are you sure you want to delete this budget? This action cannot be undone.')) {
      return;
    }

    this.isLoading = true;
    this.budgetService.deleteBudget(this.budgetId).subscribe({
      next: () => {
        this.toast.success('Budget deleted successfully');
        this.router.navigate(['/home/budget/list']);
      },
      error: (err: any) => {
        this.toast.error(err?.error?.message || err?.message || 'Failed to delete budget');
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    if (this.isEditing) {
      this.isEditing = false;
      if (this.budget) {
        this.editForm.patchValue({
          year: this.budget.year,
          allocatedAmount: this.budget.allocatedAmount,
          budgetType: this.budget.budgetType
        });
      }
    } else {
      this.router.navigate(['/home/budget/list']);
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.editForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getFieldError(field: string): string {
    const control = this.editForm.get(field);
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'This field is required.';
    if (control.errors['min']) return field === 'allocatedAmount' ? 'Amount must be greater than 0.' : 'Invalid year.';
    return 'Invalid field value.';
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

  canApprove(): boolean {
    return this.budget && (this.budget.status === 'PENDING' || !this.budget.status);
  }
}
