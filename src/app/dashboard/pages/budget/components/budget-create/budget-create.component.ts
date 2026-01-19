import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BudgetService } from '../../../../../services/budget.service';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-budget-create',
  templateUrl: './budget-create.component.html',
  styleUrls: ['./budget-create.component.css']
})
export class BudgetCreateComponent implements OnInit {
  budgetForm: FormGroup;
  isLoading = false;
  currentYear = new Date().getFullYear();
  years: number[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private budgetService: BudgetService,
    private toast: ToastService
  ) {
    // Generate years array (current year to current year + 10)
    for (let i = this.currentYear; i <= this.currentYear + 10; i++) {
      this.years.push(i);
    }

    this.budgetForm = this.fb.group({
      year: [this.currentYear, [Validators.required, Validators.min(this.currentYear)]],
      allocatedAmount: [0, [Validators.required, Validators.min(0.01)]],
      budgetType: ['EXPENDITURE', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  isFieldInvalid(field: string): boolean {
    const control = this.budgetForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getFieldError(field: string): string {
    const control = this.budgetForm.get(field);
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'This field is required.';
    if (control.errors['min']) return field === 'allocatedAmount' ? 'Amount must be greater than 0.' : 'Invalid year.';
    return 'Invalid field value.';
  }

  onSubmit(): void {
    if (this.budgetForm.invalid) {
      this.budgetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const payload = {
      year: this.budgetForm.value.year,
      allocatedAmount: this.budgetForm.value.allocatedAmount,
      budgetType: this.budgetForm.value.budgetType
    };

    this.budgetService.createBudget(payload).subscribe({
      next: (res: any) => {
        const id = res?.id || res?.data?.id || res?.result?.id;
        this.toast.success('Budget created successfully');
        this.isLoading = false;
        
        if (id) {
          this.router.navigate([`/home/budget/details/${id}`]);
        } else {
          this.router.navigate(['/home/budget/list']);
        }
      },
      error: (err: any) => {
        const errorMessage = err?.error?.message || err?.message || 'Failed to create budget';
        this.toast.error(errorMessage);
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/home/budget/list']);
  }
}
