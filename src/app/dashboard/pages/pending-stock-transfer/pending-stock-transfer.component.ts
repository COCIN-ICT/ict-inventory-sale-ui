import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../../services/toast.service';
import { StockTransferService } from '../../../services/stock-transfer.service';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-stock-transfer-list',
  templateUrl: './pending-stock-transfer.component.html',
  styleUrls: ['./pending-stock-transfer.component.css']
})
export class PendingStockTransferComponent implements OnInit {
  pendingTransfers: any[] = [];
  approvedTransfers: any[] = [];
  loading = false;
  activeTab: 'PENDING' | 'APPROVED' = 'PENDING'; // track which tab is active

  constructor(
    private stockTransferService: StockTransferService,
    private storeService: StoreService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadTransfers();
  }

  loadTransfers(): void {
    this.loading = true;
    this.stockTransferService.pendingStockTransfers().subscribe({
      next: (res: any[]) => {
        this.pendingTransfers = res.filter(t => t.status === 'PENDING');
        this.approvedTransfers = res.filter(t => t.status === 'APPROVED');
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.error('Failed to load stock transfers');
      },
    });
  }

  setActiveTab(tab: 'PENDING' | 'APPROVED'): void {
    this.activeTab = tab;
  }

  approveTransfer(transferId: number): void {
    this.loading = true;
    this.stockTransferService.approveStockTransfer(transferId).subscribe({
        next: () => {
            this.toast.success('Stock transfer approved successfully');
            this.loadTransfers();
            
        },
      error: () => {
        this.loading = false;
        this.toast.error('Failed to approve transfer');
      },
    });
    // this.storeService.updateStockTransferStatus(transferId, 'APPROVED').subscribe({
    //   next: () => {
    //     this.toast.success('Stock transfer approved successfully');
    //     this.loadTransfers();
    //   },
    //   error: () => {
    //     this.loading = false;
    //     this.toast.error('Failed to approve transfer');
    //   },
    // });
  }

  

  receiveTransfer(transferId: number): void {
    this.loading = true;

    this.stockTransferService.receiveStockTransfer(transferId).subscribe({
        next: () => {
            this.toast.success('Stock transfer marked as received');
            this.loadTransfers();
            
        },
      error: () => {
        this.loading = false;
        this.toast.error('Failed to receive transfer');
      },
    });
    // this.storeService.updateStockTransferStatus(transferId, 'RECEIVED').subscribe({
    //   next: () => {
    //     this.toast.success('Stock transfer marked as received');
    //     this.loadTransfers();
    //   },
    //   error: () => {
    //     this.loading = false;
    //     this.toast.error('Failed to receive transfer');
    //   },
    // });
  }
}
