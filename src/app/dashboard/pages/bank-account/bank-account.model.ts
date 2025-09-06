/**
 * Represents the data for a new bank account, as required by the API's request body.
 */
export interface BankAccount {
  id: number;
  accountNumber: string;
  accountName: string;
  bankName: string;
}

/**
 * Represents the complete bank account object returned from the API.
 * This model includes all properties from your existing design plus the 'active' status
 * from the API documentation.
 */
export interface BankAccountResponse {
  id: number;
  accountNumber: string;
  accountName: string;
  bankName: string;
  active: boolean; // Added based on the Swagger documentation
  createdAt: string;
  updatedAt: string;
}
