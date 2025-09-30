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
  isLoading: boolean = true;
  errorMessage: string = '';


constructor( private productionOrdersServices:ProductionOrderService,
             private toast: ToastService, private router: Router
            ){}

ngOnInit() {
  this.loadProductionOrders();
}

loadProductionOrders(): void {
  this.isLoading = true;
  this.errorMessage = '';

  this.productionOrdersServices.getAllProductionOrders().subscribe({
    next: (res:any) => {
      this.productionOrders = res.data || res.users || res.result || res || []
      this.isLoading = false
      console.log('res', res)
    },
    error: (err) => {
      console.error('err', err);
      this.productionOrders = [];
    }
  })

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

  openForm(){}

}

