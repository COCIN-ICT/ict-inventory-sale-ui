/**
 * Represents the request body for creating a new Purchase Item.
 * This model contains only the necessary fields to be sent to the API.
 */
export interface PurchaseItem {
  /**
   * The unique identifier of the item being purchased.
   */
  itemId: number;

  /**
   * The quantity of the item.
   */
  quantity: number;

  /**
   * The unit price of a single item.
   */
  unitPrice: number;

  /**
   * The unique identifier of the purchase order this item belongs to.
   */
  purchaseOrderId: number;
}

/**
 * Represents the detailed Unit of Measure object returned from the API.
 * This is nested within the ItemResponse.
 */
export interface UnitOfMeasureResponse {
  id: number;
  unit: string;
  // Add other properties if available in the API response
}

/**
 * Represents the detailed Item Category object returned from the API.
 * This is nested within the ItemResponse.
 */
export interface ItemCategoryResponse {
  id: number;
  name: string;
  // Add other properties if available in the API response
}

/**
 * Represents the complete Item object returned from the API.
 * This is nested within the PurchaseItemResponse.
 */
export interface ItemResponse {
  /**
   * The unique identifier for the item.
   */
  id: number;
  name: string;
  itemCode: string;
  itemType: string;
  isExpirable: boolean;
  isActive: boolean;
  unitOfMeasure: UnitOfMeasureResponse;
  itemCategory: ItemCategoryResponse;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents the complete Purchase Item object returned from the API
 * after a successful creation or retrieval.
 * This model includes additional fields like 'id', a nested 'item' object, and calculated totals.
 */
export interface PurchaseItemResponse {
  /**
   * The unique identifier for the purchase item, assigned by the server.
   */
  id: number;
  
  /**
   * The complete Item object associated with this purchase.
   */
  item: ItemResponse;
  
  /**
   * The quantity of this item purchased.
   */
  quantity: number;
  
  /**
   * The price per unit of the item.
   */
  unitPrice: number;
  
  /**
   * The calculated total price for this purchase item.
   */
  totalPrice: number;
  
  /**
   * The quantity of this item that has been received.
   */
  quantityReceived: number;
  
  /**
   * The quantity of this item that was damaged.
   */
  quantityDamaged: number;
}
