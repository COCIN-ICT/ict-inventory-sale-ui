export interface DepartmentList {
  id?: number;
  name: string;
  departmentHeadFirstName?: string;
  departmentHeadLastName?: string;
  departmentHeadId?: number;
}
export interface NewDepartment {
  name: string;
  departmentHeadId?: number;
}