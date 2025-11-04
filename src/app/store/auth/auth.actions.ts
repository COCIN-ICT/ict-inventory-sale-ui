import { createAction, props } from "@ngrx/store";

// 🔹 LOGIN
export const login = createAction(
  '[Auth Page] Login',
  props<{ username: string; password: string }>()
);

// 🔹 LOGIN SUCCESS — include token + refresh_token + user
export const loginSuccess = createAction(
  '[Auth API] Login Success',
  props<{ token: string; refreshToken: string; user: any }>()
);

// 🔹 LOGIN FAILURE
export const loginFailure = createAction(
  '[Auth API] Login Failure',
  props<{ error: any }>()
);

// 🔹 REGISTER (if you use registration)
export const register = createAction('[Auth] Register', props<{ userData: any }>());
export const registerSuccess = createAction('[Auth] Register Success', props<{ user: any }>());
export const registerFailure = createAction('[Auth] Register Failure', props<{ error: string }>());

// 🔹 TOKEN / AUTH MANAGEMENT
export const verifyToken = createAction('[Auth] Verify Token');
export const refreshToken = createAction('[Auth] Refresh Token');
export const refreshTokenSuccess = createAction('[Auth] Refresh Token Success', props<{ token: string }>());
export const checkAuthStatus = createAction('[App] Check Auth Status');
export const tokenExpired = createAction('[Auth] Token Expired');

// 🔹 LOGOUT + ERROR HANDLING
export const logout = createAction('[Auth Page] Logout');
export const clearAuthError = createAction('[Auth Page] Clear Auth Error');
