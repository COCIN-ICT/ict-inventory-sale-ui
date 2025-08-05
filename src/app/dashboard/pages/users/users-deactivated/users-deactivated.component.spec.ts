import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDeactivatedComponent } from './users-deactivated.component';

describe('UsersDeactivatedComponent', () => {
  let component: UsersDeactivatedComponent;
  let fixture: ComponentFixture<UsersDeactivatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersDeactivatedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsersDeactivatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
