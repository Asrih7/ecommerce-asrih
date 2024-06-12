import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityPaymentComponent } from './security-payment.component';

describe('SecurityPaymentComponent', () => {
  let component: SecurityPaymentComponent;
  let fixture: ComponentFixture<SecurityPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecurityPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
