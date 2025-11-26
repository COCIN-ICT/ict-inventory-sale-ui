import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from './services/toast.service';
import { AuthService } from './auth/auth.service';

interface AuthResponse {
  token: string;
  refreshToken: string;
  user?: any;
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    // ❌ Do NOT attach access token to refresh endpoint
    if (req.url.includes('/auth/refresh')) {
      return next.handle(req);
    }

    const authReq = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(req, next);
        }

        if (error.status === 500) {
          this.toastService.error('Server error. Please try again later.');
        } else if (error.status === 0) {
          this.toastService.error('Internet error. Check your connection.');
        }

        return throwError(() => error);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    const refreshToken = this.authService.getRefreshToken();

    if (!refreshToken) {
      this.logoutAndRedirect();
      return throwError(() => new Error('No refresh token found'));
    }

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((res: AuthResponse) => {
          this.isRefreshing = false;

          /** 
           * ✅ SAFELY SAVE NEW TOKENS  
           * Prevent overwriting refreshToken with an empty string 
           */
          if (res.token) {
            localStorage.setItem('token', res.token);
          }

          if (res.refreshToken && res.refreshToken.trim() !== '') {
            localStorage.setItem('refreshToken', res.refreshToken);
          }

          this.refreshTokenSubject.next(res.token);

          return next.handle(
            req.clone({
              setHeaders: { Authorization: `Bearer ${res.token}` },
            })
          );
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(null);
          this.logoutAndRedirect();
          return throwError(() => err);
        })
      );
    }

    // Queue requests while token is refreshing
    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) =>
        next.handle(
          req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          })
        )
      )
    );
  }

  private logoutAndRedirect() {
    this.toastService.error('Session expired. Please login again.');
    this.authService.logout();
  }
}
