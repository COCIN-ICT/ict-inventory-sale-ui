import { createAction, props } from "@ngrx/store";

export const login = createAction(
    '[Auth Page] Login',
    props<{ username: string; password: string }>()
);

export const loginSuccess = createAction(
    '[Auth API] Login Success',
    props<{ user: { id: number; username: string; password:string; token: string} }>()
);

export const loginFailure = createAction(
    '[Auth API] Login Failure',
    props<{ error: any }>()
);

export const register = createAction('[Auth] Register', props<{userData: any}>());
export const registerSuccess = createAction('[Auth] Register Success', props<{user: any}>());
export const registerFailure = createAction('[Auth] Register Failure', props<{error: string}>());
export const verifyToken = createAction('[Auth] Verify Token');
export const refreshToken = createAction('[Auth] Refresh Token');
export const refreshTokenSuccess = createAction('[Auth] Refresh Token Success', props<{token: string}>());
export const checkAuthStatus = createAction('[App] Check Auth Status');
export const tokenExpired = createAction('[Auth] Token Expired');

export const logout = createAction( '[Auth Page] Logout' );

export const clearAuthError = createAction( '[Auth Page] Clear Auth Error' );