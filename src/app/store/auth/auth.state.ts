export interface User {
    id: number;
    username: string;
    password: string;
    token: string;
}

export  interface AuthState {
    // auth: AuthState
    user: User | null;
    error: any | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export const initialAuthState: AuthState = {

    user: null,
    error: null,
    isAuthenticated: false,
    isLoading: false
};