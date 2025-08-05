import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

interface AuthResponse {
  token: string;
  user?: any; // if your API returns more
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'api';
    refreshToken: any;

  constructor( private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post(`${environment.apiUrl}/auth/login`, { username, password});
  }

  logout(){
    localStorage.removeItem('token'),
    localStorage.removeItem('currentUser');
  }

   isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
