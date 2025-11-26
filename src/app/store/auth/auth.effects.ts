import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import * as AuthActions from "./auth.actions";
import { AuthService } from "../../auth/auth.service";

interface AuthResponse {
  token: string;
  refreshToken: string;
  user?: {
    id: number;
    username: string;
    password?: string;
    unit?: string;
  };
}

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  // 🔹 LOGIN EFFECT
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(action =>
        this.authService.login(action.username, action.password).pipe(
          map((response: AuthResponse) => {
            // Save auth data (optional)
            this.authService.saveAuthData(response);

            // Dispatch success with all tokens + user
            return AuthActions.loginSuccess({
              token: response.token,
              refreshToken: response.refreshToken,
              user: response.user || {}
            });
          }),
          catchError(error => {
            console.error('Login failed', error);
            console.error('Error status:', error.status);
            console.error('Error body:', error.error);
            console.error('Error URL:', error.url);

            let errorMessage = 'Login failed. Please try again.';
            if (error.error) {
              if (typeof error.error === 'string') errorMessage = error.error;
              else if (error.error.message) errorMessage = error.error.message;
              else if (error.error.details) errorMessage = error.error.details;
              else if (Object.keys(error.error).length === 0 && error.status === 404) {
                // Backend is receiving request but returning 404 - likely authentication failure
                errorMessage = 'Invalid username or password. Please check your credentials.';
              }
            } else if (error.status === 401) {
              errorMessage = 'Unauthorized. Please check your credentials.';
            } else if (error.status === 404) {
              // Check if backend is reachable - if we got here, proxy is working but endpoint/auth failed
              errorMessage = 'Invalid username or password. Please check your credentials.';
            } else if (error.status === 500) {
              errorMessage = 'Server error. Please try again later.';
            } else if (error.status === 0) {
              errorMessage = 'Network error. Please check your connection and ensure the backend server is running.';
            } else if (error.status === 422) {
              errorMessage = 'Validation error. Please check your input.';
            }

            return of(AuthActions.loginFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // 🔹 LOGIN SUCCESS EFFECT
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ token, refreshToken, user }) => {
          // ✅ Store everything correctly
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', refreshToken);
        //   localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('currentUser', JSON.stringify(user));

          // Redirect
          this.router.navigate(['/home']);
          console.log(`✅ Login successful for ${user?.username}`);
        })
      ),
    { dispatch: false }
  );

  // 🔹 LOGOUT EFFECT
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.logout();
          this.cleanupAndNavigate();
          console.log('🚪 User logged out successfully.');
        })
      ),
    { dispatch: false }
  );

  // 🔹 CHECK AUTH STATUS EFFECT (App startup)
  isLoggedIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkAuthStatus),
      switchMap(() => {
        if (this.authService.isLoggedIn()) {
          const savedUser = localStorage.getItem('currentUser');
          if (savedUser) {
            try {
              const parsed = JSON.parse(savedUser);
              const token = localStorage.getItem('token');
              const refresh = localStorage.getItem('refreshToken');
              const user = { ...parsed };
              return of(AuthActions.loginSuccess({ token: token || '', refreshToken: refresh || '', user }));
            } catch (error) {
              console.error('Error parsing saved user:', error);
              localStorage.clear();
            }
          }
        }
        return of(AuthActions.loginFailure({ error: 'User is not logged in.' }));
      })
    )
  );

  // 🔹 CLEANUP HELPER
  private cleanupAndNavigate(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
