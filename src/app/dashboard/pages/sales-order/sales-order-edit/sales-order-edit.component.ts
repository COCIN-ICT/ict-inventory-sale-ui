import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesOrderService } from '../../../../services/sales-order.service';

@Component({
  selector: 'app-sales-order-edit',
  templateUrl: './sales-order-edit.component.html',
})
export class SalesOrderEditComponent implements OnInit {
  id!: number;
  model: any = {};
  saving = false;
  loading = false;

  constructor(private route: ActivatedRoute, private svc: SalesOrderService, private router: Router) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  load() {
    this.loading = true;
    this.svc.getById(this.id).subscribe({
      next: res => { this.model = res; this.loading = false; },
      error: () => this.loading = false
    });
  }

  save() {
    this.saving = true;
    // patch expects partial update
    this.svc.patch(this.id, this.model).subscribe({
      next: () => this.router.navigate(['/home/sales-order']),
      error: () => this.saving = false
    });
  }
}