import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from '../../../../services/supplier.service';

@Component({
  selector: 'app-supplier-details',
  templateUrl: './supplier-details.component.html',
  styleUrl: './supplier-details.component.css'
})
export class SupplierDetailsComponent implements OnInit {
  supplierId: number = 0;
  loading = false;
  error = '';
  supplier: any = null;

  constructor(
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('SupplierDetailsComponent initialized');
    this.route.params.subscribe(params => {
      console.log('Route params:', params);
      this.supplierId = +params['id'];
      console.log('Supplier ID:', this.supplierId);
      this.loading = true;
      this.loadSupplierDetails();
    });
  }

  loadSupplierDetails() {
    console.log('Loading supplier details for ID:', this.supplierId);
    this.loading = true;
    this.error = '';

    this.supplierService.getSupplierById(this.supplierId).subscribe({
      next: (response: any) => {
        console.log('Supplier details response:', response);
        this.supplier = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching supplier details:', error);
        this.error = 'Failed to load supplier details. Please try again.';
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/home/supplier-management/suppliers']);
  }

  editSupplier() {
    this.router.navigate(['/home/supplier-management/edit-supplier', this.supplierId]);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
} 