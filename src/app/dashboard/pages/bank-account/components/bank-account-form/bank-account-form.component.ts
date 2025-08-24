import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankAccountService } from '../../../../../services/bank-account.service';
import { BankAccount } from '../../bank-account.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from '../../../../../services/toast.service';
import { response } from 'express';

@Component({
  selector: 'app-bank-account-form',
  templateUrl: './bank-account-form.component.html',
  styleUrl: './bank-account-form.component.css'
})
export class BankAccountFormComponent {
  form!: FormGroup;
  isEditing = false;

  constructor(private fb: FormBuilder, private bankAccountService: BankAccountService,
    public dialogRef: MatDialogRef<BankAccountFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BankAccount | null,
    private toast: ToastService
  ) { }

  private initializeForm(): void {
    this.form = this.fb.group({
      id: [this.data?.id || null],
      accountNumber: [this.data?.accountNumber || '', Validators.required],
      accountName: [this.data?.accountName || '', Validators.required],
      bankName: [this.data?.bankName || '', Validators.required],
    }); 
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.data) {
      this.isEditing = true;
      this.form.patchValue(this.data);
    }
  }

  onSubmit(): void {
    console.log("Form submitted", this.form.value);
    if (this.form.valid) {
      const bankAccToSubmit: BankAccount = {...this.form.value};
      if (this.isEditing) {
        this.bankAccountService.updateBankAccount(bankAccToSubmit.id, bankAccToSubmit).subscribe({
          next: (response) => {
            this.toast.success('Bank account updated successfully');
            this.dialogRef.close(response);
          },
          error: (err) => {
            this.toast.error(err.error.message);
          }
        });
      } else {
        this.bankAccountService.createBankAccount(bankAccToSubmit).subscribe({
          next: (response) => {
            
            console.log('Bank account created successfully!', response);
            this.toast.success('Bank account created successfully');
            this.dialogRef.close(response);
          },
          error: (err) => {
            this.toast.error(err.error.message);
          }
        });
      }
    }
  }

   onCancel(): void {
    this.dialogRef.close();
  }

}
