import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-promotions-stub',
  templateUrl: './sales-promotions-stub.component.html',
  styleUrls: ['./sales-promotions-stub.component.css']
})
export class SalesPromotionsStubComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/home/point-of-sale']);
  }
}
