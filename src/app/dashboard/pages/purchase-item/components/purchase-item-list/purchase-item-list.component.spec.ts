import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseItemListComponent } from './purchase-item-list.component';

describe('PurchaseItemListComponent', () => {
  let component: PurchaseItemListComponent;
  let fixture: ComponentFixture<PurchaseItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PurchaseItemListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchaseItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
