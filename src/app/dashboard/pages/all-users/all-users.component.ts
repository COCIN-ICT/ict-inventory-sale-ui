import { Component, OnInit } from '@angular/core';
import {  UserService } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';
import { User } from '../user-management/users/users.model';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.css'
})
export class AllUsersComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService, private toast: ToastService){}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (res: any) => {
        console.log('API Response:', res);
        // Try different response structures
        this.users = res.data || res.users || res.result || res || [];
        console.log('Final users:', this.users);
      },error: (error) => {
        console.error('Error:', error);
        this.users = []; // Set empty array on error
      }
    })
  }

  


  deleteUser(id: number) {
  if (confirm('Are you sure you want to delete this user?')) {
    console.debug('Attempting to delete user with ID:', id);

    this.userService.deleteUser(id).subscribe({
      next: () => {
        console.log('User deleted successfully');
        this.toast.success('User deleted successfully');
        this.loadUsers();
      },
      error: (error) => {
        console.error(`❌ Error deleting user with ID: ${id}`);
        console.error('🔎 Full error object:', error);

        if (error.error) {
          console.error('📩 Backend error response:', error.error);
        }
        if (error.message) {
          console.error('📝 Error message:', error.message);
        }
        if (error.status) {
          console.error('🌐 HTTP status code:', error.status);
        }

        this.toast.error('Failed to delete user');
      }
    });
  }
}



 

}
