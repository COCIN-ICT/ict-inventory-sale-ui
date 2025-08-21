import { HttpInterceptorFn } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent,HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';


@Injectable() 
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
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
          this.router.navigate(['/login']);
        }
        //server error
        if (error.status === 500) {
          console.error('Server error:', error);
        }
        //network error
        if ( error.status === 0) {
          console.error('Network error:', error);
          alert('Network error. Please check your connection.');
        }

        return throwError(() => { error.message || 'Server error' });
      })
 );
  }
}
    



// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   return next(req);
// };
