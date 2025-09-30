import { Component } from '@angular/core';
import { ToastService } from '../../../../../services/toast.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProductionOrderService } from '../../../../../services/production-order.service';
import { ProductionOrderResponse as ProductionOrder } from '../../../../../api/models';

@Component({
  selector: 'app-production-order-detail',
  templateUrl: './production-order-detail.component.html',
  styleUrl: './production-order-detail.component.css'
})
export class ProductionOrderDetailComponent {

  isLoading: boolean = true;
  errorMessage: string ='';
  orderId!: number;
  productionOrder: ProductionOrder = {};

  constructor( private productionOrdersServices: ProductionOrderService, private toast: ToastService,
              private router: Router, private route: ActivatedRoute          
              ){}


  
ngOnInit() {
  this.orderId = Number(this.route.snapshot.paramMap.get('id'));
  this.loadProductionOrders();
}

loadProductionOrders(): void {
  this.isLoading = true;
  this.errorMessage = '';

  this.productionOrdersServices.getProductionOrder(this.orderId).subscribe({
    next: (res:any) => {
      this.productionOrder = res.data || res.users || res.result || res || []
      this.isLoading = false
      console.log('res', res)
    },
    error: (err) => {
      console.error('err', err);
      this.productionOrder = {};
    }
  })

  }


}
