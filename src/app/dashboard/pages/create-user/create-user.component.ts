import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent {
  constructor(private userService: UserService, private fb: FormBuilder) {}
  newUser = {
    firstName: '',
    lastName: '',  
    middleName: '',
    username: '',
    password: '',
    address: '',
    phone: '',
    email: '',
    roleId: ''
  };

  userForm!: FormGroup;
  roles: any[] = [];
  ngOnInit(): void {
    this.initform();
    this.loadRoles();
  }

  initform() {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: [''],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: [''],
      phone: [''],
      email: ['', [Validators.required, Validators.email]],
      roleId: [1, Validators.required]
    });
  }

  loadRoles() {
    this.userService.getRoles()
    .subscribe({
      next: (res:any) => {
        console.log('API response:', res);
        //different response structures
        this.roles = res.data || res.roles || res.result || res || [];
        console.log('Final roles:', this.roles);
      }
    })
  }

  createUser() {
     console.log('Create user clicked');
    if (this.userForm.valid) {
      const newUser = this.userForm.value;
      this.userService.createUser(newUser).subscribe({
        next: (res:any) => {
          alert('User created successfully!');
          console.log('User created:', res);
          this.userForm.reset();
        },
        error: (error) => {
          console.error('Error creating user:', error);
          alert('Failed to create user. Please try again.');
        }
      })
    }
  }


}
