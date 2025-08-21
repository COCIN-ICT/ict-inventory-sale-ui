import { Component } from '@angular/core';
//import { UserService } from '../../../services/user.service';
import { UserService } from '../../../../services/user.service';
import { RolesService } from '../../../../services/roles.service';
import { DepartmentsService } from '../../../../services/departments.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent {
  
  constructor(private userService: UserService, private fb: FormBuilder, 
              private departmentsService: DepartmentsService, private rolesServices: RolesService,
              private toast: ToastService, private router: Router) {}

  userForm!: FormGroup;
  roles: any[] = [];
  departments: any[] = [];
  
  
  ngOnInit(): void {
    this.initform();
    this.loadRoles();
    this.loadDepartments();
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
      departmentId: [1, Validators.required],
      roleId: [1, Validators.required]
    });
  };

  loadRoles() {
    this.rolesServices.getRoles()
    .subscribe({
      next: (res:any) => {
        console.log('API response:', res);
        //different response structures
        this.roles = res.data || res.roles || res.result || res || [];
        console.log('Final roles:', this.roles);
      }
    })
  };

  loadDepartments() {
    this.departmentsService.getDepartments()
    .subscribe({
      next: (res:any) => {
        console.log('API response:', res);
        //different response structures
        this.departments = res.data || res.departments || res.result || res || [];
        console.log('Final departments:', this.departments);
      }
    })
  };



  createUser() {
     console.log('Create user clicked');
    if (this.userForm.valid) {
      const newUser = this.userForm.value;
      console.log('New user data:', newUser);
      this.userService.createUser(newUser).subscribe({
        next: (res:any) => {
          this.toast.success('User created successfully!');
          console.log('User created:', res);
          this.userForm.reset();
          
          setTimeout(() => {
            this.router.navigate(['/home/users']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.toast.error('Failed to create user. Please try again.');
        }
      })
    }
  }


}
