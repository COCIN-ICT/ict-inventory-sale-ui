import { Component, OnInit } from '@angular/core';
import { Role, Unit, UserDisplay } from '../../users.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ToastService } from '../../../../../../services/toast.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  user?: UserDisplay;
  units: Unit[] = [];
  availableRoles: Role[] = [];

  userForm: FormGroup;
  isLoading = true;
  error: string | null = null;
  isEditMode = false;
  editRoleMode = false;
  loadingRoles = false;

  selectedRoleIds: number[] = [];

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
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      unit: [null, Validators.required],
      roles: [[]],
      newPassword: ['']
    });
  }

  ngOnInit(): void {
    forkJoin({
      roles: this.userService.getRoles(),
      units: this.userService.getUnits()
    }).subscribe({
      next: ({ roles, units }) => {
        this.availableRoles = roles;
        this.units = units;
        this.loadUser();
      },
      error: () => {
        this.error = 'Failed to load roles or units.';
        this.isLoading = false;
      }
    });
  }

  private loadUser(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    if (!userId) {
      this.error = 'Invalid user ID.';
      this.router.navigate(['/home/user-management/users']);
      return;
    }

    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = {
          ...user,
          resolvedRoleNames: user.roles.map(r => r.roleName).join(', '),
          resolvedUnitName: user.unit?.name || 'N/A'
        };
        this.selectedRoleIds = user.roles.map(r => r.id);

        this.userForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          middleName: user.middleName,
          username: user.username,
          email: user.email,
          phone: user.phone,
          address: user.address,
          unit: user.unit.id,
          roles: this.selectedRoleIds
        });

        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load user details.';
        this.isLoading = false;
      }
    });
  }

  /** 🟩 Update user details */
  saveChanges(): void {
    //console.log('saveChanges called');
    if (!this.user || this.userForm.invalid) return;

    const formValue = this.userForm.value;
    const combinedRoleIds = Array.from(
      new Set([...this.user.roles.map(r => r.id), ...formValue.roles])
    );

    const updatedUser = {
      ...formValue,
      id: this.user.id,
      password: this.user.password ?? 'default123',
      unitId: formValue.unit,
      roleIds: combinedRoleIds
    };

    this.userService.updateUser(this.user.id!, updatedUser).subscribe({
      next: () => {
        this.toast.success('User updated successfully');
        this.isEditMode = false;
        this.loadUser();
      },
      error: () => this.toast.error('Failed to update user')
    });
  }

  /** 🟦 Update user password */
  updatePassword(user: any, newPassword: string): void {
    if (!newPassword.trim()) return this.toast.error('Password cannot be empty');

    const updatedUser = {
      ...this.user!,
      password: newPassword,
      unitId: this.user!.unit.id,
      roleIds: this.user!.roles.map(r => r.id)
    };

    this.userService.updateUser(this.user!.id!, updatedUser).subscribe({
      next: () => {
        this.toast.success('Password updated successfully');
        this.userForm.get('newPassword')?.reset();
      },
      error: () => this.toast.error('Failed to update password')
    });
  }

  /** 🟨 Attach or update roles */
  updateUserRoles(): void {
    //console.log('updateUserRoles called');
    if (!this.user) return;

    this.loadingRoles = true;
    const payload = { userId: this.user.id!, roleIds: this.selectedRoleIds };

    this.userService.addRolesToUser(payload.userId, payload.roleIds).subscribe({
      next: () => {
        this.toast.success('Roles updated successfully');
        this.loadingRoles = false;
        this.editRoleMode = false;

        // ✅ Delay the reload to avoid backend desync
      setTimeout(() => this.loadUser(), 500);
        //this.loadUser();
      },
      error: () => {
        this.toast.error('Failed to update roles');
        this.loadingRoles = false;
      }
    });
  }

  /** 🧩 Handle role selection */
  onRoleSelect(roleId: number, event: any): void {
    if (event.target.checked) {
      if (!this.selectedRoleIds.includes(roleId)) this.selectedRoleIds.push(roleId);
    } else {
      this.selectedRoleIds = this.selectedRoleIds.filter(id => id !== roleId);
    }
  }

  /** 🟤 Utility + UI Controls */
  get userRolesDisplay(): string {
    return this.user?.roles?.length
      ? this.user.roles.map(r => r.roleName).join(', ')
      : 'No roles assigned';
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  cancelEdit(): void {
    this.loadUser();
    this.isEditMode = false;
  }

  goBack(): void {
    this.router.navigate(['/home/user-management/users']);
  }
}
