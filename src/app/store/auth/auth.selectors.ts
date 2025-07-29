 import  { createSelector, createFeatureSelector} from "@ngrx/store";
import  { AuthState} from "./auth.state";

export const selectAuthState = createFeatureSelector<AuthState>('auth');



//who is logged in?
 export const selectCurrentUser = createSelector(
   selectAuthState,
   (state: AuthState) => state.user
 );

 //Are we logged in?
 export const selectCurrentUserSuccess = createSelector(
   selectAuthState,
   (state: AuthState) => state.isAuthenticated
 );

 // Is something loading
 export const selectIsLoading = createSelector(
   selectAuthState,
   (state: AuthState) => state.isLoading
 );

 // Any error messages?
 export const selectIsLoadingError = createSelector(
   selectAuthState,
   (state: AuthState) => state.error
 );

 // What's the user's name?
 export const selectUserName = createSelector(
   selectAuthState,
   (state: AuthState) => state.user?.username || null
  //  (user) => user?.name || null
 );

 // Identify the current user
 export const selectCurrentUserId = createSelector(
   selectAuthState,
 (state: AuthState)=> state.user?.id || null
 );



 // // Should we show the login form?
 // export const selectShouldShouldShowLoginForm = createSelector(
 //   selectIsLoading,
 //   selectIsAuthenticated,
 //   (isLoading, isAuthenticated) => !isLoading && !isAuthenticated
 // );



