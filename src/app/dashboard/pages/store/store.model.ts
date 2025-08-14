export interface Store {
  id?: number; // optional for create, present when fetching
  name: string;
  location: string;
  storeType: 'PRIMARY' | 'SECONDARY'; // enum-like string type
  departmentId: number;
}

