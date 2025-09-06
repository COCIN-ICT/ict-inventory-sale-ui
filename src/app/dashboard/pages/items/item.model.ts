
export interface Item {
  name: string;
  itemType: 'RAW' | 'PROCESSED' | 'FINISHED_PRODUCT'; // Use a union type for itemType
  isExpirable: boolean;
  unitOfMeasureId: number;
  itemCategoryId: number;
}

/**
 * Represents the complete item object returned from the API.
 */
export interface ItemResponse {
  id: number;
  name: string;
  itemCode: string;
  itemType: string;
  isExpirable: boolean;
  isActive: boolean;
  unitOfMeasure: { id: number; unit: string; };
  itemCategory: { id: number; name: string; };
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents the detailed Unit of Measure object returned from the API.
 */
export interface UnitOfMeasureResponse {
  id: number;
  unit: string;
}

/**
 * Represents the detailed Item Category object returned from the API.
 */
export interface ItemCategoryResponse {
  id: number;
  name: string;
}