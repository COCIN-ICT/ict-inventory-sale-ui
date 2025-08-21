export interface Department {
  id?: number;
  name?: string; // Optional for create request
  departmentHeadFirstName?: string;
  departmentHeadLastName?: string;
  departmentHeadId?: number;
}

export interface Unit {
  id?: number; // Optional, assigned by server on create
  displayId: number; // Local ID for UI order
  name: string;
  description: string;
  address: string;
  unitHeadId?: number; // ID of the unit head
  departmentId: number; // ID of the department
  active?: boolean; // Optional, may come from response
  unitHead?: string; // Optional, may come from response
  department?: Department; // Optional, may come from response
  displayOrder?: number;
}

export interface UnitHead {
  id: number;
  firstName: string;
  lastName: string;
}