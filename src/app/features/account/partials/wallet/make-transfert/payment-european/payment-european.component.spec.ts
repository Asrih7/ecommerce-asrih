import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentEuropeanComponent } from './payment-european.component';

describe('PaymentEuropeanComponent', () => {
  let component: PaymentEuropeanComponent;
  let fixture: ComponentFixture<PaymentEuropeanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentEuropeanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentEuropeanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
