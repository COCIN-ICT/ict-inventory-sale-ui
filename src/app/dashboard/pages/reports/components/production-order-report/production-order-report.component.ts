import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService, OrderReportRequest } from '../../../../../services/report.service';
import { UnitService } from '../../../../../services/unit.service';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'app-production-order-report',
  templateUrl: './production-order-report.component.html',
  styleUrls: ['./production-order-report.component.css']
})
export class ProductionOrderReportComponent implements OnInit {
  orders: any[] = [];
  isLoading = false;
  errorMessage = '';

  // Filter properties
  statusFilter = '';
  unitIdFilter: number | null = null;
  actionFilter = '';
  userIdFilter: number | null = null;
  fromDateFilter = '';
  toDateFilter = '';

  // Dropdown options
  units: any[] = [];
  users: any[] = [];
  statusOptions = ['PENDING', 'VETTED', 'APPROVED', 'CLEARED', 'REJECTED', 'CANCELLED', 'COMPLETED', 'DISPENSED'];
  actionOptions = ['CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'CLEAR', 'VET'];

  constructor(
    private reportService: ReportService,
    private unitService: UnitService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUnits();
    this.loadUsers();
    this.loadReport();
  }

  loadUnits(): void {
    this.unitService.getUnits().subscribe({
      next: (units) => {
        this.units = units;
      },
      error: (error) => {
        console.error('Error loading units:', error);
      }
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users: any) => {
        this.users = Array.isArray(users) ? users : [];
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  loadReport(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const params: OrderReportRequest = {};
    
    if (this.statusFilter) {
      params.status = this.statusFilter;
    }
    if (this.unitIdFilter !== null) {
      params.unitId = this.unitIdFilter;
    }
    if (this.actionFilter) {
      params.action = this.actionFilter;
    }
    if (this.userIdFilter !== null) {
      params.userId = this.userIdFilter;
    }
    if (this.fromDateFilter) {
      params.fromDate = new Date(this.fromDateFilter).toISOString();
    }
    if (this.toDateFilter) {
      params.toDate = new Date(this.toDateFilter).toISOString();
    }

    this.reportService.getProductionOrderReport(params).subscribe({
      next: (response) => {
        this.orders = Array.isArray(response) ? response : (response?.data || response?.content || []);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading production order report:', error);
        this.errorMessage = 'Failed to load production order report. Please try again.';
        this.isLoading = false;
        this.orders = [];
      }
    });
  }

  onFilterChange(): void {
    this.loadReport();
  }

  clearFilters(): void {
    this.statusFilter = '';
    this.unitIdFilter = null;
    this.actionFilter = '';
    this.userIdFilter = null;
    this.fromDateFilter = '';
    this.toDateFilter = '';
    this.loadReport();
  }

  goBackToReports(): void {
    this.router.navigate(['/home/reports']);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }
}
