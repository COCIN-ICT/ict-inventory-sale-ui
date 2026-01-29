import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OtherIncomeRequest, OtherIncomeService } from '../../../../../services/other-income.service';

@Component({
  selector: 'app-other-income-details',
  templateUrl: './other-income-details.component.html',
  styleUrls: ['./other-income-details.component.css']
})
export class OtherIncomeDetailsComponent implements OnInit {
  income: any;
  isLoading = false;
  isUpdating = false;
  errorMessage = '';

  editableIncome: Partial<OtherIncomeRequest> = {};
  paymentMethods: Array<OtherIncomeRequest['paymentMethod']> = ['CASH', 'TRANSFER', 'POS'];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly otherIncomeService: OtherIncomeService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadIncome(id);
    } else {
      this.router.navigate(['/home/other-income/list']);
    }
  }

  loadIncome(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.otherIncomeService.getById(id).subscribe({
      next: (income) => {
        this.income = income;
        this.editableIncome = {
          budgetLineItemId: income.budgetLineItemId ?? income.budgetLineItem?.id,
          amount: income.amount,
          source: income.source,
          reference: income.reference,
          paymentMethod: income.paymentMethod,
          accountId: income.accountId,
          notes: income.notes
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading other income:', error);
        this.errorMessage = 'Failed to load other income.';
        this.isLoading = false;
      }
    });
  }

  saveChanges(): void {
    if (!this.income?.id) {
      return;
    }

    this.isUpdating = true;
    this.errorMessage = '';

    const payload: OtherIncomeRequest = {
      budgetLineItemId: Number(this.editableIncome.budgetLineItemId),
      amount: Number(this.editableIncome.amount),
      source: this.editableIncome.source || '',
      reference: this.editableIncome.reference || '',
      paymentMethod: (this.editableIncome.paymentMethod || 'CASH') as OtherIncomeRequest['paymentMethod'],
      accountId: this.editableIncome.accountId,
      notes: this.editableIncome.notes
    };

    this.otherIncomeService.update(this.income.id, payload).subscribe({
      next: (updated) => {
        this.income = updated;
        this.isUpdating = false;
      },
      error: (error) => {
        console.error('Error updating other income:', error);
        this.errorMessage = 'Failed to update other income.';
        this.isUpdating = false;
      }
    });
  }

  approve(): void {
    if (!this.income?.id) {
      return;
    }
    this.isUpdating = true;
    this.errorMessage = '';

    this.otherIncomeService.approve(this.income.id).subscribe({
      next: (updated) => {
        this.income = updated;
        this.isUpdating = false;
      },
      error: (error) => {
        console.error('Error approving other income:', error);
        this.errorMessage = 'Failed to approve other income.';
        this.isUpdating = false;
      }
    });
  }

  delete(): void {
    if (!this.income?.id) {
      return;
    }

    if (!confirm('Are you sure you want to delete this other income?')) {
      return;
    }

    this.isUpdating = true;
    this.errorMessage = '';

    this.otherIncomeService.delete(this.income.id).subscribe({
      next: () => {
        this.isUpdating = false;
        this.router.navigate(['/home/other-income/list']);
      },
      error: (error) => {
        console.error('Error deleting other income:', error);
        this.errorMessage = 'Failed to delete other income.';
        this.isUpdating = false;
      }
    });
  }

  goBackToList(): void {
    this.router.navigate(['/home/other-income/list']);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
}

