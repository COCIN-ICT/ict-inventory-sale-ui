export interface DepartmentList {
  id?: number;
  name: string;
  departmentHeadFirstName?: string;
  departmentHeadLastName?: string;
  departmentHeadId?: number;
  departmentHead?: User;
}
export interface NewDepartment {
  name: string;
  departmentHeadId?: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
}