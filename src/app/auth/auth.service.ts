import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

// interface AuthResponse {
//   token: string;
//   user?: any; // depends on your backend response structure
// }

interface AuthResponse {
  token: string;     // 👈 match your backend field names
  refreshToken: string;    // 👈 add this
  user?: any;               // optional user info
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userKey = 'currentUser';
  private tokenKey = 'token';
  private refreshKey = 'refreshToken';

  constructor(private http: HttpClient) {}

  // 🟢 Login and store both token & user data
  login(username: string, password: string) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { username, password });
  }

  // 🟢 Save login data after successful login
  saveAuthData(response: AuthResponse): void {
    if (response.token) {
      localStorage.setItem(this.tokenKey, response.token);
    }
    if (response.refreshToken) {
      localStorage.setItem(this.refreshKey, response.refreshToken);
    }
    if (response.user) {
      localStorage.setItem(this.userKey, JSON.stringify(response.user));
    }
  }

  // 🟢 Get token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

   getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshKey);
  }

  // 🟢 Get current user
  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

   getUserUnit() {
    const user = this.getUser();
    return user ? user.unit : null;
  }

  // 🟢 Check login status
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // 🟢 Logout
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshKey);
    localStorage.removeItem(this.userKey);
  }


}
