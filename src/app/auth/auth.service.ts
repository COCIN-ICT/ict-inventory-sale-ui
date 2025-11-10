import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Observable, tap, throwError } from 'rxjs';

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

  constructor(private http: HttpClient, private router: Router) {}

  // 🟢 Login and store both token & user data
  login(username: string, password: string) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { username, password });
  }

  // 🟢 Save login data after successful login
  saveAuthData(response: AuthResponse): void {

    console.log('💾 Saving auth data:', { 
    hasToken: !!response.token, 
    hasRefreshToken: !!response.refreshToken 
  });
  

  
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

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();

      if (!refreshToken) {
    return throwError(() => new Error('No refresh token available'));
  }

    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
    .pipe(
      // 🟢 Save new tokens after refresh
      tap(response => {
        console.log('💾 Saving refreshed tokens...');
        this.saveAuthData(response);
      })
    );
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
  // logout(): void {
  //   localStorage.removeItem(this.tokenKey);
  //   localStorage.removeItem(this.refreshKey);
  //   localStorage.removeItem(this.userKey);
  // }

  // src/app/auth/auth.service.ts

logout() {
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      // 1️⃣ Call backend logout API
      this.http.post(`${environment.apiUrl}/auth/logout`, {}, { headers })
        .subscribe({
          next: () => {
            console.log('✅ Logged out successfully');
            this.clearAuthData();
          },
          error: (err) => {
            console.error('Logout failed:', err);
            this.clearAuthData(); // Clear anyway
          }
        });
    } else {
      this.clearAuthData();
    }
  }

  private clearAuthData() {
    // 2️⃣ Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');

    // 3️⃣ Redirect to login
    this.router.navigate(['/login']);
  }


}
