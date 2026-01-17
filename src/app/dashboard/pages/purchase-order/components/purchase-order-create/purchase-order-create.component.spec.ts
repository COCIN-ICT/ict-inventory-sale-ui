import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PurchaseOrderCreateComponent } from './purchase-order-create.component';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PurchaseOrderService } from '../../../../../services/purchase-order.service';
import { PurchaseItemService } from '../../../../../services/purchase-item.service';
import { PurchaseQuotationService } from '../../../../../services/purchase-quotation.service';
import { ToastService } from '../../../../../services/toast.service';

describe('PurchaseOrderCreateComponent', () => {
  let component: PurchaseOrderCreateComponent;
  let fixture: ComponentFixture<PurchaseOrderCreateComponent>;

  let orderService: jasmine.SpyObj<PurchaseOrderService>;
  let itemService: jasmine.SpyObj<PurchaseItemService>;
  let quotationService: jasmine.SpyObj<PurchaseQuotationService>;
  let router: jasmine.SpyObj<Router>;
  let toast: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    orderService = jasmine.createSpyObj('PurchaseOrderService', ['createOrder']);
    itemService = jasmine.createSpyObj('PurchaseItemService', ['createPurchaseItem', 'createPurchaseItemWithRequest']);
    quotationService = jasmine.createSpyObj('PurchaseQuotationService', ['createPurchaseQuotation', 'createPurchaseQuotationForOrder']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    toast = jasmine.createSpyObj('ToastService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [PurchaseOrderCreateComponent],
      providers: [
        FormBuilder,
        { provide: PurchaseOrderService, useValue: orderService },
        { provide: PurchaseItemService, useValue: itemService },
        { provide: PurchaseQuotationService, useValue: quotationService },
        { provide: Router, useValue: router },
        { provide: ToastService, useValue: toast }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create order then create items and quotations', fakeAsync(() => {
    component.addedItems = [ { itemId: 1, quantity: 2, unitPrice: 10 } ];
    component.addedQuotations = [ { supplierId: 5, amount: 100 } ];

    // Mock createOrder to return created order with id
    orderService.createOrder.and.returnValue(of({ id: 123 }));
    itemService.createPurchaseItemWithRequest.and.returnValue(of({ id: 1 } as any));
    quotationService.createPurchaseQuotationForOrder.and.returnValue(of({ id: 1 } as any));

    component.form.patchValue({ status: 'PENDING', orderDate: '2026-01-01', subTotal: 20, totalAmount: 120 });

    component.submit();
    tick();

    expect(orderService.createOrder).toHaveBeenCalled();
    expect(itemService.createPurchaseItemWithRequest).toHaveBeenCalledWith(jasmine.objectContaining({ purchaseOrderId: 123 }));
    expect(quotationService.createPurchaseQuotationForOrder).toHaveBeenCalledWith(jasmine.objectContaining({ purchaseOrderId: 123 }));
    expect(toast.success).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/home/purchase-order']);
  }));

  it('should handle createOrder failure', fakeAsync(() => {
    orderService.createOrder.and.returnValue(throwError(() => ({ error: { message: 'fail' } })));
    component.form.patchValue({ status: 'PENDING', orderDate: '2026-01-01', subTotal: 0, totalAmount: 0 });
    component.submit();
    tick();
    expect(toast.error).toHaveBeenCalled();
  }));

});
