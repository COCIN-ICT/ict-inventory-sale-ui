import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseOrderService } from '../../../../../services/purchase-order.service';
import { ToastService } from '../../../../../services/toast.service';
import { BudgetService } from '../../../../../services/budget.service';
import { UnitService } from '../../../../../services/unit.service';

@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.css']
})
export class PurchaseOrderListComponent implements OnInit {
  purchaseOrders: any[] = [];
  isLoading = false;
  selectedStatus: string = 'all'; // 'all', 'PENDING', 'VETTED', 'APPROVED', 'RECEIVED', 'COMPLETED', 'CLEARED', 'CANCELLED', 'REJECTED'

  // Modal state
  showBudgetModal = false;
  budgets: any[] = [];
  filteredBudgets: any[] = [];
  selectedBudget: any = null;
  budgetLineItemId: number | null = null;
  isLoadingBudgets = false;
  isLoadingBudgetDetails = false;

  // Filters
  selectedUnitId: number | null = null;
  selectedYear: number = new Date().getFullYear();
  selectedBudgetType: string = 'EXPENDITURE';
  units: any[] = [];
  years: number[] = [];

  constructor(
    private router: Router,
    private purchaseOrderService: PurchaseOrderService,
    private toast: ToastService,
    private budgetService: BudgetService,
    private unitService: UnitService
  ) {
    // Generate years array (current year ± 5 years)
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      this.years.push(i);
    }
  }

  ngOnInit(): void {
    this.loadPurchaseOrders();
    this.loadUnits();
  }

  loadUnits(): void {
    this.unitService.getUnits().subscribe({
      next: (res: any) => {
        this.units = res?.data || res || [];
      },
      error: (err: any) => {
        console.error('Failed to load units:', err);
      }
    });
  }

  loadPurchaseOrders(): void {
    this.isLoading = true;
    
    let request: any;
    
    if (this.selectedStatus === 'all') {
      request = this.purchaseOrderService.getAllOrders();
    } else if (this.selectedStatus === 'pending') {
      request = this.purchaseOrderService.getPendingOrders();
    } else {
      request = this.purchaseOrderService.getOrdersByStatus(this.selectedStatus);
    }

    request.subscribe({
      next: (res: any) => {
        this.purchaseOrders = res?.data || res || [];
        this.isLoading = false;
      },
      error: (err: any) => {
        this.toast.error(err?.error?.message || err?.message || 'Failed to load purchase orders');
        this.isLoading = false;
      }
    });
  }

  onStatusFilterChange(): void {
    this.loadPurchaseOrders();
  }

  openBudgetModal(): void {
    this.showBudgetModal = true;
    this.selectedBudget = null;
    this.budgetLineItemId = null;
    this.loadBudgets();
  }

  closeBudgetModal(): void {
    this.showBudgetModal = false;
    this.selectedBudget = null;
    this.budgetLineItemId = null;
    this.selectedUnitId = null;
    this.selectedYear = new Date().getFullYear();
    this.selectedBudgetType = 'EXPENDITURE';
  }

  loadBudgets(): void {
    this.isLoadingBudgets = true;
    this.budgetService.getAllBudgets().subscribe({
      next: (res: any) => {
        this.budgets = res?.data || res || [];
        this.applyFilters();
        this.isLoadingBudgets = false;
      },
      error: (err: any) => {
        this.toast.error(err?.error?.message || err?.message || 'Failed to load budgets');
        this.isLoadingBudgets = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.budgets];

    // Filter by year
    if (this.selectedYear) {
      filtered = filtered.filter(b => b.year === this.selectedYear);
    }

    // Filter by budget type
    if (this.selectedBudgetType) {
      filtered = filtered.filter(b => b.budgetType === this.selectedBudgetType);
    }

    // Filter by unit (if budget has unit property)
    if (this.selectedUnitId) {
      filtered = filtered.filter(b => b.unit?.id === this.selectedUnitId || b.unitId === this.selectedUnitId);
    }

    this.filteredBudgets = filtered;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  selectBudget(budget: any): void {
    this.isLoadingBudgetDetails = true;
    this.budgetService.getBudgetById(budget.id).subscribe({
      next: (res: any) => {
        this.selectedBudget = res?.data || res || budget;
        // Set budgetLineItemId from the budget object
        this.budgetLineItemId = this.selectedBudget.budgetLineItemId || null;
        this.isLoadingBudgetDetails = false;
      },
      error: (err: any) => {
        this.toast.error(err?.error?.message || err?.message || 'Failed to load budget details');
        this.selectedBudget = budget;
        this.budgetLineItemId = budget.budgetLineItemId || null;
        this.isLoadingBudgetDetails = false;
      }
    });
  }

  createPurchaseOrder(): void {
    if (!this.budgetLineItemId) {
      this.toast.error('Please select a budget and ensure budgetLineItemId is set');
      return;
    }

    const payload = {
      budgetLineItemId: this.budgetLineItemId
    };
    
    this.purchaseOrderService.createOrder(payload).subscribe({
      next: (res: any) => {
        const id = res.id || res.data?.id || res.result?.id;
        this.toast.success('Purchase Order created successfully');
        this.closeBudgetModal();
        if (id) {
          this.router.navigate([`/home/purchase-order/details/${id}`]);
        } else {
          this.toast.error('Order created but ID not found. Please refresh the list.');
          this.loadPurchaseOrders();
        }
      },
      error: (err: any) => {
        const errorMessage = err?.error?.message || err?.message || 'Failed to create purchase order';
        this.toast.error(errorMessage);
      }
    });
  }

  navigateToDetails(id: number): void {
    this.router.navigate([`/home/purchase-order/details/${id}`]);
  }
}
