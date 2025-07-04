import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface AuthResponse {
  token: string;
  user?: any; // if your API returns more
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'api';

  constructor( private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post(`${ this.apiUrl}/login`, { username, password});
  }

  logout(){
    localStorage.removeItem('token')
  }

   isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
