import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditBySavedCardComponent } from './credit-by-saved-card.component';

describe('CreditBySavedCardComponent', () => {
  let component: CreditBySavedCardComponent;
  let fixture: ComponentFixture<CreditBySavedCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditBySavedCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditBySavedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
