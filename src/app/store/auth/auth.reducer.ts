import { createReducer, on } from "@ngrx/store";
import { AuthState, initialAuthState } from "./auth.state";
import * as AuthActions from "./auth.actions";

export const authReducer = createReducer(
    initialAuthState, // Initial state for the auth reducer


    // Rule #1: When someone tries to login
    on(AuthActions.login, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),


    //  Rule #2: When login succeeds  
    on(AuthActions.loginSuccess, (state, { user}) => ({
        ...state,
        user: user,
        isAuthenticated: true,
        isLoading: false,
        error: null
    })),


    //  Rule #3: When login fails
    on(AuthActions.loginFailure, (state, { error }) => ({
        ...state, 
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error
    })),


    //  Rule #4: When someone logs out
    on(AuthActions.logout, (state) => ({
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
    })),


    //  Rule #5: When we want to clear error messages
    on(AuthActions.clearAuthError, (state) => ({
        ...state,
        error: null
    }))

)