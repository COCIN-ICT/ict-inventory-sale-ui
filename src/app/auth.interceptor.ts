import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError, BehaviorSubject, Observable, filter, take } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from './services/toast.service';
import { AuthLoginService } from './services/auth-login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(
    private router: Router,
    private toastService: ToastService,
    private authLoginService: AuthLoginService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    let headers: any = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      if (!(req.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }
    }

    const clonedReq = req.clone({ setHeaders: headers });

    return next.handle(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(clonedReq, next);
        } else if (error.status === 500) {
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

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        this.logoutAndRedirect();
        return throwError(() => new Error('No refresh token available.'));
      }

      return this.authLoginService.refreshToken(refreshToken).pipe(
        switchMap((response: any) => {
          this.isRefreshing = false;

          const newToken = response.token;
          const newRefresh = response.refreshToken;

          localStorage.setItem('token', newToken);
          if (newRefresh) {
            localStorage.setItem('refreshToken', newRefresh);
          }

          // Broadcast new token to waiting requests BEFORE retrying
          this.refreshTokenSubject.next(newToken);

          // Retry the original request
          return next.handle(
            req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` }
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
    } else {
      // Wait for refresh to complete, then retry with new token
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null), // Wait until we get a real token
        take(1), // Take only the first non-null value
        switchMap((token) => {
          return next.handle(
            req.clone({
              setHeaders: { Authorization: `Bearer ${token}` }
            })
          );
        })
      );
    }
  }

  private logoutAndRedirect() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.toastService.error('Session expired. Please login again.');
    this.router.navigate(['/login']);
  }
}