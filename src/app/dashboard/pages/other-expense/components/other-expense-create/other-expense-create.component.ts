import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OtherExpenseService } from '../../../../../services/other-expense.service';
import { ToastService } from '../../../../../services/toast.service';
import { BudgetService } from '../../../../../services/budget.service';

@Component({
  selector: 'app-other-expense-create',
  templateUrl: './other-expense-create.component.html',
  styleUrls: ['./other-expense-create.component.css']
})
export class OtherExpenseCreateComponent implements OnInit {
  expenseForm: FormGroup;
  isLoading = false;
  budgets: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private otherExpenseService: OtherExpenseService,
    private toast: ToastService,
    private budgetService: BudgetService
  ) {
    this.expenseForm = this.fb.group({
      budgetLineItemId: ['', [Validators.required, Validators.min(1)]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      category: ['', [Validators.required]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadBudgets();
  }

  loadBudgets(): void {
    this.budgetService.getAllBudgets().subscribe({
      next: (res: any) => {
        this.budgets = res?.data || res || [];
      },
      error: (err) => {
        console.error('Failed to load budgets:', err);
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.expenseForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getFieldError(field: string): string {
    const control = this.expenseForm.get(field);
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'This field is required.';
    if (control.errors['min']) return 'Value must be greater than 0.';
    return 'Invalid field value.';
  }

  onSubmit(): void {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      this.toast.error('Please fill in all required fields correctly.');
      return;
    }

    this.isLoading = true;
    const payload = {
      budgetLineItemId: Number(this.expenseForm.value.budgetLineItemId),
      amount: Number(this.expenseForm.value.amount),
      category: this.expenseForm.value.category,
      notes: this.expenseForm.value.notes || undefined
    };

    this.otherExpenseService.create(payload).subscribe({
      next: (response) => {
        this.toast.success('Other expense created successfully!');
        this.router.navigate(['/home/other-expense/list']);
      },
      error: (error) => {
        console.error('Error creating other expense:', error);
        this.toast.error(error?.error?.message || 'Failed to create other expense. Please try again.');
        this.isLoading = false;
      }
    });
  }

  goBackToList(): void {
    this.router.navigate(['/home/other-expense/list']);
  }
}
