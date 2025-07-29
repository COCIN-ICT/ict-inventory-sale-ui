import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import axios from 'axios';
import { environment } from '../../../environments/environment';

import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth/auth.actions';
import { AppState } from '../../store/app.state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // fixed typo: `styleUrl` → `styleUrls`
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store<AppState> // Use AppState to type the store
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.store.select(state => state.auth.isLoading).subscribe(isLoading => this.isLoading = isLoading);
    this.store.select(state => state.auth.error).subscribe(error => this.errorMessage = error || '');
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  // onSubmit() {
  //   if (this.loginForm.valid) {
  //     this.isLoading = true;
  //     this.errorMessage = '';
      
      // Simulate API call.....
      // setTimeout(async () => {
      //   const { username, password } = this.loginForm.value;
      //   const response = await axios.post(`${environment.apiUrl}/auth/login`, { username, password });

        // Mock authentication logic.....
        // if (response && response.status === 200) {
          // Successful login.....
        //   localStorage.setItem('token', response?.data.token);
        //   alert('Login successful!');
        //   this.router.navigate(['/home']);
        // } else {
          // Failed login.....
  //         this.errorMessage = 'Invalid username or password';
  //       }
  //       console.log('test', username, password);

  //       this.isLoading = false;
  //     }, 1000);
  //   } else {
  //     this.markFormGroupTouched();
  //   }
  // }



  onSubmit() {
    if ( this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const { username, password } = this.loginForm.value;
      this.store.dispatch(AuthActions.login({ username, password }));
    } else {
      this.markFormGroupTouched();
    }
  }
  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }
}
