import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProudctionOrderListComponent } from './proudction-order-list.component';

describe('ProudctionOrderListComponent', () => {
  let component: ProudctionOrderListComponent;
  let fixture: ComponentFixture<ProudctionOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProudctionOrderListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProudctionOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
