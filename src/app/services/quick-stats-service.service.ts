import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { ProductionOrderService } from './production-order.service';
import { PurchaseOrderService } from './purchase-order.service';

@Injectable({
  providedIn: 'root'
})
export class QuickStatsService {
  constructor(private productionOrderService: ProductionOrderService,
              private purchaseOrderService: PurchaseOrderService
  ) { }

  getQuickStats(): Observable<{
    pendingProductionOrders: number;
    pendingPurchaseOrders: number;
  }> {
    return forkJoin({
      production: this.productionOrderService.getPendingProductionOrders(),
      purchases: this.purchaseOrderService.getPendingOrders()
    }).pipe(
      map(({ production, purchases }) => {
        const pendingProductionOrders = production.length;
        const pendingPurchaseOrders = purchases.length;
        return { pendingProductionOrders, pendingPurchaseOrders };
      })
    );
  }
}