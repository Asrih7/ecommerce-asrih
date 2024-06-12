import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaypalBlockComponent } from './paypal-block.component';

describe('PaypalBlockComponent', () => {
  let component: PaypalBlockComponent;
  let fixture: ComponentFixture<PaypalBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaypalBlockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaypalBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
