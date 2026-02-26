import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MockAuthService } from '../mock-auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    isLoading = false;
    errorMessage = '';
    successMessage = '';

    // Mock data for selects
    departments = ['Management', 'Logistics', 'Finance', 'IT', 'Sales'];
    units = ['HQ', 'Store A', 'Store B', 'Warehouse'];
    roles = ['USER', 'STORE_KEEPER', 'ADMIN', 'SUPER_ADMIN'];

    constructor(
        private fb: FormBuilder,
        private mockAuthService: MockAuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            username: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            department: ['', [Validators.required]],
            unit: ['', [Validators.required]],
            role: ['', [Validators.required]]
        });
    }

    ngOnInit(): void { }

    onSubmit(): void {
        if (this.registerForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';
            this.successMessage = '';

            const userData = this.registerForm.value;

            this.mockAuthService.register(userData).subscribe({
                next: (res) => {
                    this.isLoading = false;
                    this.successMessage = res.message;
                    // Navigate to login after success
                    setTimeout(() => {
                        this.router.navigate(['/login']);
                    }, 2000);
                },
                error: (err) => {
                    this.isLoading = false;
                    this.errorMessage = err.error?.message || 'Something went wrong. Please try again.';
                }
            });
        } else {
            this.registerForm.markAllAsTouched();
        }
    }

    onCancel(): void {
        this.router.navigate(['/login']);
    }

    // Getters for validation classes
    get f() { return this.registerForm.controls; }
}
