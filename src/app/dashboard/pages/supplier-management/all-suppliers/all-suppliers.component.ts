import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../../../services/supplier.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-suppliers',
  templateUrl: './all-suppliers.component.html',
  styleUrl: './all-suppliers.component.css'
})
export class AllSuppliersComponent implements OnInit {
  suppliers: any[] = [];

  constructor(private supplierService: SupplierService, private router: Router){}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.supplierService.getAllSuppliers()
    .subscribe({
      next: (res: any) => {
        console.log('API Response:', res);
        // Try different response structures
        this.suppliers = res.data || res.suppliers || res.result || res || [];
        console.log('Final suppliers:', this.suppliers);
      },
      error: (error) => {
        console.error('Error:', error);
        this.suppliers = []; // Set empty array on error
      }
    })
  }

  viewSupplier(supplierId: number) {
    this.router.navigate(['/home/supplier-management/supplier-details', supplierId]);
  }

  editSupplier(supplierId: number) {
    this.router.navigate(['/home/supplier-management/edit-supplier', supplierId]);
  }
} 