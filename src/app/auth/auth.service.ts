import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Observable, tap, throwError } from 'rxjs';

interface AuthResponse {
  token: string;
  refreshToken: string;
  user?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userKey = 'currentUser';
  private tokenKey = 'token';
  private refreshKey = 'refreshToken';

  constructor(private http: HttpClient, private router: Router) {}

  /** LOGIN */
  login(username: string, password: string) {
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/auth/login`,
      { username, password }
    );
  }

  /** SAVE AUTH DATA */
  saveAuthData(response: AuthResponse): void {
    if (response.token) {
      localStorage.setItem(this.tokenKey, response.token);
    }

    // ⛑ Avoid overwriting refreshToken with empty string
    if (response.refreshToken && response.refreshToken.trim() !== '') {
      localStorage.setItem(this.refreshKey, response.refreshToken);
    }

    if (response.user) {
      localStorage.setItem(this.userKey, JSON.stringify(response.user));
    }
  }

  /** GET TOKEN */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshKey);
  }

  /** REFRESH TOKEN */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<AuthResponse>(
        `${environment.apiUrl}/auth/refresh`,
        { refreshToken }
      )
      .pipe(
        tap(response => {
          this.saveAuthData(response);
        })
      );
  }

  /** GET USER */
  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  getUserUnit() {
    const user = this.getUser();
    return user ? user.unit : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  /** LOGOUT */
  logout() {
    const token = this.getToken();

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      this.http.post(`${environment.apiUrl}/auth/logout`, {}, { headers })
        .subscribe({
          next: () => {
            this.clearAuthData();
          },
          error: () => {
            this.clearAuthData(); // Clear anyway
          }
        });
    } else {
      this.clearAuthData();
    }
  }

  /** CLEAR AUTH DATA */
  private clearAuthData() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshKey);
    localStorage.removeItem(this.userKey);

    this.router.navigate(['/login']);
  }

 getUserRoles(): string | null {
    const user = this.getUser();

    if (!user || !Array.isArray(user.roles) || user.roles.length === 0) {
      return null;
    }
    return user.roles[0].roleName;
  }

  hasRole(allowedRoles: string[]): boolean {
    const user = this.getUser();

    if (!user || !Array.isArray(user.roles)) {
      return false;
    }
    return user.roles.some((role: any) => allowedRoles.includes(role.roleName));
  }

  /** auth.service.ts **/

hasPermission(requiredPermission: string): boolean {
  const user = this.getUser(); // Uses your existing logic to get user from localStorage
  
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    return false;
  }

  // Look through the user's roles and their nested permissions array
  return user.roles.some((role: any) => 
    role.permissions?.some((p: any) => p.permissionType === requiredPermission)
  );
}
}

