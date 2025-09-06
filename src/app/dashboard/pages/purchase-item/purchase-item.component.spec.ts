import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseItemComponent } from './purchase-item.component';

describe('PurchaseItemComponent', () => {
  let component: PurchaseItemComponent;
  let fixture: ComponentFixture<PurchaseItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PurchaseItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchaseItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
