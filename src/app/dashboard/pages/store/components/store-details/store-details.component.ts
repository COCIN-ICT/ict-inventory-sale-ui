import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store-details',
  templateUrl: './store-details.component.html',
  styleUrl: './store-details.component.css'
})
export class StoreDetailsComponent {
  stock: any;

  constructor(public router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.stock = nav?.extras?.state?.['stock'];
  }

  

}
