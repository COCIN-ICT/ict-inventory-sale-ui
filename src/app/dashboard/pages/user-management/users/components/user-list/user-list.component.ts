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
  originalUsers: User[] = [];
 

  

  constructor(private dialog: MatDialog, private userService: UserService,
              
            ) {}

  ngOnInit(): void {
    this.loadUsers();

     
  }

    private loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (res: any) => {
        this.users = res.data || res.users || res.result || res || [];
        this.originalUsers = [...this.users];
        //this.applyFilters();
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



  searchList(): void{
    this.applyFilters();
  }

 private applyFilters(): void {
  let filteredUsers = [...this.originalUsers];

  if (this.searchTerm) {
    filteredUsers = filteredUsers.filter(user => {
      // Return false if the user object is null or undefined
      if (!user) {
        return false;
      }
      
      const searchTermLower = this.searchTerm.toLowerCase();
      
      // Check if the search term exists in username, email, or unitId
      return (
        String(user.username).toLowerCase().includes(searchTermLower) ||
        String(user.email).toLowerCase().includes(searchTermLower) ||
        String(user.unit.name).toLowerCase().includes(searchTermLower)
      );
    });
  }
  
  this.users = filteredUsers;
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
