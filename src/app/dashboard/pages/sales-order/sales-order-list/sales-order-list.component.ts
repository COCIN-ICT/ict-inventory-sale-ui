import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SalesOrderService } from '../../../../services/sales-order.service';

@Component({
  selector: 'app-sales-order-list',
  templateUrl: './sales-order-list.component.html',
})
export class SalesOrderListComponent implements OnInit {
  salesOrders: any[] = [];
  loading = false;

  constructor(private svc: SalesOrderService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: res => {
        this.salesOrders = Array.isArray(res) ? res : (res?.data || res);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  edit(id: number) {
    this.router.navigate(['/home/sales-order', id, 'edit']);
  }

  view(id: number) {
    this.router.navigate(['/home/sales-order', id]);
  }
}