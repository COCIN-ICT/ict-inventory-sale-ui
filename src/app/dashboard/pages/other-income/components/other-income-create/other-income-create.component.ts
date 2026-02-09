import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OtherIncomeService } from '../../../../../services/other-income.service';
import { ToastService } from '../../../../../services/toast.service';
import { BudgetService } from '../../../../../services/budget.service';
import { BankAccountService } from '../../../../../services/bank-account.service';

@Component({
  selector: 'app-other-income-create',
  templateUrl: './other-income-create.component.html',
  styleUrls: ['./other-income-create.component.css']
})
export class OtherIncomeCreateComponent implements OnInit {
  incomeForm: FormGroup;
  isLoading = false;
  budgets: any[] = [];
  bankAccounts: any[] = [];
  paymentMethods = ['CASH', 'TRANSFER', 'POS'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private otherIncomeService: OtherIncomeService,
    private toast: ToastService,
    private budgetService: BudgetService,
    private bankAccountService: BankAccountService
  ) {
    this.incomeForm = this.fb.group({
      budgetLineItemId: ['', [Validators.required, Validators.min(1)]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      source: ['', [Validators.required]],
      reference: ['', [Validators.required]],
      paymentMethod: ['', [Validators.required]],
      accountId: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadBudgets();
    this.loadBankAccounts();
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

  loadBankAccounts(): void {
    this.bankAccountService.getBankAccounts().subscribe({
      next: (res: any) => {
        this.bankAccounts = res?.data || res || [];
      },
      error: (err) => {
        console.error('Failed to load bank accounts:', err);
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.incomeForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getFieldError(field: string): string {
    const control = this.incomeForm.get(field);
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'This field is required.';
    if (control.errors['min']) return 'Value must be greater than 0.';
    return 'Invalid field value.';
  }

  onSubmit(): void {
    if (this.incomeForm.invalid) {
      this.incomeForm.markAllAsTouched();
      this.toast.error('Please fill in all required fields correctly.');
      return;
    }

    this.isLoading = true;
    const payload: any = {
      budgetLineItemId: Number(this.incomeForm.value.budgetLineItemId),
      amount: Number(this.incomeForm.value.amount),
      source: this.incomeForm.value.source,
      reference: this.incomeForm.value.reference,
      paymentMethod: this.incomeForm.value.paymentMethod,
      notes: this.incomeForm.value.notes || undefined
    };

    if (this.incomeForm.value.accountId) {
      payload.accountId = Number(this.incomeForm.value.accountId);
    }

    this.otherIncomeService.create(payload).subscribe({
      next: (response) => {
        this.toast.success('Other income created successfully!');
        this.router.navigate(['/home/other-income/list']);
      },
      error: (error) => {
        console.error('Error creating other income:', error);
        this.toast.error(error?.error?.message || 'Failed to create other income. Please try again.');
        this.isLoading = false;
      }
    });
  }

  goBackToList(): void {
    this.router.navigate(['/home/other-income/list']);
  }
}
