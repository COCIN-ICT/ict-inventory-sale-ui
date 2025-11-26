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
}
