import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { User } from '../../users.model';
import { UserService } from '../../../../../../services/user.service';

import { UserFormComponent } from '../user-form/user-form.component';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
 

  

  constructor(private dialog: MatDialog, private userService: UserService,
              
            ) {}

  ngOnInit(): void {
    this.loadUsers();

     
  }

    private loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (res: any) => {
        this.users = res.data || res.users || res.result || res || [];
        this.filteredUsers = this.users;
        // Log the first user object to inspect its structure
      if (this.users.length > 0) {
        console.log('User Data Structure:', this.users[0]);
      }
      },
      error: (error) => {
        console.error('Error:', error);
        this.users = [];
        this.filteredUsers = [];
      }
    });
  }

  onSearch(): void {
    const query = this.searchTerm.toLowerCase().trim();

    // If the search query is empty, reload all users.
    if (query === '') {
      this.loadUsers();
      return;
    }

    // Determine if the search query looks like an email.
    if (query.includes('@')) {
      this.userService.getUserByEmail(query).subscribe({
        next: (user: User) => {
          this.filteredUsers = user ? [user] : [];
        },
        error: (error) => {
          console.error('Error searching by email:', error);
          this.filteredUsers = [];
        }
      });
    } else {
      // Otherwise, search by username.
      this.userService.getUserByUsername(query).subscribe({
        next: (user: User) => {
          this.filteredUsers = user ? [user] : [];
        },
        error: (error) => {
          console.error('Error searching by username:', error);
          this.filteredUsers = [];
        }
      });
    }
  }



// New method to open the form for editing
  openEditUser(user: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      data: user // Pass the user object to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      // Check for a result to know if a change was made
      if (result === 'userUpdated') {
        this.loadUsers(); // Refresh the user list
      }
    });
  }

  // Update the create method to also handle afterClosed event
  openCreateUser(): void {
    const dialogRef = this.dialog.open(UserFormComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'userCreated') {
        this.loadUsers();
      }
    });
  }

}
