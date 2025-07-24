import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.css'
})
export class AllUsersComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: UserService){}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers()
    .subscribe({
      next: (res: any) => {
        console.log('API Response:', res);
        // Try different response structures
        this.users = res.data || res.users || res.result || res || [];
        console.log('Final users:', this.users);
      },
      error: (error) => {
        console.error('Error:', error);
        this.users = []; // Set empty array on error
      }
    })
  }

}
