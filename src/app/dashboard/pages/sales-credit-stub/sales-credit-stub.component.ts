import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-credit-stub',
  templateUrl: './sales-credit-stub.component.html',
  styleUrls: ['./sales-credit-stub.component.css']
})
export class SalesCreditStubComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/home/point-of-sale']);
  }
}
