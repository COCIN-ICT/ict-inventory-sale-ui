// src/app/purchase-order/purchase-order.model.ts

/**
 * Interface representing a complete Purchase Order object.
 * All fields are based on the user's provided JSON response body.
 */
export interface PurchaseOrder {
  id: number;
  status: string;
  orderDate: string;
  updatedAt: string;
  quotations: Quotation[];
  items: PurchaseOrderItem[];
  subTotal: number;
  discountType: string;
  discountAmount: number;
  totalAmount: number;
  tax: number;
  taxRate: number;
  discountValue: number;
  createdBy: User;
  vettedBy: User | null; // Can be null
  approvedBy: User | null; // Can be null
  clearedBy: User | null; // Can be null
  paidBy: User | null; // Can be null
  unit: Unit;
  orderPayment: OrderPayment;
}

/**
 * Interface for a Quotation within a Purchase Order.
 * Properties are based on the JSON structure.
 */
export interface Quotation {
  id: number;
  quotationNumber: string;
  amount: number;
  invoiceUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  supplier: Supplier;
}

/**
 * Interface for a single item within a Purchase Order.
 */
export interface PurchaseOrderItem {
  id: number;
  item: Item;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  quantityReceived: number;
  quantityDamaged: number;
}

/**
 * Interface for an individual Item.
 */
export interface Item {
  id: number;
  name: string;
  itemCode: string;
  itemType: string;
  isExpirable: boolean;
  isActive: boolean;
  unitOfMeasure: UnitOfMeasure;
  itemCategory: ItemCategory;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for the Unit of Measure.
 */
export interface UnitOfMeasure {
  id: number;
  code: string;
  description: string;
}

/**
 * Interface for an Item Category.
 */
export interface ItemCategory {
  id: number;
  name: string;
}

/**
 * Interface for a User object, including all details from the JSON.
 */
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string; // Added this field
  username: string;
  address: string;
  phone: string; // Added this field
  email: string;
  enabled: boolean;
  accountExpired: boolean;
  credentialsExpired: boolean;
  accountLocked: boolean;
  roles: Role[];
  unit: Unit; // Added this field
}

/**
 * Interface for a User Role.
 */
export interface Role {
  id: number;
  roleName: string;
  permissions: Permission[];
}

/**
 * Interface for a Permission.
 */
export interface Permission {
  id: number;
  roleId: number;
  permissionType: string;
}

/**
 * Interface for a Supplier.
 */
export interface Supplier {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for a Unit.
 */
export interface Unit {
  id: number;
  name: string;
  description: string;
  address: string;
  active: boolean;
  unitHeadId: number; // Added this field
}

/**
 * Interface for the Order Payment details.
 */
export interface OrderPayment {
  id: number;
  purchaseOrderId: number; // Added this field
  totalAmountPayable: number;
  totalAmountPaid: number;
  balance: number;
  createdAt: string;
  updatedAt: string;
  purchasePayments: PurchasePayment[];
}

/**
 * Interface for a specific Purchase Payment record.
 */
export interface PurchasePayment {
  id: number;
  purchaseOrderPaymentId: number;
  amount: number;
  paidBy: User;
  paymentDate: string;
  account: Account;
}

/**
 * Interface for an Account.
 */
export interface Account {
  accountNumber: number;
  accountName: string;
  bankName: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
