import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentWesternunionComponent } from './payment-westernunion.component';

describe('PaymentWesternunionComponent', () => {
  let component: PaymentWesternunionComponent;
  let fixture: ComponentFixture<PaymentWesternunionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentWesternunionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentWesternunionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
