import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingStockTransferComponent } from './pending-stock-transfer.component';

describe('PendingStockTransferComponent', () => {
  let component: PendingStockTransferComponent;
  let fixture: ComponentFixture<PendingStockTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PendingStockTransferComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PendingStockTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
