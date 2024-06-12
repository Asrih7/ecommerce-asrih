import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaypalAccountComponent } from './paypal-account.component';

describe('PaypalAccountComponent', () => {
  let component: PaypalAccountComponent;
  let fixture: ComponentFixture<PaypalAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaypalAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaypalAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
