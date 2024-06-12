import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountCreditComponent } from './amount-credit.component';

describe('AmountCreditComponent', () => {
  let component: AmountCreditComponent;
  let fixture: ComponentFixture<AmountCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmountCreditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmountCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
