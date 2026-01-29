import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OtherExpenseRequest, OtherExpenseService } from '../../../../../services/other-expense.service';

@Component({
  selector: 'app-other-expense-create',
  templateUrl: './other-expense-create.component.html',
  styleUrls: ['./other-expense-create.component.css']
})
export class OtherExpenseCreateComponent {
  form: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly otherExpenseService: OtherExpenseService,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
      budgetLineItemId: [null, [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      category: ['', [Validators.required, Validators.maxLength(255)]],
      notes: ['']
    });
  }

  submit(): void {
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: OtherExpenseRequest = this.form.value;
    this.isSubmitting = true;

    this.otherExpenseService.create(payload).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        const id = created?.id;
        if (id) {
          this.router.navigate(['/home/other-expense/details', id]);
        } else {
          this.router.navigate(['/home/other-expense/list']);
        }
      },
      error: (error) => {
        console.error('Error creating other expense:', error);
        this.errorMessage = 'Failed to create other expense. Please check the data and try again.';
        this.isSubmitting = false;
      }
    });
  }

  goBackToList(): void {
    this.router.navigate(['/home/other-expense/list']);
  }
}

