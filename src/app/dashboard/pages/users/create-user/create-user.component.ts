import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { User, UserService } from '../../../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent {
  userForm: FormGroup;
  isSubmitted = false;
  errorMessage = '';
  successMessage = '';

  constructor( private userService: UserService,
               private router: Router,
               private fb: FormBuilder ) {
                this.userForm = this.createForm()
               }
  
  createForm(): FormGroup{
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      middleName: [''],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: [''],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      email: ['', [Validators.required, Validators.email]],
      roleId: [1, Validators.required] // Default to roleId 1
    });
  }

  public goToUsers() {
  this.router.navigate(['/users']);
}

  onSubmit() {
    console.log('onSubmit called!'); // Add this first line
    if (this.userForm.valid) {
      console.log('Form data being sent:', this.userForm.value); // Add this line
      this.isSubmitted = true;
      this.errorMessage = '';
      this.successMessage = '';

      const userData: User = this.userForm.value;
      console.log('User data object:', userData); // Add this line

      this.userService.createUser(userData)
      .subscribe({
        next: (res: any) => {
          console.log('User created successfully:', res);
          this.successMessage = 'User created successfully!';
          // this.router.navigate(['/dashboard/users']);
          this.isSubmitted = false; // Reset form submission state
          this.userForm.reset(); // Reset the form after successful submission

          setTimeout(() => {
            this.router.navigate(['/dashboard/users']);
          }, 1000); // Navigate after 1 second
        }, 
        error: (error) => {
          console.log('Full error object:', error); // Add this line
          console.error('Error creating user:', error);
          this.errorMessage = error.error?.message || 'Failed to create user. Please try again.';
          this.isSubmitted = false; // Reset form submission state
        }
      });
    } else {
      console.log('Form is invalid:', this.userForm.errors); // Add this line
      this.markFormGroupTouched();
    }
  }
  // Helper method to mark all fields as touched (shows validation errors)
  markFormGroupTouched() {
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.get(key)?.markAsTouched();
    });
  }

  // Helper methods for template validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['pattern']) return 'Please enter a valid phone number';
    }
    return '';
  }
}


  

  // createUser() {
  //   this.http.post(`${APPURL}/users`, this.form)
  //   .subscribe({
  //     next: (response: any) => {
  //       console.log('User created successfully:', response);
  //       alert('User created successfully!');
  //       this.router.navigate(['/dashboard']);
  //     },
  //     error: (error) => {
  //       console.error('Error creating user:', error);
  //       alert('Failed to create user. Please try again.');
  //     }
  //   }

  //   )
  // }
//   createUser() {
//     this.userService.createUser(this.form).subscribe({
//       next: (response: any) => {
//         console.log('User created successfully:', response);
//         alert('User created successfully!');
//         this.router.navigate(['/dashboard']);
//       },
//       error: (error) => {
//         console.error('Error creating user:', error);
//         alert('Failed to create user. Please try again.');
//       }
//     });
//   }



  
// }
