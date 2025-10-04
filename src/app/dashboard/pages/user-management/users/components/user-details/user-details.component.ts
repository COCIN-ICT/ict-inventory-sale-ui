// user-details.component.ts
import { Component, OnInit } from '@angular/core';
import { Role, Unit, User, UserDisplay } from '../../users.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ToastService } from '../../../../../../services/toast.service';

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
    private fb: FormBuilder,
    private toast: ToastService 
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: [''],
      username: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required], 
      email: ['', [Validators.required, Validators.email]],
      unit: [null, Validators.required],
      roles: [[]], // ✅ just an array of role IDs
      newPassword: ['']
    });
 }

  passswordForm = this.fb.group({
    newPassword: ['', Validators.required]
  });

  ngOnInit(): void {
    forkJoin({
      roles: this.userService.getRoles(),
      units: this.userService.getUnits()
    }).subscribe({
      next: ({ roles, units }) => {
        this.roles = roles;
        this.units = units;
        
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
        const resolvedRoleNames = user.roles.map(r => r.roleName).join(', ');
        const resolvedUnitName = user.unit ? user.unit.name : 'N/A';
        
        this.user = {
          ...user,
          resolvedRoleNames,
          resolvedUnitName
        };
        
        // ✅ patch roles as array of IDs
        this.userForm.patchValue({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          middleName: this.user.middleName,
          username: this.user.username,
          email: this.user.email,
          phone: this.user.phone,
          address: this.user.address,
          unit: this.user.unit.id,
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

  updatePassword(user: any, newPassword: string): void {
    if (!newPassword) {
      this.error = "Password cannot be empty";
      return;
    }

    const updatedUser = {
      firstName: this.user!.firstName,
      lastName: this.user!.lastName,
      middleName: this.user!.middleName,
      username: this.user!.username,
      password: newPassword,
      address: this.user!.address,
      phone: this.user!.phone,
      email: this.user!.email,
      unitId: this.user!.unit?.id,
      roleIds: this.user!.roles?.map(r => r.id) ?? []
    };

    this.userService.updateUser(this.user!.id!, updatedUser).subscribe({
      next: () => {
        this.toast.success("Password updated successfully");
        this.passswordForm.reset();
      },
      error: (err) => {
        this.error = "Failed to update password. Please try again.";
        console.error("Error updating password:", err);
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

      const updatedUser = {
        id: this.user.id,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        middleName: formValue.middleName,
        username: formValue.username,
        password: this.user.password ?? "default123",
        address: formValue.address,
        phone: formValue.phone,
        email: formValue.email,
        unitId: formValue.unit,
        roleIds: formValue.roles // ✅ directly send selected IDs
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
