import { Department } from "../../../services/departments.service";
import { Unit } from "../user-management/unit/unit.model";


export interface Store {
  id?: number; // optional for create, present when fetching
  name: string;
  location: string;
  storeType: 'PRIMARY' | 'SECONDARY'; // enum-like string type
  unitId: number;
  departmentId: number;

  unit?: Unit // related unit info
  department: Department // related unit info if available
  displayOrder?: number; 
}
