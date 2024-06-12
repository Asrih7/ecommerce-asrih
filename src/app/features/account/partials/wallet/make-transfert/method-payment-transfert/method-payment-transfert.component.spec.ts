import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodPaymentTransfertComponent } from './method-payment-transfert.component';

describe('MethodPaymentTransfertComponent', () => {
  let component: MethodPaymentTransfertComponent;
  let fixture: ComponentFixture<MethodPaymentTransfertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MethodPaymentTransfertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MethodPaymentTransfertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
