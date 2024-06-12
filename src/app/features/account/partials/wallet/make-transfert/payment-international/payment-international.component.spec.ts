import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentInternationalComponent } from './payment-international.component';

describe('PaymentInternationalComponent', () => {
  let component: PaymentInternationalComponent;
  let fixture: ComponentFixture<PaymentInternationalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentInternationalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentInternationalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
