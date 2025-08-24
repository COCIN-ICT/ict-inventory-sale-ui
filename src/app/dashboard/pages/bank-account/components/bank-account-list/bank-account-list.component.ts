import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BankAccountFormComponent } from '../bank-account-form/bank-account-form.component';
import { BankAccount, BankAccountResponse } from '../../bank-account.model';
import { BankAccountService } from '../../../../../services/bank-account.service';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-bank-account-list',
  templateUrl: './bank-account-list.component.html',
  styleUrl: './bank-account-list.component.css'
})
export class BankAccountListComponent {
  bankAccounts: BankAccountResponse[] = [];
  originalAccounts: BankAccountResponse[] = [];
  searchTerm = '';

  constructor(private dialog: MatDialog, private bankAccountService: BankAccountService, 
    private toast: ToastService
  ){}

  ngOnInit(): void {
    
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.bankAccountService.getBankAccounts().subscribe({
      next: (res: any) => {
        this.bankAccounts = res.data || res.users || res.result || res || []  ;
        this.originalAccounts = [...this.bankAccounts];
      },
      error: (err) => {
        console.error('err', err);
        this.bankAccounts = [];
      }
    });
  }

  private applyFilters(): void {
  let filteredAccounts = [...this.originalAccounts];

  if (this.searchTerm) {
    filteredAccounts = filteredAccounts.filter(account => {
      // Return false if the account object is null or undefined
      if (!account) {
        return false;
      }
      
      const searchTermLower = this.searchTerm.toLowerCase();
      
      // Convert each property to a string before calling toLowerCase()
      return (
        String(account.accountNumber).toLowerCase().includes(searchTermLower) ||
        String(account.accountName).toLowerCase().includes(searchTermLower) ||
        String(account.bankName).toLowerCase().includes(searchTermLower) 
        
      );
    });
  }
  
  this.bankAccounts = filteredAccounts;
}

  searchList(){
    this.applyFilters();
  }

  openCreateForm() {
    const dialogRef = this.dialog.open(BankAccountFormComponent, {data: null});

    dialogRef.afterClosed().subscribe(result => {
      if (result) { // result now contains the new account
      // Insert new account at the top
      const newAccountWithStatus: BankAccountResponse = {...result, active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.originalAccounts.unshift(newAccountWithStatus);
      this.applyFilters();
    }
    });
  }

  openEditForm(account: BankAccountResponse): void {
  const dialogRef = this.dialog.open(BankAccountFormComponent, { data: {...account }});
  console.log('Account passed to dialog:', account);

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // Instant local update (optimistic UI)
      const index = this.originalAccounts.findIndex(acc => acc.id === result.id);
      if (index !== -1) {
        this.originalAccounts[index] = { ...this.originalAccounts[index], ...result };
      }

      // Sync with backend (server refresh)
      this.loadAccounts();
    }
  });
}

  changeStatus(account: BankAccountResponse): void {
    const newStatus = account.active ? 'deactivate' : 'active';
    const message = `Are you sure you want to ${newStatus} account ${account.accountNumber}?`;
    if (confirm(message)) {
      this.bankAccountService.changeStatus(account.id, newStatus).subscribe({
        next: () => {
          this.toast.success(`Account status changed successfully!`); 
          account.active = !account.active; 
          this.loadAccounts();
        },
        error: (err) => {
          console.error('Error changing status:', err);
        }
      });
    }
  }


}
