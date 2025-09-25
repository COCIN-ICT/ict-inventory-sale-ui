import { HttpInterceptorFn } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent,HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from './services/toast.service';


@Injectable() 
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastService: ToastService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token) {
      // Don't set Content-Type for FormData requests - let browser set it with boundary
      const headers: any = {
        Authorization: `Bearer ${token}`
      };
      
      // Only set Content-Type for non-FormData requests
      if (!(req.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }
      
      req = req.clone({
        setHeaders: headers
      });
    }
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        //token expired or unauthorized
        if (error.status === 401 || error.status === 403) {
          localStorage.removeItem('token');
          this.toastService.error('Session expired. Please login again.');
          this.router.navigate(['/login']);
        }
        //server error
        else if (error.status === 500) {
          console.error('Server error:', error);
          this.toastService.error('Server error. Please try again later.');
        }
        //network error - connection issues
        else if (error.status === 0) {
          console.error('Network error:', error);
          this.toastService.error('Connection error. Please check your internet connection and try again.');
        }
        //other HTTP errors
        else if (error.status >= 400) {
          console.error('HTTP error:', error);
          this.toastService.error(`Request failed: ${error.status} ${error.statusText}`);
        }

        // Return the error for components to handle if needed
        return throwError(() => error);
      })
 );
  }
}
    



// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   return next(req);
// };
