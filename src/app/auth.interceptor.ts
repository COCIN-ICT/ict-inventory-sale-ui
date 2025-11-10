import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError, BehaviorSubject, Observable, filter, take } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from './services/toast.service';
import { AuthLoginService } from './services/auth-login.service';
import { AuthService } from './auth/auth.service';

interface AuthResponse {
  token: string;     // 👈 match your backend field names
  refreshToken: string;    // 👈 add this
  user?: any;               // optional user info
}
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    const clonedReq = token
      ? req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        })
      : req;

    return next.handle(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !req.url.includes('/auth/refresh')) {
          console.warn(' Token expired — attempting refresh...');
          return this.handle401Error(req, next);
        }

        if (error.status === 500) {
          this.toastService.error('Server error. Please try again later.');
        } else if (error.status === 0) {
          this.toastService.error('Connection error. Please check your internet connection.');
        } else if (error.status >= 400) {
          this.toastService.error(`Request failed: ${error.status} ${error.statusText}`);
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.authService.getRefreshToken();
      if (!refreshToken) {
        this.logoutAndRedirect();
        return throwError(() => new Error('No refresh token available.'));
      }

      return this.authService.refreshToken().pipe(
        switchMap((response: AuthResponse) => {
          this.isRefreshing = false;

          // // ✅ Adjust key names to match backend response
          // const newToken = response.token || response.accessToken;
          // const newRefresh = response.refreshToken;

          // if (!newToken) {
          //   console.error('❌ No access token returned from refresh endpoint.');
          //   this.logoutAndRedirect();
          //   return throwError(() => new Error('No token returned.'));
          // }

          // // ✅ Save both tokens
          // localStorage.setItem('token', newToken);
          // if (newRefresh) {
          //   localStorage.setItem('refreshToken', newRefresh);
          // }

          // ✅ Notify waiting requests
          this.refreshTokenSubject.next(response.token);

          // ✅ Retry the original failed request with new token
          return next.handle(
            req.clone({
              setHeaders: { Authorization: `Bearer ${response.token}` },
            })
          );
        }),
        catchError((err) => {
          console.error('❌ Refresh token failed:', err);
          this.isRefreshing = false;
          this.refreshTokenSubject.next(null);
          this.logoutAndRedirect();
          return throwError(() => err);
        })
      );
    } else {
      // Wait for refresh to complete
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => {
          return next.handle(
            req.clone({
              setHeaders: { Authorization: `Bearer ${token}` },
            })
          );
        })
      );
    }
  }

  private logoutAndRedirect() {
    this.authService.logout();
    
    this.toastService.error('Session expired. Please login again.');
    this.router.navigate(['/login']);
  }
}
