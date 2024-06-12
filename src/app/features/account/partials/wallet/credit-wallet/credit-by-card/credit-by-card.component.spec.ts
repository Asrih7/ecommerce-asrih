import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditByCardComponent } from './credit-by-card.component';

describe('CreditByCardComponent', () => {
  let component: CreditByCardComponent;
  let fixture: ComponentFixture<CreditByCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditByCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditByCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
