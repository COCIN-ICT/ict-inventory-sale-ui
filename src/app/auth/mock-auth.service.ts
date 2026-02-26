import { Injectable } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { MOCK_USERS, RESET_TOKENS, MockUser } from './mock-auth.data';

/** Shape returned by the mock login endpoint */
export interface MockLoginResponse {
    token: string;
    refreshToken: string;
    user: Omit<MockUser, 'password'>;
}

/** Shape returned by forgot-password / reset-password endpoints */
export interface MockMessageResponse {
    success: boolean;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class MockAuthService {

    /** Simulated network latency (ms) */
    private readonly LATENCY = 800;

    // ─── LOGIN ────────────────────────────────────────────────────────
    /**
     * Authenticate with username/email + password.
     * Matches against MOCK_USERS list.
     */
    login(usernameOrEmail: string, password: string): Observable<MockLoginResponse> {
        const user = MOCK_USERS.find(
            u =>
                (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
                u.password === password
        );

        if (user) {
            const { password: _pw, ...safeUser } = user;
            const response: MockLoginResponse = {
                token: this.generateToken(),
                refreshToken: this.generateToken(),
                user: safeUser
            };
            return of(response).pipe(delay(this.LATENCY));
        }

        return throwError(() => ({
            status: 401,
            error: { message: 'Invalid username or password. Please try again.' }
        })).pipe(delay(this.LATENCY));
    }

    // ─── REGISTER / CREATE USER ─────────────────────────────────────
    /**
     * Creates a new user in the mock database.
     */
    register(userData: any): Observable<MockMessageResponse> {
        // Check if user already exists
        const exists = MOCK_USERS.some(u => u.email === userData.email || u.username === userData.username);

        if (exists) {
            return throwError(() => ({
                status: 400,
                error: { message: 'User with this email or username already exists.' }
            })).pipe(delay(this.LATENCY));
        }

        const { role, ...otherData } = userData;

        // Create new user with a mock ID and selected role
        const newUserData: any = {
            ...otherData,
            id: MOCK_USERS.length + 1,
            roles: [
                {
                    roleName: role || 'USER',
                    permissions: [{ permissionType: role === 'ADMIN' ? 'FULL_ACCESS' : 'READ_ONLY' }]
                }
            ]
        };

        MOCK_USERS.push(newUserData as MockUser);

        return of({
            success: true,
            message: 'User account created successfully!'
        }).pipe(delay(this.LATENCY));
    }

    // ─── FORGOT PASSWORD ─────────────────────────────────────────────
    /**
     * Sends a mock "password reset email".
     * Stores a reset token mapped to the user's email.
     */
    forgotPassword(email: string): Observable<MockMessageResponse> {
        const user = MOCK_USERS.find(u => u.email === email);

        if (!user) {
            return throwError(() => ({
                status: 404,
                error: { message: 'No account found with that email address.' }
            })).pipe(delay(this.LATENCY));
        }

        // Generate & store reset token
        const resetToken = this.generateResetToken();
        RESET_TOKENS.set(resetToken, email);

        // Log the "email" to the console so the developer can grab the token
        console.log('──────────────────────────────────────────');
        console.log('📧 Mock Password Reset Email');
        console.log(`   To: ${email}`);
        console.log(`   Reset Token: ${resetToken}`);
        console.log(`   Reset Link: /login/reset-password?token=${resetToken}`);
        console.log('──────────────────────────────────────────');

        return of({
            success: true,
            message: 'Password reset link has been sent. Please check your inbox.'
        }).pipe(delay(this.LATENCY));
    }

    // ─── VALIDATE RESET TOKEN ────────────────────────────────────────
    /**
     * Checks if a reset token is valid (exists in the map).
     */
    validateResetToken(token: string): Observable<MockMessageResponse> {
        if (RESET_TOKENS.has(token)) {
            return of({ success: true, message: 'Token is valid.' }).pipe(delay(300));
        }
        return throwError(() => ({
            status: 400,
            error: { message: 'Invalid or expired reset token.' }
        })).pipe(delay(300));
    }

    // ─── RESET PASSWORD ──────────────────────────────────────────────
    /**
     * Resets the user's password using the token.
     * Removes the token after use.
     */
    resetPassword(token: string, newPassword: string): Observable<MockMessageResponse> {
        const email = RESET_TOKENS.get(token);

        if (!email) {
            return throwError(() => ({
                status: 400,
                error: { message: 'Invalid or expired reset token.' }
            })).pipe(delay(this.LATENCY));
        }

        const user = MOCK_USERS.find(u => u.email === email);
        if (user) {
            // Mutate the mock data so subsequent logins use the new password
            (user as any).password = newPassword;
        }

        // Consume the token (one-time use)
        RESET_TOKENS.delete(token);

        return of({
            success: true,
            message: 'Your password has been reset successfully!'
        }).pipe(delay(this.LATENCY));
    }

    // ─── HELPERS ──────────────────────────────────────────────────────
    /** Returns the latest reset token for a given email (for the simulated email-link click) */
    getLatestResetToken(email: string): string | null {
        for (const [token, e] of RESET_TOKENS.entries()) {
            if (e === email) return token;
        }
        return null;
    }

    private generateToken(): string {
        return 'mock-jwt-' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    private generateResetToken(): string {
        return 'rst-' + Math.random().toString(36).substring(2, 10) + '-' + Date.now().toString(36);
    }
}
