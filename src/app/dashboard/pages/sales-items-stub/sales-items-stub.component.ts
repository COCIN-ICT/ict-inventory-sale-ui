import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-items-stub',
  templateUrl: './sales-items-stub.component.html',
  styleUrls: ['./sales-items-stub.component.css']
})
export class SalesItemsStubComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/home/point-of-sale']);
  }
}
