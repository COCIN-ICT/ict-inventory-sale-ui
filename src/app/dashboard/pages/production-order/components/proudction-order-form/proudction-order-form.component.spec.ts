import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProudctionOrderFormComponent } from './proudction-order-form.component';

describe('ProudctionOrderFormComponent', () => {
  let component: ProudctionOrderFormComponent;
  let fixture: ComponentFixture<ProudctionOrderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProudctionOrderFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProudctionOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
