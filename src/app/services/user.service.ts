import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APPURL } from '../helpers';

export interface User {
  firstName: string;
  lastName: string;
  middleName: string;
  username: string;
  password: string;
  address: string;
  phone: string;
  email: string;
  roleId: number;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get(`${APPURL}/user`);
  }

  createUser(user: User) {
    return this.http.post(`${APPURL}/user`, user);
  }
  
}
