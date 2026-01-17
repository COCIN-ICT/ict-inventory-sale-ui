import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-items-management',
  templateUrl: './items-management.component.html',
  styleUrls: ['./items-management.component.css']
})
export class ItemsManagementComponent {

  constructor(private router: Router) { }

  navigateToUnitOfMeasure(): void {
    this.router.navigate(['/home/unit-of-measure/all']);
  }

  navigateToItemCategories(): void {
    this.router.navigate(['/home/item-category/all']);
  }

  navigateToItems(): void {
    this.router.navigate(['/home/item/all']);
  }
}
