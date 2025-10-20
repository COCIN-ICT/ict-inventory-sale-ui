import { Department } from "../../../services/departments.service";
import { Unit } from "../user-management/unit/unit.model";


export interface Store {
  id?: number; 
  name: string;
  location: string;
  storeType: 'PRIMARY' | 'SECONDARY'; 
  unitId: number;
  departmentId: number;

  unit?: Unit 
  department?: Department 

  createdAt?: string;
  updatedAt?: string;

  displayOrder?: number; 
}

export interface Stock {
  
}
