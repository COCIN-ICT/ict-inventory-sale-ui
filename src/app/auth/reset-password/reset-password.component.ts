import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MockAuthService } from '../mock-auth.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
    resetForm: FormGroup;
    isLoading = false;
    errorMessage = '';
    successMessage = '';
    token: string | null = null;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private mockAuthService: MockAuthService
    ) {
        this.resetForm = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });
    }

    ngOnInit(): void {
        this.token = this.route.snapshot.queryParamMap.get('token');

        // In a real app, we might validate the token here
        if (!this.token) {
            this.errorMessage = 'Invalid or missing reset token.';
        }
    }

    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');

        if (password && confirmPassword && password.value !== confirmPassword.value) {
            return { passwordMismatch: true };
        }
        return null;
    }

    onSubmit(): void {
        if (this.resetForm.valid && this.token) {
            this.isLoading = true;
            this.errorMessage = '';
            this.successMessage = '';

            const password = this.resetForm.value.password;

            this.mockAuthService.resetPassword(this.token, password).subscribe({
                next: (res) => {
                    this.isLoading = false;
                    this.successMessage = res.message;
                    // Navigate to success page or login after a delay
                    setTimeout(() => {
                        this.router.navigate(['/login/reset-success']);
                    }, 2000);
                },
                error: (err) => {
                    this.isLoading = false;
                    this.errorMessage = err.error?.message || 'Failed to reset password. Please try again.';
                }
            });
        } else if (!this.token) {
            this.errorMessage = 'Cannot reset password without a valid token.';
        } else {
            this.resetForm.markAllAsTouched();
        }
    }

    get password() { return this.resetForm.get('password'); }
    get confirmPassword() { return this.resetForm.get('confirmPassword'); }
}
