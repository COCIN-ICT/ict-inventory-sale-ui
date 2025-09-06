import { Component, OnInit } from '@angular/core';
import { Role, Unit, User, UserDisplay } from '../../users.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs'; // Import forkJoin for parallel API calls
import { map } from 'rxjs/operators'; // Import map

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit {

  user: UserDisplay | undefined;
  units: Unit[] = [];
  roles: Role[] = [];
  isLoading = true;
  error: string | null = null;
  userForm: FormGroup;
  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: [''],
      username: ['', Validators.required],
      // This is a view component, password validation is not needed here
      password: [''], 
      address: ['', Validators.required],
      phone: ['', Validators.required], 
      email: ['', [Validators.required, Validators.email]],
      unit: [null, Validators.required], // Change to 'unit'
      roles: [[], Validators.required] // Change to 'roles'
    });
  }

  ngOnInit(): void {
    // We need to fetch roles and units for the dropdowns in the form
    forkJoin({
      roles: this.userService.getRoles(),
      units: this.userService.getUnits()
    }).subscribe({
      next: ({ roles, units }) => {
        this.roles = roles;
        this.units = units;
        
        // After fetching roles and units, get the user details
        this.route.paramMap.subscribe(params => {
          const userId = Number(params.get('id'));
          if (userId) {
            this.fetchUserDetails(userId);
          } else {
            this.error = 'User ID not found in URL.';
            this.isLoading = false;
            this.router.navigate(['/home/user-management/users']);
          }
        });
      },
      error: (err) => {
        this.error = 'Failed to load user data. Please try again.';
        this.isLoading = false;
        console.error('Error fetching roles and units:', err);
      }
    });
  }

  fetchUserDetails(id: number): void {
    this.isLoading = true;
    this.error = null;
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        // Correctly format roles and unit names from the API response
        const resolvedRoleNames = user.roles.map(r => r.roleName).join(', ');
        const resolvedUnitName = user.unit ? user.unit.name : 'N/A';
        
        this.user = {
          ...user,
          resolvedRoleNames,
          resolvedUnitName
        };
        
        // Patch the form with the API data
       // this.userForm.patchValue({
         // ...this.user,
          //unit: this.user.unit.id, // Set the unit control to the unit's ID
          //roles: this.user.roles.map(r => r.id) // Set the roles control to an array of IDs
        //});
         this.userForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        middleName: this.user.middleName,
        username: this.user.username,
        email: this.user.email,
        phone: this.user.phone,
        address: this.user.address,
        // When patching the form, we use the IDs, not the resolved names
        // Make sure your form controls are updated to reflect the new API structure
        // This is a common point of confusion.
        unitId: this.user.unit.id,
        roles: this.user.roles.map(r => r.id)
      });

        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load user details. Please try again.';
        this.isLoading = false;
        console.error('Error fetching user:', err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/home/user-management/users']);
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  saveChanges(): void {
    if (this.userForm.valid && this.user) {
      const formValue = this.userForm.value;

      const selectedUnit = this.units.find(u => u.id === formValue.unit);
      const selectedRoles = this.roles.filter(r => formValue.roles.includes(r.id));
      
     const updatedUser = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        middleName: formValue.middleName,
        username: formValue.username,
        password: formValue.password,
        address: formValue.address,
        phone: formValue.phone,
        email: formValue.email,
        unitId: formValue.unit, // Use the unit ID
        roleId: formValue.roles[0] // Use the first role ID from the array
      };

      this.userService.updateUser(this.user.id!, updatedUser).subscribe({
        next: () => {
          this.toggleEditMode();
          this.fetchUserDetails(this.user!.id!);
        },
        error: (err) => {
          this.error = 'Failed to update user. Please try again.';
          console.error('Error updating user:', err);
        }
      });
    }
  }

  cancelEdit(): void {
    this.userForm.patchValue({
      ...this.user!,
      unit: this.user!.unit.id,
      roles: this.user!.roles.map(r => r.id)
    });
    this.toggleEditMode();
  }
}