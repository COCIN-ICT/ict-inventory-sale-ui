import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MockAuthService } from '../mock-auth.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
    forgotPasswordForm: FormGroup;
    isLoading = false;
    message = '';
    errorMessage = '';

    constructor(
        private fb: FormBuilder,
        private mockAuthService: MockAuthService,
        private router: Router
    ) {
        this.forgotPasswordForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    ngOnInit(): void { }

    onSubmit(): void {
        if (this.forgotPasswordForm.valid) {
            this.isLoading = true;
            this.message = '';
            this.errorMessage = '';

            const { email } = this.forgotPasswordForm.value;

            this.mockAuthService.forgotPassword(email).subscribe({
                next: (res) => {
                    this.isLoading = false;
                    this.message = res.message;
                    // Navigate to email-sent page after success
                    setTimeout(() => {
                        this.router.navigate(['/login/email-sent'], { queryParams: { email } });
                    }, 2000);
                },
                error: (err) => {
                    this.isLoading = false;
                    this.errorMessage = err.error?.message || 'Something went wrong. Please try again.';
                }
            });
        } else {
            this.forgotPasswordForm.markAllAsTouched();
        }
    }

    get email() {
        return this.forgotPasswordForm.get('email');
    }
}
