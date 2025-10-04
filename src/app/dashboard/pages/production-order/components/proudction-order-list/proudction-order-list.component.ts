import { Component } from '@angular/core';
import { ProductionOrderResponse } from '../../../../../api/models';
import { ProductionOrderApiApiService } from '../../../../../api/services';
import { finalize } from 'rxjs';
import { error } from 'console';
import { ProductionOrderService } from '../../../../../services/production-order.service';
import { ToastService } from '../../../../../services/toast.service';
import { Router } from '@angular/router';

  @Component({
    selector: 'app-proudction-order-list',
    templateUrl: './proudction-order-list.component.html',
    styleUrl: './proudction-order-list.component.css'
  })
  export class ProudctionOrderListComponent {



  productionOrders: ProductionOrderResponse[] = [];
  pendingOrders: ProductionOrderResponse[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';


  constructor( 
    private productionOrdersServices:ProductionOrderService,
    private toast: ToastService, private router: Router
    ){}

  ngOnInit() {
    this.loadProductionOrders();
    this.loadPendingOrders();
  }

  loadProductionOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productionOrdersServices.getAllProductionOrders().subscribe({
      next: (res:any) => {
        this.productionOrders = res.data || res.users || res.result || res || []
        this.isLoading = false
        console.log('res', res)
         console.log('Production Order', this.productionOrders);
      },
      error: (err) => {
        console.error('err', err);
        this.productionOrders = [];
      }
    })

    }

    loadPendingOrders(): void {
    this.productionOrdersServices.getPendingProductionOrders().subscribe({
      next: (orders) => this.pendingOrders = orders,
      error: (err) => console.error('Error loading pending orders', err)
    });
  }


  createProductionOrder():void {
    this.productionOrdersServices.createProductionOrders({}).subscribe({
      next: (res) => {
        var id = res.id

        console.log('Production Order created successfully!', res);
        this.toast.success('Production Order created successfully');
        this.router.navigate([`/home/production-order/${id}`]);


        
      }, 
      error: (err) => {
        this.toast.error(err.error.message);
      }

    })
  }

  navigateToDetails(id:number){
    console.log("Navigating...")
   this.router.navigate([`/home/production-order/${id}`]);

  }

  deleteProductionOrder(POId: number) {
    this.productionOrdersServices.deleteProductionOrder(POId).subscribe({
      next: () => {
        this.toast.success('Input item deleted.');
        this.loadProductionOrders();
      },
      error: (err) => {
        console.error('Error deleting input item', err);
        this.toast.error('Failed to delete input item.');
      }
    });
  }

   vetProductionOrder(orderId: number) {
    this.productionOrdersServices.vetProductionOrder(orderId).subscribe({
      next: (res) => {
        this.toast.success('Production order vetted successfully.');
        console.log('Order vetted:', res);
        this.loadProductionOrders();   // refresh list
        this.loadPendingOrders();      // refresh pending list
      },
      error: (err) => {
        console.error('Error vetting order', err);
        this.toast.error('Failed to vet production order.');
      }
    });
  }

  approveProductionOrder(orderId: number) {
    this.productionOrdersServices.approveProductionOrder(orderId).subscribe({
      next: () => {
        this.toast.success('Order approved successfully');
        this.loadProductionOrders();
        this.loadPendingOrders();
      },
      error: (err) => {
        console.error('Error approving order', err);
        this.toast.error('Failed to approve order.');
      }
    });
  }

  finishProductionOrder(orderId: number) {
    this.productionOrdersServices.finishProductionOrder(orderId).subscribe({
      next: () => {
        this.toast.success('Order finished successfully');
        this.loadProductionOrders();
        this.loadPendingOrders();
      },
      error: (err) => {
        console.error('Error finishing order', err);
        this.toast.error('Failed to finish order.');
      }
    });
  }

  dispenseProductionOrder(orderId: number) {
    this.productionOrdersServices.dispenseProductionOrder(orderId).subscribe({
      next: () => {
        this.toast.success('Order dispensed successfully');
        this.loadProductionOrders();
        this.loadPendingOrders();
      },
      error: (err) => {
        console.error('Error dispensing order', err);
        this.toast.error('Failed to dispense order.');
      }
    });
  }

  

  openForm(){}

}