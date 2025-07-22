import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  constructor(private router: Router) {}
  year = new Date().getFullYear()

  goToAllUsers() {
  this.router.navigate(['/dashboard/users']);
}

}
