import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OtherIncomeRequest, OtherIncomeService } from '../../../../../services/other-income.service';

@Component({
  selector: 'app-other-income-create',
  templateUrl: './other-income-create.component.html',
  styleUrls: ['./other-income-create.component.css']
})
export class OtherIncomeCreateComponent {
  form: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  paymentMethods: Array<OtherIncomeRequest['paymentMethod']> = ['CASH', 'TRANSFER', 'POS'];

  constructor(
    private readonly fb: FormBuilder,
    private readonly otherIncomeService: OtherIncomeService,
    private readonly router: Router
  ) {
    this.form = this.fb.group({
      budgetLineItemId: [null, [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      source: ['', [Validators.required]],
      reference: ['', [Validators.required]],
      paymentMethod: ['CASH', [Validators.required]],
      accountId: [null],
      notes: ['']
    });
  }

  submit(): void {
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: OtherIncomeRequest = this.form.value;
    this.isSubmitting = true;

    this.otherIncomeService.create(payload).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        const id = created?.id;
        if (id) {
          this.router.navigate(['/home/other-income/details', id]);
        } else {
          this.router.navigate(['/home/other-income/list']);
        }
      },
      error: (error) => {
        console.error('Error creating other income:', error);
        this.errorMessage = 'Failed to create other income. Please check the data and try again.';
        this.isSubmitting = false;
      }
    });
  }

  goBackToList(): void {
    this.router.navigate(['/home/other-income/list']);
  }
}

