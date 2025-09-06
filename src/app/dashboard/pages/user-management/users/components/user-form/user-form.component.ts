import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../../../../../services/user.service';
import { User } from '../../users.model';
import { ToastService } from '../../../../../../services/toast.service';
import { RolesService } from '../../../../../../services/roles.service';
import { UnitService } from '../../../../../../services/unit.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {

  userForm!: FormGroup;
  roles: any[] = []; 
  units: any[] = [];
  
  isEditMode: boolean = false;
  private userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User | null,
    // Inject the ToasifyService here
    private toasifyService: ToastService,
    private rolesService: RolesService, private unitService: UnitService 
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadRoles();
    this.loadUnits();
    
    if (this.data) {
      this.isEditMode = true;
      this.userId = this.data.id!; 
      this.userForm.patchValue(this.data);
    }
  }

  private initializeForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: [''],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      unitId: [null, Validators.required],
      roleId: [null, Validators.required]
    });

    if (this.isEditMode) {
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  private loadRoles(): void {
    this.rolesService.getRoles().subscribe({
      next: (response: any) => {
        console.log('Roles fetched successfully!', response);
        this.roles = response.data || response.roles || response.result || response || [];
        console.log('Final roles:', this.roles);
      },
      error: (error) => {
        console.error('Error fetching roles:', error);
      }
    });
  }

  private loadUnits(): void {
    this.unitService.getUnits().subscribe({
      next: (response: any) => {
        console.log('Units fetched successfully!', response);
        this.units = response.data || response.units || response.result || response || [];
        console.log('Final units:', this.units);
      },
      error: (error) => {
        console.error('Error fetching units:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userToSubmit: User = this.userForm.value as User;
      
      if (this.isEditMode) {
        userToSubmit.id = this.userId!; 
        
        this.userService.updateUser(userToSubmit.id!, userToSubmit).subscribe({
          next: (response) => {
            console.log('User updated successfully!', response);
            // Call the Toasify service on success
            this.toasifyService.success('User has been successfully updated!');
            this.dialogRef.close('userUpdated');
          },
          error: (error) => {
            console.error('Error updating user:', error);
            // Call the Toasify service on error
            this.toasifyService.error('Failed to update user. Please try again.');
          }
        });
      } else {
        this.userService.createUser(userToSubmit).subscribe({
          next: (response) => {
            console.log('User created successfully!', response);
            // Call the Toasify service on success
            this.toasifyService.success('User has been successfully created!');
            this.dialogRef.close('userCreated');
          },
          error: (error) => {
            console.error('Error creating user:', error);
            // Call the Toasify service on error
            this.toasifyService.error('Failed to create user. Please try again.');
          }
        });
      }
    } else {
      this.userForm.markAllAsTouched();
      // Use Toasify to show a general form error
      this.toasifyService.error('Please correct the form errors.');
      console.log('Form is invalid. Cannot submit.');
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }



}
