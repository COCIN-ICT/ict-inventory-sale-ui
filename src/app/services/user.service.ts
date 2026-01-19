import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User, Unit, Role } from '../dashboard/pages/user-management/users/users.model';



const API_URL = `${environment.apiUrl}/user`;
const UNITS_API_URL = `${environment.apiUrl}/unit`;
const ROLES_API_URL = `${environment.apiUrl}/role`;

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(API_URL);
  }

  createUser(user: User): Observable<User> {
      return this.http.post<User>(API_URL, user);}
      

  deleteUser(id: number) {
  return this.http.delete(`${API_URL}/${id}`);}

  updateUser(id: number, payload: Partial<User>): Observable<User> {
    console.log("Sending to backend:", payload);
  return this.http.put<User>(`${API_URL}/${id}`, payload);
}

  addRolesToUser(userId: number, roleIds: number[]): Observable<any> {
  const body = { userId, roleIds };
  return this.http.patch(`${API_URL}`, body);
}


 getUserByUsername(username: string): Observable<User> {
  return this.http.get<User>(`${API_URL}/username/${username}`);
}

getUserByEmail(email: string): Observable<User> {
  return this.http.get<User>(`${API_URL}/email/${email}`);
}

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${API_URL}/${id}`);
  }

  getUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(UNITS_API_URL);
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(ROLES_API_URL);
  }
  
}
