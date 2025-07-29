import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../../auth/auth.service";
import * as AuthActions from "./auth.actions";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { of } from "rxjs";
import { Router } from "@angular/router";


interface AuthResponse {
  token: string;
  user?: {
    id: number;
    password: string;
    username: string;
  };
}

@Injectable()
//

   export class AuthEffects {
    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private router: Router
    ) {}
    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.login),
            switchMap(action =>
                this.authService.login(action.username, action.password).pipe(
                    // If login succeeds
                    map((response: any) => {
                        const user = {
                            id: response.user.id,
                            username: response.user.username,
                            password: response.user.password,
                            token: response.token
                        };
                        return AuthActions.loginSuccess({ user });
                    }),
                    // If login fails
                    catchError(error => {
                        console.error('Login failed', error);

                         // Handle different types of errors from Swagger
                        let errorMessage = 'Login failed. Please try again.';
                        if (error.error) {
                             // Swagger usually puts the real error in error.error
                             if (typeof error.error === 'string') {
                                errorMessage = error.error; // Simple string error
                            } else if (error.error.message) {
                                errorMessage = error.error.message; // Object with message property
                            } else if (error.error.details) {
                                errorMessage = error.error.details; // Object with details property
                            }
                        }else if (error.status === 401) {
                            errorMessage = 'Unauthorized. Please check your credentials.';
                        } else if (error.status === 500) {
                            errorMessage = 'Server error. Please try again later.';
                        } else if (error.status === 0) {
                            errorMessage = 'Network error. Please check your connection.';
                        } else if (error.status === 422) {
                            errorMessage = 'Validation error. Please check your input.';
                        } return of(AuthActions.loginFailure({ error: errorMessage }));
                    }) 
                )
            )
        )
    );


    // Rule #2: Verify Token on App startup
    
    // Rule #3: Handle Successful Login(save token, redirect)
    loginSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.loginSuccess),
            tap(({ user }) => {
                // Save the token to localStorage
                localStorage.setItem('token', user.token);

                // Optionally save user details
                  localStorage.setItem('currentUser', JSON.stringify(user));
              

                // Redirect to the home page after successful login
                this.router.navigate(['/home']);

                 // 🎉 Optional: Show success notification
        // this.notificationService.showSuccess(`Welcome back, ${user.name}!`);

        console.log(`User ${user.username} logged in successfully.`);
            })
        ),
        { dispatch: false } // No action is dispatched after this effect
    );
                
    // Rule #4: Handle Logout
    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.logout),
            tap(() => {
                this.authService.logout(); // Call the logout method from AuthService
                // Clear the token from localStorage
                localStorage.removeItem('token');
                // Redirect to the login page after logout
                this.router.navigate(['/login']);

                // Optional: Show logout notification
                // this.notificationService.showInfo('You have been logged out.');
                
                console.log('User logged out successfully.');
            })
        ),
        { dispatch: false } // No action is dispatched after this effect
    );

    // Rule #5: Helper method for logging out
    private cleanupAndNavigate(): void {
        // Remove all auth data from localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('refresh_token'); // if applicable
        // Redirect to the login page
        this.router.navigate(['/login']);
        console.log('User logged out and cleaned up successfully.');
    }

    // Rule #6: Handle Refresh Token (if applicable)
    // This would typically involve checking if the token is expired and refreshing it
    // This is a placeholder for future implementation

    
    // refreshToken$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(AuthActions.refreshToken),
    //         switchMap(() => {
    //             const refreshToken = localStorage.getItem('refresh_token');
    //             if (!refreshToken) {
    //                 console.warn('No refresh token found. Redirecting to login.');
    //                 this.cleanupAndNavigate();
    //                 return of(AuthActions.loginFailure({ error: 'No refresh token available.' }));
    //             }
    //             return this.authService.refreshToken.pipe(
    //                 map((response: any) => {
    //                     const newToken = response.token;
    //                     localStorage.setItem('token', newToken);
    //                     return AuthActions.refreshTokenSuccess({ token: newToken });
    //                 }),
    //                 catchError(error => {
    //                     console.error('Token refresh failed', error);
    //                     this.cleanupAndNavigate();
    //                     return of(AuthActions.logout());
    //                 })
    //             );
    //         })
    //     )
    // );

   // Rule #7: Check if User is Logged In
    isLoggedIn$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.checkAuthStatus),
            switchMap(() => {
                if (this.authService.isLoggedIn()) {
                    const savedUser = localStorage.getItem('currentUser');

                    if(savedUser){
                        try{
                            const user = JSON.parse(savedUser);
                            const token = localStorage.getItem('token');
                            return of(AuthActions.loginSuccess({ user: {...user, token:token || ''} }));
                        } catch (error) {
                           console.error('Error parsing saved user:', error);
                            localStorage.removeItem('current_user');
                            localStorage.removeItem('token');
                            }
                        }
                    }
                return of(AuthActions.loginFailure({ error: 'User is not logged in.' }));
            })
        )
    );
    
    
}